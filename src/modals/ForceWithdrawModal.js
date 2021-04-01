import { ActionButton, AssetDropdownMenuItem } from 'styles/Styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Instruction,
  MyModal,
  Section,
  TextPopupTitle,
} from 'modals/styles/Styles';

import { Input, Spin } from 'antd';
import { connect } from 'react-redux';
import { showForceWithdrawModal } from 'redux/actions/ModalManager';
import AppLayout from 'AppLayout';
import AssetDropdown from 'modals/components/AssetDropdown';
import ErrorMessage from 'modals/components/ErrorMessage';
import Group from 'modals/components/Group';
import I from 'components/I';
import ModalIndicator from 'modals/components/ModalIndicator';
import React from 'react';
import WhyIcon from 'components/WhyIcon';
import styled, { withTheme } from 'styled-components';

import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

import * as fm from 'lightcone/common/formatter';
import { fetchGasPrice } from 'redux/actions/GasPrice';
import { fetchInfo } from 'redux/actions/ExchangeInfo';
import { fetchNonce } from 'redux/actions/Nonce';
import { fetchWalletBalance } from 'modals/components/utils';
import {
  getEstimatedBlockTime,
  lightconeGetAccount,
} from 'lightcone/api/LightconeAPI';
import { getWalletType } from 'lightcone/api/localStorgeAPI';
import { notifyError, notifySuccess } from 'redux/actions/Notification';
import WalletConnectIndicator from 'modals/components/WalletConnectIndicator';
import WalletConnectIndicatorPlaceholder from 'modals/components/WalletConnectIndicatorPlaceholder';
import config from 'lightcone/config';

const { Search } = Input;

const SearchStyled = styled(Search)`
  .ant-input-suffix {
    display: table;
    height: 100%;

    .ant-input-search-icon {
      display: ${(props) => (props.loading ? 'table-cell' : 'none')};
      vertical-align: middle;
      color: ${(props) => props.theme.textDim};
    }
  }
`;

class ForceWithdrawModal extends React.Component {
  state = {
    tokenSymbol: 'ETH',
    loading: false,
    addressValue: '',
    ethBalance: '',
    feeCost: '',
  };

  componentDidUpdate(prevProps, prevState) {
    // When the modal becomes visible
    if (this.props.isVisible && !prevProps.isVisible && window.wallet) {
      this.setState({
        addressValue: window.wallet.address,
      });
      this.fetchEstimatedBlockTime();
      this.loadData();

      (async () => {
        this.props.fetchInfo();
        this.props.fetchNonce(window.wallet.address);
        this.props.fetchGasPrice();
      })();
    }

    if (
      this.props.isVisible === false &&
      this.props.isVisible !== prevProps.isVisible
    ) {
      this.setState({
        loading: false,
        addressValue: '',
        ethBalance: '',
        feeCost: '',
      });
    }
  }

  handleCurrencyTypeSelect = (tokenSymbol) => {
    this.setState({
      tokenSymbol,
    });
  };

  getFeeCost = () => {
    if (this.props.exchange && this.props.exchange.onchainFees) {
      const feeConfig = config.getFeeByType(
        'withdraw',
        this.props.exchange.onchainFees
      );
      return feeConfig ? feeConfig.fee : '0';
    } else return '0';
  };

  getGasCost = () => {
    if (this.props.gasPrice.gasPrice && this.props.exchange.isInitialized) {
      const gasLimit = config.getGasLimitByType('withdraw').gas;
      const gasPrice = fm.fromGWEI(this.props.gasPrice.gasPrice);
      return config.fromWEI(
        'ETH',
        gasPrice.times(gasLimit),
        this.props.exchange.tokens
      );
    }
  };

  fetchEstimatedBlockTime = () => {
    (async () => {
      try {
        let blockTime = await getEstimatedBlockTime();
        this.setState({
          estimatedBlockTime: blockTime,
        });
      } catch (e) {
        console.log('e', e);
      } finally {
      }
    })();
  };

