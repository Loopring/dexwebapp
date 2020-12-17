import { ActionButton, AssetDropdownMenuItem } from 'styles/Styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Instruction,
  MyModal,
  Section,
  TextPopupTitle,
} from 'modals/styles/Styles';
import { REGISTERING, updateAccount } from 'redux/actions/DexAccount';

import { Spin } from 'antd';
import { connect } from 'react-redux';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faHandPointRight } from '@fortawesome/free-solid-svg-icons/faHandPointRight';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { fetchAllowance, fetchWalletBalance } from 'modals/components/utils';
import { fetchGasPrice } from 'redux/actions/GasPrice';
import { fetchNonce } from 'redux/actions/Nonce';
import { formatter } from 'lightcone/common';
import { getWalletType } from 'lightcone/api/localStorgeAPI';
import { notifyError, notifySuccess } from 'redux/actions/Notification';
import { registerAccountModal } from 'redux/actions/ModalManager';

import { sleep } from './components/utils';
import { withTheme } from 'styled-components';
import AppLayout from 'AppLayout';
import AssetDropdown from 'modals/components/AssetDropdown';
import ErrorMessage from 'modals/components/ErrorMessage';
import Group from 'modals/components/Group';
import I from 'components/I';
import LabelValue from 'modals/components/LabelValue';
import ModalIndicator from 'modals/components/ModalIndicator';
import NumericInput from 'components/NumericInput';
import React from 'react';
import WalletConnectIndicator from 'modals/components/WalletConnectIndicator';
import WalletConnectIndicatorPlaceholder from 'modals/components/WalletConnectIndicatorPlaceholder';
import WhyIcon from 'components/WhyIcon';
import config from 'lightcone/config';

class NewRegisterAccountModal extends React.Component {
  state = {
    selectedTokenSymbol: 'ETH',
    errorMessage1: '',
    errorToken: '',
    errorMessage2: '',
    loading: false,
    amount: null,
    validateAmount: true,
    availableAmount: 0,
    ethBalance: 0,
    allowance: 0,
    approveTxCount: 0,
    ethEnough: true,
    processingNum: 1,
    balanceOnEthereumDict: {},
  };

  title = (<I s="Activate Layer-2" />);
  buttonLabel = (<I s="Activate Layer-2" />);

  componentDidUpdate(prevProps, prevState) {
    // When the modal becomes visible
    if (
      (this.props.isVisible !== prevProps.isVisible ||
        this.props.dexAccount.account.address !==
          prevProps.dexAccount.account.address) &&
      this.props.isVisible &&
      window.wallet
    ) {
      const selectedTokenSymbol = this.state.selectedTokenSymbol;
      this.loadData(selectedTokenSymbol, true);
      (async () => {
        this.props.fetchNonce(this.props.dexAccount.account.address);
        this.props.fetchGasPrice();
      })();
    }

    if (
      this.props.isVisible === false &&
      this.props.isVisible !== prevProps.isVisible
    ) {
      this.setState({
        loading: false,
        amount: null,
        validateAmount: true,
        availableAmount: 0,
        ethBalance: 0,
        allowance: 0,
        approveTxCount: 0,
        ethEnough: true,
        processingNum: 1,
        balanceOnEthereumDict: {},
      });
    }
  }

