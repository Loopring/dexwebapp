import { RESETTING, updateAccount } from 'redux/actions/DexAccount';
import { Section, TextPopupTitle } from 'modals/styles/Styles';
import { connect } from 'react-redux';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons/faGraduationCap';
import { fetchAllExchangeInfo, fetchInfo } from 'redux/actions/ExchangeInfo';

import * as fm from 'lightcone/common/formatter';
import { getWalletType, saveUpdateRecord } from 'lightcone/api/localStorgeAPI';
import { loginModal, resetPasswordModal } from 'redux/actions/ModalManager';
import { notifyError, notifySuccess } from 'redux/actions/Notification';
import { withTheme } from 'styled-components';
import { withUserPreferences } from 'components/UserPreferenceContext';
import I from 'components/I';
import React from 'react';
import WhyIcon from 'components/WhyIcon';

import { ActionButton, AssetDropdownMenuItem } from 'styles/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MyModal } from './styles/Styles';
import { Spin } from 'antd';
import { accountUpdate } from 'lightcone/api/LightconeAPI';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

import { sleep } from './components/utils';
import AppLayout from 'AppLayout';
import AssetDropdown from 'modals/components/AssetDropdown';

import Group from 'modals/components/Group';
import ModalIndicator from 'modals/components/ModalIndicator';

import config from 'lightcone/config';