  loadData = () => {
    (async () => {
      if (this.props.exchange && this.props.exchange.isInitialized) {
        let ethBalance = (
          await fetchWalletBalance(
            window.wallet.address,
            ['ETH'],
            this.props.exchange.tokens
          )
        )[0].balance;
        ethBalance = ethBalance.toString().replace(/,/g, '');
        const fee = this.getFeeCost();
        this.setState({
          ethBalance,
          feeCost: config.fromWEI('ETH', fee, this.props.exchange.tokens),
        });
      }
    })();
  };

  submitForceWithdrawal() {
    this.setState({
      loading: true,
    });

    (async () => {
      try {
        const {
          chainId,
          tokens,
          exchangeAddress,
          depositAddress,
        } = this.props.exchange;
        const { gasPrice } = this.props.gasPrice;

        const relayAccount = await lightconeGetAccount(window.wallet.address);
        console.log('account', relayAccount);

        await window.wallet.forceWithdrawal(
          {
            accountID: relayAccount.accountId,
            exchangeAddress,
            chainId,
            token: config.getTokenBySymbol(this.state.tokenSymbol, tokens)
              .address,
            nonce: this.props.nonce.nonce,
            gasPrice,
            fee: this.getFeeCost(),
          },
          true
        );

        notifySuccess(
          <I s="WithdrawInstructionNotification" />,
          this.props.theme,
          15
        );
      } catch (err) {
        notifyError(
          <I s="WithdrawInstructionNotificationFailed" />,
          this.props.theme
        );
        console.log(err);
      } finally {
        this.props.closeModal();
        this.setState({
          loading: false,
        });
      }
    })();
  }

  onClick = () => {
    this.submitForceWithdrawal();
  };

  onToAddressChange = async (e) => {
    const value = e.target.value;
    // Update the search UI
    this.setState({
      addressValue: value,
    });
  };