  depositTo_3_6() {
    this.setState({
      loading: true,
    });

    (async () => {
      try {
        const { approveTxCount, amount } = this.state;
        const symbol = this.state.selectedTokenSymbol;
        console.log('approveTxCount', approveTxCount, symbol);

        const { gasPrice, exchange } = this.props;
        let nonce = this.props.nonce.nonce;
        const { chainId, tokens, exchangeAddress, depositAddress } = exchange;

        if (approveTxCount === 2) {
          await window.wallet.approveZero(
            config.getTokenBySymbol(symbol, tokens).address,
            depositAddress,
            chainId,
            nonce,
            gasPrice.gasPrice,
            true
          );
          this.setState({
            processingNum: this.state.processingNum + 1,
          });
          nonce += 1;
          // Add a delay for WalletConnect. Their server is not real time to response.
          // We can change 10 seconds to shorter
          if (getWalletType() === 'WalletConnect') {
            await sleep(6000);
          }
        }

        // Approve
        if (approveTxCount !== 0) {
          await window.wallet.approveMax(
            config.getTokenBySymbol(symbol, tokens).address,
            depositAddress,
            chainId,
            nonce,
            gasPrice.gasPrice,
            true
          );
          nonce += 1;
          this.setState({
            processingNum: this.state.processingNum + 1,
          });
          // Add a delay for WalletConnect. Their server is not real time to response.
          // We can change 10 seconds to shorter
          if (getWalletType() === 'WalletConnect') {
            await sleep(6000);
          }
        }

        await window.wallet.depositTo_3_6(
          {
            exchangeAddress,
            chainId,
            token: config.getTokenBySymbol(symbol, tokens),
            fee: 0, // No deposit fee
            amount,
            nonce,
            gasPrice: gasPrice.gasPrice,
          },
          true
        );

        const account = {
          address: window.wallet.address,
          state: REGISTERING,
        };

        this.props.updateAccount(account);

        // TODO: setReferrer or promotion code

        notifySuccess(
          <I s="DepositInstructionNotification" />,
          this.props.theme,
          3600
        );
      } catch (err) {
        console.log('depositTo_3_6', err);
        notifyError(
          <I s="DepositInstructionNotificationFailed" />,
          this.props.theme
        );
      } finally {
        this.props.closeModal();
        this.setState({
          loading: false,
          amount: null,
          processingNum: 1,
        });
      }
    })();
  }

  handleCurrencyTypeSelect = (tokenSymbol) => {
    this.props.registerAccountModal(tokenSymbol);
    this.loadData(tokenSymbol);

    console.log('tokenSymbol', tokenSymbol);

    // Reset amount and error message
    this.setState({
      selectedTokenSymbol: tokenSymbol,
      amount: null,
      ethEnough: true,
      validateAmount: true,
    });
  };

  loadData(tokenSymbol, loadETH = false) {
    (async () => {
      try {
        let tokenBalance = (
          await fetchWalletBalance(
            this.props.dexAccount.account.address,
            [tokenSymbol],
            this.props.exchange.tokens
          )
        )[0].balance;
        tokenBalance = tokenBalance.toString().replace(/,/g, '');

        const ethBalance =
          tokenSymbol.toUpperCase() === 'ETH'
            ? tokenBalance
            : loadETH
            ? (
                await fetchWalletBalance(
                  this.props.dexAccount.account.address,
                  ['ETH'],
                  this.props.exchange.tokens
                )
              )[0].balance
            : this.state.ethBalance;

        const allowance = await fetchAllowance(
          this.props.dexAccount.account.address,
          tokenSymbol,
          this.props.exchange.tokens
        );

        let txCount = 0;
        if (
          tokenSymbol.toUpperCase() !== 'ETH' &&
          this.state.amount &&
          Number(this.state.amount) > allowance
        ) {
          txCount = allowance === 0 ? 1 : 2;
        }

        const cost = this.getFeeCost(txCount);
        let ethEnough = true;
        if (tokenSymbol.toUpperCase() !== 'ETH') {
          ethEnough = cost <= ethBalance;
        } else {
          ethEnough =
            cost +
              (this.state.amount && Number(this.state.amount) >= 0
                ? Number(this.state.amount)
                : 0) <=
            ethBalance;
        }

        let validateAmount = !this.state.amount;
        if (!validateAmount) {
          validateAmount =
            tokenSymbol.toUpperCase() !== 'ETH'
              ? this.state.amount <= tokenBalance
              : ethEnough;
        }

        const balanceOnEthereumDict = {};
        const walletBalances = await fetchWalletBalance(
          this.props.dexAccount.account.address,
          this.props.exchange.tokens.map((token) => token.symbol),
          this.props.exchange.tokens
        );
        walletBalances.forEach((ba) => {
          balanceOnEthereumDict[ba.symbol] = ba.balance;
        });

        this.setState({
          availableAmount: tokenBalance,
          ethBalance,
          allowance,
          ethEnough,
          approveTxCount: txCount,
          validateAmount,
          balanceOnEthereumDict,
        });
      } catch (error) {}
    })();
  }

