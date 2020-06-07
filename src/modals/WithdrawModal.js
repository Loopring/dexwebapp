import { ActionButton, AssetDropdownMenuItem } from "styles/Styles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Instruction,
  MyModal,
  Section,
  TextPopupTitle,
} from "modals/styles/Styles";

import { Spin } from "antd";
import { connect } from "react-redux";
import { fetchGasPrice } from "redux/actions/GasPrice";
import { fetchNonce } from "redux/actions/Nonce";
import { fetchWalletBalance } from "modals/components/utils";
import { showWithdrawModal } from "redux/actions/ModalManager";
import { withTheme } from "styled-components";
import AppLayout from "AppLayout";
import AssetDropdown from "modals/components/AssetDropdown";
import ErrorMessage from "modals/components/ErrorMessage";
import Group from "modals/components/Group";
import I from "components/I";
import LabelValue from "modals/components/LabelValue";
import ModalIndicator from "modals/components/ModalIndicator";
import NumericInput from "components/NumericInput";
import React from "react";
import WhyIcon from "components/WhyIcon";

import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { formatter } from "lightcone/common";
import { getWalletType } from "lightcone/api/localStorgeAPI";
import { notifyError, notifySuccess } from "redux/actions/Notification";
import WalletConnectIndicator from "modals/components/WalletConnectIndicator";
import WalletConnectIndicatorPlaceholder from "modals/components/WalletConnectIndicatorPlaceholder";
import config from "lightcone/config";

class WithdrawModal extends React.Component {
  state = {
    errorMessage1: "",
    errorToken: "",
    errorMessage2: "",
    loading: false,
    amount: null,
    ethBalance: 0,
    ethEnough: true,
    balance: 0,
    validateAmount: true,
    availableAmount: 0,
  };