  render() {
    const theme = this.props.theme;
    const { tokens } = this.props.exchange;
    const { feeCost, ethBalance } = this.state;
    const gasCost = this.getGasCost();
    const totalFee =
      !!gasCost && !!feeCost ? Number(feeCost) + Number(gasCost) : 0;
    const ethEnough =
      !ethBalance || !gasCost || !feeCost || totalFee < Number(ethBalance);

    const selectedToken = config.getTokenBySymbol(
      this.state.tokenSymbol,
      tokens
    );
    const options = tokens
      .filter((a) => a.enabled)
      .map((token, i) => {
        const option = {};
        option.key = token.symbol;
        option.text = token.symbol + ' - ' + token.name;
        if (token.memo) {
          option.text = option.text + '(' + token.memo + ')';
        }

        const menuItem = (
          <AssetDropdownMenuItem
            key={i}
            onClick={() => {
              this.handleCurrencyTypeSelect(token.symbol);
            }}
          >
            <span>
              {token.name.split('-').length - 1 >= 2 ? (
                <div>{token.symbol}</div>
              ) : (
                <div>
                  {token.symbol} - <I s={token.name} />{' '}
                </div>
              )}{' '}
              {token.memo ? '(' : ''} {token.memo ? <I s={token.memo} /> : ''}{' '}
              {token.memo ? ')' : ''}
            </span>
          </AssetDropdownMenuItem>
        );

        return menuItem;
      });

    let indicator;
    if (getWalletType() !== 'MetaMask') {
      indicator = <WalletConnectIndicator />;
    } else {
      indicator = (
        <ModalIndicator
          title={
            getWalletType() === 'MetaMask'
              ? 'metamaskConfirm'
              : 'walletConnectConfirm'
          }
          tips={[
            <div key="1">
              <I
                s={
                  getWalletType() === 'MetaMask'
                    ? 'metaMaskPendingTxTip'
                    : 'walletConnectPendingTxTip'
                }
              />
            </div>,
          ]}
          imageUrl={
            getWalletType() === 'MetaMask'
              ? `/assets/images/${theme.imgDir}/metamask_pending.png`
              : ``
          }
          marginTop="60px"
        />
      );
    }

    let isWalletConnectLoading =
      this.state.loading && getWalletType() !== 'MetaMask';

    return (
      <MyModal
        centered
        width={AppLayout.modalWidth}
        title={
          <TextPopupTitle>
            <I s="Make a Force Withdrawal" />
          </TextPopupTitle>
        }
        footer={null}
        maskClosable={false}
        closeIcon={<FontAwesomeIcon icon={faTimes} />}
        visible={this.props.isVisible}
        onCancel={() => this.props.closeModal()}
        maxHeight={this.state.loading ? '500px' : 'unset'}
      >
        <Spin spinning={this.state.loading} indicator={indicator}>
          <WalletConnectIndicatorPlaceholder
            isWalletConnectLoading={isWalletConnectLoading}
          />
          <Section
            style={{
              display: isWalletConnectLoading ? 'none' : 'block',
            }}
          >
            <Instruction>
              <I s="WithdrawInstruction_1" />
            </Instruction>
            <ul>
              <li>
                <I s="WithdrawInstruction_Timing" />
                <WhyIcon text="TimingWhy" />
              </li>
              {feeCost && Number(feeCost) > 0 && (
                <li>
                  <I s="WithdrawInstruction_Fee_1" />
                  {this.state.estimatedBlockTime}
                  <I s="WithdrawInstruction_Fee_2" />
                  {feeCost ? feeCost : '-'} ETH
                  <WhyIcon text="FeeWhy" />
                </li>
              )}
            </ul>
          </Section>
          <Section
            style={{
              display: isWalletConnectLoading ? 'none' : 'block',
            }}
          >
            <Group label={<I s="Asset" />}>
              <AssetDropdown
                options={options}
                selected={
                  <span>
                    {selectedToken.name.split('-').length - 1 >= 2 ? (
                      <div>{selectedToken.symbol}</div>
                    ) : (
                      <div>
                        {selectedToken.symbol} - <I s={selectedToken.name} />{' '}
                      </div>
                    )}{' '}
                    {selectedToken.memo ? '(' : ''}{' '}
                    {selectedToken.memo ? <I s={selectedToken.memo} /> : ''}{' '}
                    {selectedToken.memo ? ')' : ''}
                  </span>
                }
              />
            </Group>
            <Group label={<I s="Recipient Ethereum Address" />}>
              <SearchStyled
                suffix={<span key="search_suffix" />}
                style={{
                  color: theme.textWhite,
                }}
                value={this.state.addressValue}
                disabled={true}
              />
              <ErrorMessage
                isWithdrawal={true}
                ethEnough={ethEnough}
                amount={'1'}
                selectedToken={''}
                errorMessage1={''}
                errorToken={''}
                errorMessage2={''}
                validateAmount={true}
                validateAddress={true}
                errorAddressMessage={''}
              />
            </Group>
          </Section>

          <Section
            style={{
              display: isWalletConnectLoading ? 'none' : 'block',
            }}
          >
            <ActionButton
              disabled={this.state.loading}
              onClick={() => this.onClick()}
            >
              <I s="Force Withdraw" />
            </ActionButton>
          </Section>
        </Spin>
      </MyModal>
    );
  }
}

const mapStateToProps = (state) => {
  const { modalManager, exchange, nonce, gasPrice } = state;
  const isVisible = modalManager.isForceWithdrawModalVisible;
  return {
    isVisible,
    modalManager,
    exchange,
    nonce,
    gasPrice,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(showForceWithdrawModal(false)),
    showModal: (token) => dispatch(showForceWithdrawModal(true, token)),
    fetchNonce: (address) => dispatch(fetchNonce(address)),
    fetchGasPrice: () => dispatch(fetchGasPrice()),
    fetchInfo: () => dispatch(fetchInfo()),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(ForceWithdrawModal)
);