  getFeeCost = (approveTxCount) => {
    const gasPrice = formatter.fromGWEI(this.props.gasPrice.gasPrice);
    const approveGas = approveTxCount * config.getGasLimitByType('approve').gas;
    const depositGas = config.getGasLimitByType('depositTo').gas;
    const gasCost = gasPrice.times(approveGas + depositGas);
    return Number(
      config.fromWEI('ETH', gasCost, this.props.exchange.tokens, {
        ceil: true,
      })
    );
  };

  onAmountValueChange = (value) => {
    const { allowance, selectedTokenSymbol } = this.state;
    let txCount = 0;
    if (
      selectedTokenSymbol.toUpperCase() !== 'ETH' &&
      Number(value) > allowance
    ) {
      txCount = allowance === 0 ? 1 : 2;
    }

    // Check ethEnough
    const cost = this.getFeeCost(txCount);
    let ethEnough = true;
    if (selectedTokenSymbol.toUpperCase() !== 'ETH') {
      ethEnough = cost <= this.state.ethBalance;
    } else {
      ethEnough =
        cost + (value && Number(value) >= 0 ? Number(value) : 0) <=
        this.state.ethBalance;
    }

    // Check validateAmount
    let validateAmount;
    if (Number.isNaN(Number(value)) || Number(value) <= 0) {
      validateAmount = false;
    } else {
      validateAmount = !value;
      if (!validateAmount) {
        validateAmount =
          selectedTokenSymbol.toUpperCase() !== 'ETH'
            ? Number(value) <= this.state.availableAmount
            : ethEnough;
      }
    }

    // Check amount decimal points
    let errorMessage1 = '';
    let errorToken = '';
    let errorMessage2 = '';

    const { tokens } = this.props.exchange;
    const token = config.getTokenBySymbol(selectedTokenSymbol, tokens);

    if (token.symbol && validateAmount && value.split('.').length === 2) {
      var inputPrecision = value.split('.')[1].length;
      if (
        inputPrecision > token.decimals ||
        (parseFloat(value) === 0 && inputPrecision === token.decimals)
      ) {
        errorMessage1 = 'Maximum_amount_input_decimal_part_1';
        errorToken = `${token.decimals}`;
        errorMessage2 = 'Maximum_input_decimal_part_2';
        validateAmount = false;
      }
    }

    this.setState({
      amount: value,
      ethEnough,
      validateAmount,
      approveTxCount: txCount,
      errorMessage1,
      errorToken,
      errorMessage2,
    });
  };

  validateAmount = () => {
    const { amount, availableAmount } = this.state;
    if (
      amount &&
      parseFloat(amount) > 0 &&
      parseFloat(amount) <= availableAmount
    ) {
      return true;
    } else {
      return false;
    }
  };

  onClose = () => {
    this.props.closeModal();
  };

  onClick = () => {
    if (this.validateAmount() === false) {
      this.setState({
        validateAmount: false,
      });
      return;
    } else {
      this.setState({
        validateAmount: true,
      });
    }

    this.depositTo_3_6();
  };