class ResetAccountKeyModal extends React.Component {
  state = {
    loading: false,
    feeToken: null,
    processingNum: 1,
    feeBalance: 0,
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
          <li>
            <I s="ResetAccountKeyInstruction_Timing" />
            <WhyIcon text="RestAccount_Time_Why" />
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

      (async () => {
        this.props.fetchInfo();
      })();

      if (
        this.props.isVisible === true &&
        this.props.exchange &&
        this.props.exchange.updateFees &&
        this.props.exchange.tokens &&
        (this.props.balances !== prevProps.balances ||
          this.props.exchange !== prevProps.exchange ||
          !this.state.feeToken)
      ) {
        this.initFeeToken();
      }
    }
  }

  componentDidMount() {
    if (
      this.props.exchange &&
      this.props.exchange.updateFees &&
      this.props.exchange.updateFees.length > 0 &&
      this.props.exchange.tokens
    ) {
      this.initFeeToken();
    }
  }

  initFeeToken = () => {
    // Assume we can always use ETH
    const ethUpdateFee = this.props.exchange.updateFees.find(
      (a) => a.token === 'ETH'
    );
    console.log('ethUpdateFee', ethUpdateFee);
    const tokenConfig = config.getTokenBySymbol(
      ethUpdateFee.token,
      this.props.exchange.tokens
    );
    const amount = config.fromWEI(
      ethUpdateFee.token,
      ethUpdateFee.fee,
      this.props.exchange.tokens
    );
    tokenConfig.fee = Number(amount);
    tokenConfig.feeInWei = ethUpdateFee.fee;

    if (this.props.balances.balances) {
      this.setState({
        feeBalance: this.getAvailableAmount(
          this.state.feeToken
            ? this.state.feeToken.symbol
            : this.props.exchange.updateFees[0].token,
          this.props.balances.balances
        ),
      });
    }

    this.setState({
      feeToken: this.state.feeToken || tokenConfig,
    });
  };

  getAvailableAmount = (symbol, balances) => {
    const tokens = this.props.exchange.tokens;
    const selectedToken = config.getTokenBySymbol(symbol, tokens);
    const holdBalance = balances.find(
      (ba) => ba.tokenId === selectedToken.tokenId
    );

    return holdBalance
      ? fm.toBig(holdBalance.totalAmount).minus(holdBalance.frozenAmount)
      : fm.toBig(0);
  };

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

  newUpdateAccount = async (keyPair, feeConfig) => {
    try {
      const { dexAccount, exchange } = this.props;
      const validUntil =
        Math.ceil(new Date().getTime() / 1000) + 3600 * 24 * 60;

      // offchainRequest是奇数， order是偶数
      const data = {
        owner: dexAccount.account.owner,
        exchange: exchange.exchangeAddress,
        feeToken: feeConfig.tokenId,
        maxFeeAmount: feeConfig.feeInWei,
        accountId: dexAccount.account.accountId,
        publicKeyX: fm.formatEddsaKey(fm.toHex(fm.toBig(keyPair.publicKeyX))),
        publicKeyY: fm.formatEddsaKey(fm.toHex(fm.toBig(keyPair.publicKeyY))),
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

  onProceed = () => {
    this.setState({
      loading: true,
    });
    const { dexAccount, exchange } = this.props;

    (async () => {
      try {
        console.log('exchangeAddress', exchange.exchangeAddress);
        if (exchange.exchangeAddress === '') {
          throw new Error('exchange.exchangeAddress is empty');
        }
        const { keyPair } = await window.wallet.generateKeyPair(
          exchange.exchangeAddress,
          dexAccount.account.accountNonce
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

        await this.newUpdateAccount(keyPair, this.state.feeToken);

        const account = {
          ...dexAccount.account,
          publicKeyX: fm.formatEddsaKey(fm.toHex(fm.toBig(keyPair.publicKeyX))),
          publicKeyY: fm.formatEddsaKey(fm.toHex(fm.toBig(keyPair.publicKeyY))),
          accountKey: keyPair.secretKey,
          state: RESETTING,
        };

        this.processChange(window.wallet.address, dexAccount, account);
        notifySuccess(<I s="AccountKeyResetNotification" />, this.props.theme);
      } catch (err) {
        console.log(err);
        if (err.message === 'exchange.exchangeAddress is empty') {
          notifyError(
            <I s="AccountKeyResetFailedNotificationAddressEmpty" />,
            this.props.theme
          );
        } else {
          notifyError(
            <I s="AccountKeyResetFailedNotification" />,
            this.props.theme
          );
        }
      } finally {
        // Reset state
        this.setState({
          processingNum: 1,
        });

        this.onClose();
      }
    })();
  };

  handleSelectedFeeToken = (token) => {
    this.setState({
      feeToken: token,
    });

    if (this.props.balances.balances) {
      this.setState({
        feeBalance: this.getAvailableAmount(
          token.symbol,
          this.props.balances.balances
        ),
      });
    }
  };

  render() {
    const { theme, exchange } = this.props;
    const { feeToken, processingNum } = this.state;

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

    // Select tokens as fee token
    let feeTokenOptions =
      exchange.updateFees && exchange.tokens
        ? exchange.updateFees
            .sort((a, b) => (a === 'ETH' ? false : true))
            .map((feeToken, i) => {
              const tokenConfig = config.getTokenBySymbol(
                feeToken.token,
                exchange.tokens
              );
              const option = {};
              option.key = tokenConfig.symbol;

              const amount = Number(
                config.fromWEI(
                  tokenConfig.symbol,
                  feeToken.fee,
                  exchange.tokens
                )
              );
              tokenConfig.fee = amount;
              tokenConfig.feeInWei = feeToken.fee;

              option.text = amount + ' ' + tokenConfig.symbol;
              const menuItem = (
                <AssetDropdownMenuItem
                  key={tokenConfig.symbol}
                  onClick={() => {
                    this.handleSelectedFeeToken(tokenConfig);
                  }}
                >
                  <span>
                    {amount} {tokenConfig.symbol}
                  </span>
                </AssetDropdownMenuItem>
              );

              return menuItem;
            })
        : [];

    feeTokenOptions.sort(function (x, y) {
      return x.key > y.key;
    });
    feeTokenOptions.sort(function (x, y) {
      return x.key === 'ETH' ? -1 : y.key === 'ETH' ? 1 : 0;
    });

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
          <Section>
            <Group label={<I s="reset_keypair_fee_token" />}>
              <div style={{ marginTop: '10px' }}>
                <AssetDropdown
                  options={feeTokenOptions}
                  selected={
                    feeToken ? (
                      <span>
                        {feeToken.fee} {feeToken.symbol}
                      </span>
                    ) : (
                      <span />
                    )
                  }
                />
              </div>
            </Group>
            {this.props.showLoginModal &&
            this.props.dexAccount.account.state !== 'LOGGED_IN' ? (
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
            ) : (
              <span />
            )}
          </Section>
          <Section>
            <ActionButton
              onClick={() => this.onProceed()}
              disabled={
                this.props.dexAccount.account.state === 'LOGGED_IN' &&
                (!this.state.feeToken ||
                  !this.state.feeBalance ||
                  this.state.feeBalance.lt(this.state.feeToken.feeInWei))
              }
            >
              {this.buttonLabel}
            </ActionButton>
          </Section>
        </Spin>
      </MyModal>
    );
  }
}

const mapStateToProps = (state) => {
  const { modalManager, dexAccount, exchange, balances } = state;
  const isVisible = modalManager.isResetPasswordModalVisible;
  return { isVisible, modalManager, dexAccount, exchange, balances };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showLoginModal: () => dispatch(loginModal(true)),
    closeModal: () => dispatch(resetPasswordModal(false)),
    updateAccount: (account) => dispatch(updateAccount(account)),
    fetchAllExchangeInfo: () => dispatch(fetchAllExchangeInfo()),
    fetchInfo: () => dispatch(fetchInfo()),
  };
};

export default withUserPreferences(
  withTheme(connect(mapStateToProps, mapDispatchToProps)(ResetAccountKeyModal))
);