  componentDidUpdate(prevProps, prevState) {
    // When the modal becomes visible
    if (
      this.props.isVisible &&
      (this.props.dexAccount.account.address !==
        prevProps.dexAccount.account.address ||
        this.props.isVisible !== prevProps.isVisible) &&
      window.wallet
    ) {
      const { balances } = this.props.balances;
      const selectedTokenSymbol = this.props.modalManager.withdrawalToken;
      (async () => {
        const ethBalance = await fetchWalletBalance(
          this.props.dexAccount.account.address,
          "ETH",
          this.props.exchange.tokens
        );
        const fee = this.getFeeCost();
        this.setState({
          ethBalance: ethBalance,
          ethEnough: fee <= ethBalance,
        });
      })();

      const holdAmount = this.getAvailableAmount(selectedTokenSymbol, balances);
      const balance = this.getHoldBalance(selectedTokenSymbol, balances);

      (async () => {
        this.props.fetchNonce(this.props.dexAccount.account.address);
        this.props.fetchGasPrice();
      })();

      this.setState({
        balance: balance,
        availableAmount: holdAmount,
        validateAmount:
          !this.state.amount || Number(this.state.amount) <= holdAmount,
      });
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
      });
    }
  }

  handleCurrencyTypeSelect = (tokenSymbol) => {
    const amount = this.getAvailableAmount(
      tokenSymbol,
      this.props.balances.balances
    );
    this.props.showModal(tokenSymbol);

    // Reset amount and error message
    this.setState({
      amount: null,
      ethEnough: true,
      validateAmount: true,
      availableAmount: amount,
    });
  };

  // TODO: move to redux. will do the tranformation just after getting the data.
  getAvailableAmount = (symbol, balances) => {
    const tokens = this.props.exchange.tokens;
    const selectedToken = config.getTokenBySymbol(symbol, tokens);
    const holdBalance = balances.find(
      (ba) => ba.tokenId === selectedToken.tokenId
    );
    return holdBalance
      ? config.fromWEI(
          selectedToken.symbol,
          formatter
            .toBig(holdBalance.totalAmount)
            .minus(holdBalance.frozenAmount),
          tokens
        )
      : config.fromWEI(selectedToken.symbol, 0, tokens);
  };

  getHoldBalance = (symbol, balances) => {
    const tokens = this.props.exchange.tokens;
    const selectedToken = config.getTokenBySymbol(symbol, tokens);
    const holdBalance = balances.find(
      (ba) => ba.tokenId === selectedToken.tokenId
    );
    return holdBalance
      ? config.fromWEI(
          selectedToken.symbol,
          formatter.toBig(holdBalance.totalAmount),
          tokens,
          {
            ceil: true,
          }
        )
      : config.fromWEI(selectedToken.symbol, 0, tokens);
  };

  getFeeCost = () => {
    const gasPrice = formatter.fromGWEI(this.props.gasPrice.gasPrice);
    const withdrawalGas = config.getGasLimitByType("withdraw").gas;
    const gasCost = gasPrice.times(withdrawalGas);
    const fee = config.getFeeByType("withdraw", this.props.exchange.onchainFees)
      .fee;

    return Number(
      config.fromWEI("ETH", gasCost.plus(fee), this.props.exchange.tokens, {
        ceil: true,
      })
    );
  };

  onAmountValueChange = (value) => {
    const selectedTokenSymbol = this.props.modalManager.withdrawalToken;

    // Check validateAmount
    let validateAmount;
    if (Number.isNaN(Number(value)) || Number(value) <= 0) {
      validateAmount = false;
    } else {
      validateAmount = !value || Number(value) <= this.state.availableAmount;
    }

    // Check amount decimal points
    let errorMessage1 = "";
    let errorToken = "";
    let errorMessage2 = "";

    const { tokens } = this.props.exchange;
    const token = config.getTokenBySymbol(selectedTokenSymbol, tokens);

    if (token.symbol && validateAmount && value.split(".").length === 2) {
      var inputPrecision = value.split(".")[1].length;
      if (
        inputPrecision > token.decimals ||
        (parseFloat(value) === 0 && inputPrecision === token.decimals)
      ) {
        errorMessage1 = "Maximum_amount_input_decimal_part_1";
        errorToken = `${token.decimals}`;
        errorMessage2 = "Maximum_input_decimal_part_2";
        validateAmount = false;
      }
    }

    this.setState({
      amount: value,
      validateAmount,
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
      availableAmount >= parseFloat(amount)
    ) {
      return true;
    } else {
      return false;
    }
  };

  submitWithdraw = () => {
    this.setState({
      loading: true,
    });

    console.log("submitWithdraw");

    let symbol = this.props.modalManager.withdrawalToken;

    (async () => {
      try {
        const {
          tokens,
          onchainFees,
          exchangeAddress,
          chainId,
        } = this.props.exchange;

        console.log("Before window.wallet.onchainWithdrawal");

        await window.wallet.onchainWithdrawal(
          {
            exchangeAddress,
            chainId,
            token: config.getTokenBySymbol(symbol, tokens),
            amount: this.state.amount,
            nonce: this.props.nonce.nonce,
            gasPrice: this.props.gasPrice.gasPrice,
            fee: config.getFeeByType("withdraw", onchainFees).fee,
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

    this.submitWithdraw();
  };

  enterAmount = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.onClick();
    }
  };

  withdrawAll = () => {
    this.setState({
      amount: this.state.availableAmount,
      validateAmount: true,
    });
  };

  render() {
    const theme = this.props.theme;
    const { tokens, onchainFees } = this.props.exchange;
    const selectedTokenSymbol = this.props.modalManager.withdrawalToken;
    const selectedToken = config.getTokenBySymbol(selectedTokenSymbol, tokens);

    const options = tokens
      .filter((token) => token.enabled)
      .map((token, i) => {
        const option = {};
        option.key = token.symbol;
        option.text = token.symbol + " - " + token.name;

        const menuItem = (
          <AssetDropdownMenuItem
            key={i}
            onClick={() => {
              this.handleCurrencyTypeSelect(token.symbol);
            }}
          >
            <span>
              {token.symbol} - <I s={token.name} />
            </span>
          </AssetDropdownMenuItem>
        );

        return menuItem;
      });

    let indicator;
    if (getWalletType() !== "MetaMask") {
      indicator = <WalletConnectIndicator />;
    } else {
      indicator = (
        <ModalIndicator
          title={
            getWalletType() === "MetaMask"
              ? "metamaskConfirm"
              : "walletConnectConfirm"
          }
          tips={[
            <div key="1">
              <I
                s={
                  getWalletType() === "MetaMask"
                    ? "metaMaskPendingTxTip"
                    : "walletConnectPendingTxTip"
                }
              />
            </div>,
          ]}
          imageUrl={
            getWalletType() === "MetaMask"
              ? `/assets/images/${theme.imgDir}/metamask_pending.png`
              : ``
          }
          marginTop="60px"
        />
      );
    }

    let isWalletConnectLoading =
      this.state.loading && getWalletType() !== "MetaMask";

    return (
      <MyModal
        centered
        width={AppLayout.modalWidth}
        title={
          <TextPopupTitle>
            <I s="Make a Withdrawal" />
          </TextPopupTitle>
        }
        footer={null}
        maskClosable={false}
        closeIcon={<FontAwesomeIcon icon={faTimes} />}
        visible={this.props.isVisible}
        onCancel={() => this.props.closeModal()}
      >
        <Spin spinning={this.state.loading} indicator={indicator}>
          <WalletConnectIndicatorPlaceholder
            isWalletConnectLoading={isWalletConnectLoading}
          />
          <Section
            style={{
              display: isWalletConnectLoading ? "none" : "block",
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
              <li>
                <I s="WithdrawInstruction_Fee_1" />{" "}
                {config.getFeeByType("withdraw", onchainFees)
                  ? config.fromWEI(
                      "ETH",
                      config.getFeeByType("withdraw", onchainFees).fee,
                      tokens
                    )
                  : "-"}{" "}
                ETH
                <I s="WithdrawInstruction_Fee_2" /> <WhyIcon text="FeeWhy" />
              </li>
            </ul>
          </Section>
          <Section
            style={{
              display: isWalletConnectLoading ? "none" : "block",
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
                value={
                  this.props.modalManager.withdrawalToken.toUpperCase() ===
                  "TRB"
                    ? this.state.balance
                    : this.state.amount
                }
                onChange={this.onAmountValueChange}
                onClick={this.onAmountValueClick}
                suffix={selectedTokenSymbol.toUpperCase()}
                fontSize="0.9rem"
                onKeyDown={this.enterAmount.bind(this)}
                disabled={
                  this.props.modalManager.withdrawalToken.toUpperCase() ===
                  "TRB"
                }
              />
              <ErrorMessage
                isWithdrawal={true}
                selectedToken={selectedToken}
                amount={this.state.amount}
                availableAmount={this.state.availableAmount}
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
              display: isWalletConnectLoading ? "none" : "block",
            }}
          >
            <LabelValue
              label={<I s="Balance on Loopring" />}
              value={this.state.availableAmount}
              unit={selectedTokenSymbol.toUpperCase()}
              onClick={() => this.withdrawAll()}
            />
            <LabelValue
              label={<I s="Available to withdraw" />}
              value={this.state.availableAmount}
              unit={selectedTokenSymbol.toUpperCase()}
            />
          </Section>
          <Section
            style={{
              display: isWalletConnectLoading ? "none" : "block",
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
              <I s="Withdraw" />
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
  const isVisible = modalManager.isWithdrawModalVisible;
  return {
    isVisible,
    modalManager,
    dexAccount,
    balances,
    nonce,
    gasPrice,
    exchange,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(showWithdrawModal(false)),
    showModal: (token) => dispatch(showWithdrawModal(true, token)),
    fetchNonce: (address) => dispatch(fetchNonce(address)),
    fetchGasPrice: () => dispatch(fetchGasPrice()),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(WithdrawModal)
);
