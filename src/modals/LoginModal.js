import { ActionButton } from 'styles/Styles';
import { AddressDiv, Section, TextPopupTitle } from 'modals/styles/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LOGGED_IN, RESETTING, updateAccount } from 'redux/actions/DexAccount';
import { MyModal } from './styles/Styles';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

import {
  accountUpdate,
  getExchangeInfo,
  lightconeGetAccount,
} from 'lightcone/api/LightconeAPI';
import { loginModal, resetPasswordModal } from 'redux/actions/ModalManager';
import { notifyError, notifySuccess } from 'redux/actions/Notification';
import { withTheme } from 'styled-components';
import AppLayout from 'AppLayout';
import BigNumber from 'bignumber.js';
import GenerateKeyPairIndicator from 'modals/components/GenerateKeyPairIndicator';
import GenerateKeyPairIndicatorPlaceholder from 'modals/components/GenerateKeyPairIndicatorPalceholder';
import Group from 'modals/components/Group';
import I from 'components/I';
import React from 'react';

import * as fm from 'lightcone/common/formatter';

class LoginModal extends React.Component {
  state = {
    loading: false,
    approveTxCount: 1,
    processingNum: 1,
  };

  componentDidUpdate(prevProps, prevState) {
    // When the modal becomes visible
    if (
      (this.props.isVisible !== prevProps.isVisible ||
        this.props.dexAccount.account.address !==
          prevProps.dexAccount.account.address) &&
      this.props.isVisible &&
      window.wallet
    ) {
      (async () => {
        try {
          const relayAccount = await lightconeGetAccount(window.wallet.address);
          if (!!relayAccount.publicKeyX && !!relayAccount.publicKeyY) {
          } else {
            // Two signs
            console.log('two txCount');
            this.setState({
              approveTxCount: 2,
            });
          }
        } catch (err) {
          console.log('login failed', err);
        }
      })();
    }
  }

  onClose = () => {
    this.props.closeModal();
    this.setState({
      showError: false,
      loading: false,
      approveTxCount: 1,
      processingNum: 1,
    });
  };

  // Sign second times
  newUpdateAccount = async (keyPair) => {
    try {
      const { dexAccount } = this.props;
      const validUntil = new Date().getTime() / 1000 + 3600 * 24 * 60;

      const info = await getExchangeInfo();

      // offchainRequest是奇数， order是偶数
      const data = {
        owner: dexAccount.account.owner,
        exchange: info['exchangeAddress'],
        feeToken: 0,
        // maxFeeAmount: 4000000000000000,
        maxFeeAmount: 0,
        accountId: dexAccount.account.accountId,
        publicKeyX: keyPair.publicKeyX,
        publicKeyY: keyPair.publicKeyY,
        nonce: dexAccount.account.accountNonce,
        validUntil: Math.floor(validUntil),
      };

      const result = await window.wallet.accountUpdate(data);
      const apiKey = await accountUpdate(data, result.ecdsaSig);

      // notifySuccess(<I s="LoginApiKeyNotification" />, this.props.theme);
    } catch (err) {
      console.log('accountUpdate failed', err);
      // notifyError(<I s="LoginApiKeySetFailedNotification" />, this.props.theme);
      // Throw error so that users can retry
      throw err;
    } finally {
      this.onClose();
    }
  };

