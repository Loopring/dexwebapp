import { RESETTING, updateAccount } from 'redux/actions/DexAccount';
import { Section, TextPopupTitle } from 'modals/styles/Styles';
import { connect } from 'react-redux';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons/faGraduationCap';
import { fetchGasPrice } from 'redux/actions/GasPrice';
import { fetchNonce } from 'redux/actions/Nonce';
import { formatter } from 'lightcone/common';
import { getWalletType, saveUpdateRecord } from 'lightcone/api/localStorgeAPI';
import { loginModal, resetPasswordModal } from 'redux/actions/ModalManager';
import { notifyError, notifySuccess } from 'redux/actions/Notification';
import { withTheme } from 'styled-components';
import { withUserPreferences } from 'components/UserPreferenceContext';
import I from 'components/I';
import React from 'react';
import WhyIcon from 'components/WhyIcon';

import { ActionButton } from 'styles/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MyModal } from './styles/Styles';
import { Spin } from 'antd';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

import { sleep } from './components/utils';
import AppLayout from 'AppLayout';

import Group from 'modals/components/Group';
import ModalIndicator from 'modals/components/ModalIndicator';

import config from 'lightcone/config';

class ResetAccountKeyModal extends React.Component {
  state = {
    loading: false,
    processingNum: 1,
  };