  enterAmount = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.onClick();
    }
  };

  depositAll = () => {
    const { selectedTokenSymbol } = this.state;
    let amount;
    let txCount = 0;
    // availableAmount may has commas.
    let availableAmount = this.state.availableAmount
      .toString()
      .replace(/,/g, '');
    if (selectedTokenSymbol.toUpperCase() === 'ETH') {
      const fee = this.getFeeCost(0);
      amount = Number(availableAmount) - fee;
    } else {
      amount = Number(availableAmount);
      if (amount > this.state.allowance) {
        txCount = this.state.allowance === 0 ? 1 : 2;
      }
    }

    this.setState({
      amount: Math.max(0, amount),
      validateAmount: amount > 0,
      ethEnough:
        selectedTokenSymbol.toUpperCase() === 'ETH'
          ? amount > 0
          : this.state.ethEnough,
      approveTxCount: txCount,
    });
  };

  render() {
    const theme = this.props.theme;

    const {
      availableAmount,
      approveTxCount,
      processingNum,
      selectedTokenSymbol,
    } = this.state;
    const { tokens } = this.props.exchange;

    const { balances } = this.props.balances;
    const selectedToken = config.getTokenBySymbol(selectedTokenSymbol, tokens);
    const holdBalance = balances.find(
      (ba) => ba.tokenId === selectedToken.tokenId
    );

    // String type with correct precision
    const holdAmount = holdBalance
      ? config.fromWEI(
          selectedToken.symbol,
          formatter
            .toBig(holdBalance.totalAmount)
            .minus(holdBalance.frozenAmount),
          tokens
        )
      : config.fromWEI(selectedToken.symbol, 0, tokens);

    let options = [];
    if (this.props.exchange.isInitialized) {
      options = tokens
        .filter(
          (token) =>
            token.enabled &&
            token.depositEnabled &&
            this.state.balanceOnEthereumDict[token.symbol] &&
            parseFloat(this.state.balanceOnEthereumDict[token.symbol]) > 0
        )
        .map((token, i) => {
          const option = {};
          option.key = token.symbol;
          option.text = token.symbol + ' - ' + token.name;

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
                )}
              </span>
            </AssetDropdownMenuItem>
          );

          return menuItem;
        });
    }

    const tipIcons = [];
    const tips = [];
    tipIcons.push(
      <div key="0">
        <FontAwesomeIcon
          icon={faClock}
          style={{
            visibility: 'hidden',
          }}
        />
      </div>
    );
    tips.push(
      <I
        s={
          getWalletType() === 'MetaMask'
            ? 'metaMaskPendingTxTip'
            : 'walletConnectPendingTxTip'
        }
      />
    );
    if (approveTxCount === 0) {
      // No need to show tips.
    } else if (approveTxCount === 1) {
      tipIcons.unshift(
        <div key="1">
          <FontAwesomeIcon
            icon={processingNum === 2 ? faArrowRight : faClock}
            style={{
              marginRight: '8px',
              width: '20px',
              color: processingNum === 2 ? theme.primary : theme.textDim,
            }}
          />
        </div>
      );
      tips.unshift(
        <div key="1">
          <I s="depositTipDeposit2" />
        </div>
      );

      tipIcons.unshift(
        <div key="2">
          <FontAwesomeIcon
            icon={processingNum > 1 ? faCheck : faArrowRight}
            style={{
              marginRight: '8px',
              width: '20px',
              color: processingNum > 1 ? theme.green : theme.primary,
            }}
          />
        </div>
      );
      tips.unshift(
        <div key="2">
          <I s="depositTipApprove1" />
        </div>
      );
    } else {
      // Three transactions to be approved
      // 3rd tx
      tipIcons.unshift(
        <div key="3">
          <FontAwesomeIcon
            icon={processingNum === 3 ? faHandPointRight : faClock}
            style={{
              marginRight: '8px',
              width: '20px',
              color: processingNum === 3 ? theme.primary : theme.textDim,
            }}
          />
        </div>
      );
      tips.unshift(
        <div key="3">
          <I s="depositTipDeposit3" />
        </div>
      );

      // 2nd tx
      tipIcons.unshift(
        <div key="2">
          <FontAwesomeIcon
            icon={
              processingNum > 2
                ? faCheck
                : processingNum === 2
                ? faHandPointRight
                : faClock
            }
            style={{
              marginRight: '8px',
              width: '20px',
              color:
                processingNum > 2
                  ? theme.green
                  : processingNum === 2
                  ? theme.primary
                  : theme.textDim,
            }}
          />
        </div>
      );
      tips.unshift(
        <div key="2">
          <I s="depositTipApprove3_2" />
        </div>
      );

      // 1st tx
      tipIcons.unshift(
        <div key="1">
          <FontAwesomeIcon
            icon={processingNum === 1 ? faHandPointRight : faCheck}
            style={{
              marginRight: '8px',
              width: '20px',
              color: processingNum === 1 ? theme.primary : theme.green,
            }}
          />
        </div>
      );
      tips.unshift(
        <div key="1">
          <I s="depositTipApproveZero" />
        </div>
      );
    }

    let indicator;
    if (tips.length === 1 && getWalletType() !== 'MetaMask') {
      indicator = <WalletConnectIndicator />;
    } else {
      indicator = (
        <ModalIndicator
          title={
            getWalletType() === 'MetaMask'
              ? 'metamaskConfirm'
              : 'walletConnectConfirm'
          }
          tipIcons={tipIcons}
          tips={tips}
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
      this.state.loading && tips.length === 1 && getWalletType() !== 'MetaMask';

    return (
      <MyModal
        centered
        width={AppLayout.modalWidth}
        title={<TextPopupTitle>{this.title}</TextPopupTitle>}
        footer={null}
        maskClosable={false}
        closeIcon={<FontAwesomeIcon icon={faTimes} />}
        visible={this.props.isVisible}
        onCancel={() => this.onClose()}
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
            <Instruction
              style={{
                color: theme.primary,
                fontWeight: '600',
              }}
            >
              <I s="NewActiveLayerInstruction_1" />
            </Instruction>
            <Instruction>
              <I s="DepositInstruction_1" />
            </Instruction>
            <ul>
              <li>
                <I s="DepositInstruction_Timing" />
                <WhyIcon text="TimingWhy" />
              </li>
              {/* <li>
                <I s="DepositInstruction_KeepEther" />
                <WhyIcon text="DepositInstruction_KeepEtherWhy" />
              </li> */}
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
                    {selectedToken.symbol} - <I s={selectedToken.name} />
                  </span>
                }
              />
            </Group>
            <Group label={<I s="Amount" />}>
              <NumericInput
                decimals={selectedToken.precision}
                color={
                  this.state.validateAmount
                    ? theme.textWhite
                    : theme.sellPrimary
                }
                value={this.state.amount}
                onChange={this.onAmountValueChange}
                onClick={this.onAmountValueClick}
                suffix={selectedTokenSymbol.toUpperCase()}
                onKeyDown={this.enterAmount.bind(this)}
              />
              <ErrorMessage
                isDeposit={true}
                selectedToken={selectedToken}
                amount={this.state.amount}
                availableAmount={availableAmount}
                ethEnough={this.state.ethEnough}
                validateAmount={this.state.validateAmount}
                errorMessage1={this.state.errorMessage1}
                errorToken={this.state.errorToken}
                errorMessage2={this.state.errorMessage2}
              />
            </Group>
          </Section>

          <Section
            style={{
              display: isWalletConnectLoading ? 'none' : 'block',
            }}
          >
            <LabelValue
              label={<I s="Layer-2 Balance" />}
              value={holdAmount}
              unit={selectedTokenSymbol.toUpperCase()}
            />
            <LabelValue
              label={<I s="Layer-1 Balance" />}
              value={availableAmount}
              unit={selectedTokenSymbol.toUpperCase()}
              onClick={() => this.depositAll()}
            />
          </Section>

          <Section
            style={{
              display: isWalletConnectLoading ? 'none' : 'block',
            }}
          >
            <ActionButton
              disabled={
                this.state.amount <= 0 ||
                !this.state.validateAmount ||
                this.state.loading ||
                !this.state.ethEnough
              }
              onClick={() => this.onClick()}
            >
              <I s="Deposit to Activate Layer-2" />
            </ActionButton>
          </Section>
        </Spin>
      </MyModal>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    modalManager,
    dexAccount,
    balances,
    nonce,
    gasPrice,
    exchange,
  } = state;
  const isVisible = modalManager.isRegisterAccountModalVisible;
  return {
    isVisible,
    dexAccount,
    balances,
    nonce,
    gasPrice,
    exchange,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(registerAccountModal(false, '')),
    updateAccount: (account) => dispatch(updateAccount(account)),
    registerAccountModal: (token) =>
      dispatch(registerAccountModal(true, token)),
    fetchNonce: (address) => dispatch(fetchNonce(address)),
    fetchGasPrice: () => dispatch(fetchGasPrice()),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(NewRegisterAccountModal)
);
