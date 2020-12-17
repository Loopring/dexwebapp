import { ActionButton } from 'styles/Styles';
import { AddressDiv, Section, TextPopupTitle } from 'modals/styles/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LOGGED_IN, RESETTING, updateAccount } from 'redux/actions/DexAccount';
import { MyModal } from './styles/Styles';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

import { lightconeGetAccount } from 'lightcone/api/LightconeAPI';
import { loginModal, resetPasswordModal } from 'redux/actions/ModalManager';
import { notifyError } from 'redux/actions/Notification';
import { withTheme } from 'styled-components';
import AppLayout from 'AppLayout';
import GenerateKeyPairIndicator from 'modals/components/GenerateKeyPairIndicator';
import GenerateKeyPairIndicatorPlaceholder from 'modals/components/GenerateKeyPairIndicatorPalceholder';
import Group from 'modals/components/Group';
import I from 'components/I';
import React from 'react';

class LoginModal extends React.Component {
  state = {
    loading: false,
  };

  onClose = () => {
    this.props.closeModal();
    this.setState({
      showError: false,
      loading: false,
    });
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

        const result = await window.wallet.generateKeyPair(
          exchangeAddress,
          relayAccount.keyNonce
        );

        const { keyPair, error } = result;

        if (error) {
          throw new Error(error.message);
        }

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
            state,
          });

          _this.onClose();
        } else {
          _this.setState({
            loading: false,
            showError: relayAccount.keyNonce === account.keyNonce,
          });

          updateAccount({
            ...account,
            publicKeyX: relayAccount.publicKeyX,
            publicKeyY: relayAccount.publicKeyY,
            keyNonce: relayAccount.keyNonce,
          });
        }
      } catch (err) {
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
      indicator = <GenerateKeyPairIndicator title={'Logging in...'} />;
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