  title = (<I s="Reset Layer-2 Keypair" />);
  buttonLabel = (<I s="Reset Layer-2 Keypair" />);
  getInstructions = () => {
    const learnAccountKeysUrl =
      this.props.userPreferences.language === 'zh'
        ? 'https://loopring.org/#/post/new-approach-to-generating-layer-2-account-keys-cn'
        : 'https://loopring.org/#/post/looprings-new-approach-to-generating-layer-2-account-keys';

    return (
      <Section>
        <ul>
          {config.getFeeByType('deposit', this.props.exchange.onchainFees) &&
            Number(
              config.fromWEI(
                'ETH',
                Number(
                  config.getFeeByType('update', this.props.exchange.onchainFees)
                    .fee
                ) +
                  config.getFeeByType(
                    'deposit',
                    this.props.exchange.onchainFees
                  ).fee,
                this.props.exchange.tokens
              )
            ) > 0 && (
              <li>
                <I s="ResetAccountKeyInstruction_Fee_1" />
                {config.getFeeByType('deposit', this.props.exchange.onchainFees)
                  ? config.fromWEI(
                      'ETH',
                      Number(
                        config.getFeeByType(
                          'update',
                          this.props.exchange.onchainFees
                        ).fee
                      ) +
                        config.getFeeByType(
                          'deposit',
                          this.props.exchange.onchainFees
                        ).fee,
                      this.props.exchange.tokens
                    )
                  : '-'}{' '}
                ETH
                <I s="ResetAccountKeyInstruction_Fee_2" />
                <WhyIcon text="FeeWhy" />
              </li>
            )}

          <li>
            <I s="ResetAccountKeyInstruction_Timing" />
            <WhyIcon text="TimingWhy" />
          </li>
        </ul>

        <div
          style={{
            textAlign: 'center',
            color: this.props.theme.green,
            paddingBottom: '12px',
            borderBottom: '1px solid ' + this.props.theme.seperator,
            marginTop: '24px',
            paddingTop: '12px',
            borderTop: '1px solid ' + this.props.theme.seperator,
          }}
        >
          <FontAwesomeIcon
            style={{
              marginRight: '12px',
            }}
            size="2x"
            icon={faGraduationCap}
          />
          <a
            style={{ fontSize: '1rem', color: this.props.theme.green }}
            target="_blank"
            rel="noopener noreferrer"
            href={learnAccountKeysUrl}
          >
            <I s="LearnAccountKeys" />
          </a>
        </div>
      </Section>
    );
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isVisible !== prevProps.isVisible) {
      if (this.props.isVisible === false) {
        this.reset();
      }

      if (
        this.props.isVisible === true &&
        this.props.dexAccount.account.address
      ) {
        (async () => {
          this.props.fetchNonce(this.props.dexAccount.account.address);
          this.props.fetchGasPrice();
        })();
      }
    }
  }

  onClose = () => {
    this.props.closeModal();
  };

  reset() {
    this.setState({
      loading: false,
    });
  }

  processChange = (address, dexAccount, newAccount) => {
    saveUpdateRecord({
      address: window.wallet.address,
      from: {
        publicKeyX: dexAccount.account.publicKeyX,
        publicKeyY: dexAccount.account.publicKeyY,
      },
      to: {
        publicKeyX: newAccount.publicKeyX,
        publicKeyY: newAccount.publicKeyY,
      },
    });

    this.props.updateAccount(newAccount);
  };

  onProceed = () => {
    this.setState({
      loading: true,
    });
    const { dexAccount, exchange, nonce, gasPrice } = this.props;

    (async () => {
      try {
        const fee = formatter
          .toBig(config.getFeeByType('update', exchange.onchainFees).fee)
          .plus(config.getFeeByType('deposit', exchange.onchainFees).fee);

        const { keyPair } = await window.wallet.generateKeyPair(
          exchange.exchangeAddress,
          dexAccount.account.keyNonce + 1
        );

        if (!keyPair || keyPair.secretKey === undefined) {
          throw new Error('Failed to generate keyPair.');
        }
        this.setState({
          processingNum: this.state.processingNum + 1,
        });
        // Add a delay for WalletConnect. Their server is not real time to response.
        // We can change 10 seconds to shorter
        if (getWalletType() === 'WalletConnect') {
          await sleep(6000);
        }

        await window.wallet.createOrUpdateAccount(
          keyPair,
          {
            from: window.wallet.address,
            exchangeAddress: exchange.exchangeAddress,
            fee: fee.toString(),
            chainId: exchange.chainId,
            token: config.getTokenBySymbol('ETH', exchange.tokens),
            amount: '',
            permission: '',
            nonce: nonce.nonce,
            gasPrice: gasPrice.gasPrice,
          },
          true
        );

        const account = {
          ...dexAccount.account,
          publicKeyX: keyPair.publicKeyX,
          publicKeyY: keyPair.publicKeyY,
          accountKey: keyPair.secretKey,
          state: RESETTING,
        };

        this.processChange(window.wallet.address, dexAccount, account);
        notifySuccess(<I s="AccountKeyResetNotification" />, this.props.theme);
      } catch (err) {
        console.log(err);
        notifyError(
          <I s="AccountKeyResetFailedNotification" />,
          this.props.theme
        );
      } finally {
        // Reset state
        this.setState({
          processingNum: 1,
        });

        this.onClose();
      }
    })();
  };

  render() {
    const { theme } = this.props;
    const { processingNum } = this.state;

    let indicator = (
      <ModalIndicator
        title={
          getWalletType() === 'MetaMask'
            ? 'metamaskConfirm'
            : 'walletConnectConfirm'
        }
        tipIcons={[
          <div key="1">
            <FontAwesomeIcon
              icon={processingNum === 1 ? faArrowRight : faCheck}
              style={{
                marginRight: '8px',
                width: '20px',
                color: processingNum === 1 ? theme.primary : theme.green,
              }}
            />
          </div>,
          <div key="2">
            <FontAwesomeIcon
              icon={processingNum === 2 ? faArrowRight : faClock}
              style={{
                marginRight: '8px',
                width: '20px',
                color: processingNum === 2 ? theme.primary : theme.textDim,
              }}
            />
          </div>,
          <div key="3">
            <FontAwesomeIcon
              icon={faClock}
              style={{
                visibility: 'hidden',
              }}
            />
          </div>,
        ]}
        tips={[
          <div key="1">
            <I s={'generateKeyPairTip'} />
          </div>,
          <div key="2">
            <I s={'resetAccountKeyTip'} />
          </div>,
          <I
            key="3"
            s={
              getWalletType() === 'MetaMask'
                ? 'metaMaskPendingTxTip'
                : 'walletConnectPendingTxTip'
            }
          />,
        ]}
        imageUrl={
          getWalletType() === 'MetaMask'
            ? `/assets/images/${theme.imgDir}/metamask_pending.png`
            : ''
        }
        marginTop="60px"
        textAlign={'left'}
      />
    );

    const indicatorPlaceholder = this.state.loading ? (
      <div
        style={{
          height: getWalletType() === 'MetaMask' ? '280px' : '165px',
          display: 'block',
        }}
      />
    ) : (
      <div />
    );

    return (
      <MyModal
        centered
        style={{ top: 40 }}
        width={AppLayout.modalWidth}
        title={<TextPopupTitle>{this.title}</TextPopupTitle>}
        footer={null}
        maskClosable={false}
        closeIcon={<FontAwesomeIcon icon={faTimes} />}
        visible={this.props.isVisible}
        onCancel={() => this.onClose()}
        maxHeight={this.state.loading ? '500px' : 'unset'}
      >
        <Spin indicator={indicator} spinning={this.state.loading}>
          {indicatorPlaceholder}
          <Section>{this.getInstructions()}</Section>
          {this.props.showLoginModal &&
          this.props.dexAccount.account.state !== 'LOGGED_IN' ? (
            <Section>
              <Group>
                <div style={{ height: '20px' }}>
                  <a
                    onClick={() => {
                      this.props.closeModal();
                      this.props.showLoginModal();
                    }}
                    style={{
                      float: 'right',
                    }}
                  >
                    <I s="Try to unlock again?" />
                  </a>
                </div>
              </Group>
            </Section>
          ) : (
            <span />
          )}

          <Section>
            <ActionButton onClick={() => this.onProceed()}>
              {this.buttonLabel}
            </ActionButton>
          </Section>
        </Spin>
      </MyModal>
    );
  }
}

const mapStateToProps = (state) => {
  const { modalManager, dexAccount, nonce, gasPrice, exchange } = state;
  const isVisible = modalManager.isResetPasswordModalVisible;
  return { isVisible, modalManager, dexAccount, nonce, gasPrice, exchange };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showLoginModal: () => dispatch(loginModal(true)),
    closeModal: () => dispatch(resetPasswordModal(false)),
    updateAccount: (account) => dispatch(updateAccount(account)),
    fetchNonce: (address) => dispatch(fetchNonce(address)),
    fetchGasPrice: () => dispatch(fetchGasPrice()),
  };
};

export default withUserPreferences(
  withTheme(connect(mapStateToProps, mapDispatchToProps)(ResetAccountKeyModal))
);