  onClick = () => {
    this.setState({
      loading: true,
      showError: false,
    });

    const _this = this;
    const { updateAccount, exchangeAddress } = this.props;
    const { account } = this.props.dexAccount;

    (async () => {
      try {
        const relayAccount = await lightconeGetAccount(window.wallet.address);
        // console.log('relayAccount', relayAccount);

        const result = await window.wallet.generateKeyPair(
          exchangeAddress,
          !!relayAccount.publicKeyX && !!relayAccount.publicKeyY
            ? relayAccount.accountNonce - 1
            : 0
        );
        let { keyPair, error } = result;

        keyPair = {
          ...keyPair,
          publicKeyX: fm.formatEddsaKey(
            new BigNumber(keyPair.publicKeyX).toString(16)
          ),
          publicKeyY: fm.formatEddsaKey(
            new BigNumber(keyPair.publicKeyY).toString(16)
          ),
        };

        if (error) {
          throw new Error(error.message);
        }

        this.setState({
          processingNum: this.state.processingNum + 1,
        });

        if (!!relayAccount.publicKeyX && !!relayAccount.publicKeyY) {
          // Changed in 3.6
          if (
            !!keyPair &&
            !!keyPair.secretKey &&
            keyPair.publicKeyX === relayAccount.publicKeyX &&
            keyPair.publicKeyY === relayAccount.publicKeyY
          ) {
            const state = relayAccount.frozen ? RESETTING : LOGGED_IN;
            updateAccount({
              ...account,
              accountKey: keyPair.secretKey,
              publicKeyX: keyPair.publicKeyX,
              publicKeyY: keyPair.publicKeyY,
              state,
            });

            _this.onClose();
            notifySuccess(<I s="Login Successfully" />, this.props.theme);
          } else {
            _this.setState({
              loading: false,
            });
            updateAccount({
              ...account,
              publicKeyX: relayAccount.publicKeyX,
              publicKeyY: relayAccount.publicKeyY,
            });

            notifyError(<I s="LoginFailedNotification" />, this.props.theme);
          }
        } else {
          await this.newUpdateAccount(keyPair);

          // Set to LOGGED_IN directly.
          updateAccount({
            ...account,
            accountNonce: account.accountNonce + 1, // 在update account之后，account nonce 在relay会 +1
            accountKey: keyPair.secretKey,
            publicKeyX: keyPair.publicKeyX,
            publicKeyY: keyPair.publicKeyY,
            state: LOGGED_IN,
          });

          // 1 hour duration
          notifySuccess(
            <I s="LoginSuccessfullyFirstDeposit" />,
            this.props.theme,
            3600
          );
        }
      } catch (err) {
        console.log('login failed', err);
        notifyError(<I s="LoginFailedNotification" />, this.props.theme);
        _this.setState({
          loading: false,
          showError: false,
        });
      }
    })();
  };

  render() {
    let indicator = <div />;

    // indicatorPlaceholder is used to set the height of a modal dynamically.
    let indicatorPlaceholder = <div />;
    if (this.state.loading) {
      indicator = (
        <GenerateKeyPairIndicator
          title={'Logging in...'}
          approveTxCount={this.state.approveTxCount}
          processingNum={this.state.processingNum}
        />
      );
      indicatorPlaceholder = <GenerateKeyPairIndicatorPlaceholder />;
    }

    return (
      <MyModal
        centered
        width={AppLayout.modalWidth}
        title={
          <TextPopupTitle>
            <I s="Unlock" />
          </TextPopupTitle>
        }
        footer={null}
        maskClosable={false}
        closeIcon={<FontAwesomeIcon icon={faTimes} />}
        visible={this.props.isVisible}
        onCancel={() => this.onClose()}
        maxHeight={this.state.loading ? '500px' : 'unset'}
      >
        <Spin spinning={this.state.loading} indicator={indicator}>
          {indicatorPlaceholder}
          <Section
            style={{
              display: this.state.loading ? 'none' : 'block',
            }}
          >
            <Group label={<I s="My Address" />}>
              <AddressDiv>{this.props.dexAccount.account.address}</AddressDiv>
            </Group>
            <Group>
              {this.state.showError ? (
                <div style={{ color: this.props.theme.red }}>
                  <FontAwesomeIcon
                    style={{ marginRight: '10px' }}
                    icon={faExclamationTriangle}
                  />
                  <I s="LoginFailedIncorrectAccountKey" />
                </div>
              ) : (
                <span />
              )}
            </Group>
          </Section>

          <Section
            style={{
              display: this.state.loading ? 'none' : 'block',
            }}
          >
            <Group>
              <div style={{ height: '20px' }}>
                <a
                  onClick={() => {
                    this.props.closeModal();
                    this.props.resetPasswordModal(true);
                  }}
                  style={{
                    float: 'right',
                  }}
                >
                  <I s="Reset Layer-2 Keypair" />
                </a>
              </div>
            </Group>
          </Section>

          <Section
            style={{
              display: this.state.loading ? 'none' : 'block',
            }}
          >
            <Group>
              <ActionButton onClick={() => this.onClick()}>
                <I s="Unlock" />
              </ActionButton>
            </Group>
          </Section>
        </Spin>
      </MyModal>
    );
  }
}

const mapStateToProps = (state) => {
  const { modalManager, dexAccount, exchange } = state;
  const isVisible = modalManager.isLoginModalVisible;
  return {
    isVisible,
    modalManager,
    dexAccount,
    exchangeAddress: exchange.exchangeAddress,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(loginModal(false)),
    resetPasswordModal: (show) => dispatch(resetPasswordModal(show)),
    updateAccount: (account) => dispatch(updateAccount(account)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(LoginModal)
);
