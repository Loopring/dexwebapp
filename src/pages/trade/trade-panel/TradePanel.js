import { connect } from 'react-redux';
import I from 'components/I';
import React from 'react';
import styled, { withTheme } from 'styled-components';

import AppLayout from 'AppLayout';

import '@ant-design/compatible/assets/index.css';
import { ActionButton } from 'styles/Styles';
import { Button, Spin } from 'antd';

import {
  fetchMyHistoryOrders,
  fetchMyOpenOrders,
} from 'redux/actions/MyOrders';

import { fetchMyAccountPage } from 'redux/actions/MyAccountPage';
import { getOrderId, submitOrderToLightcone } from 'lightcone/api/LightconeAPI';
import { updateAmount, updatePrice } from 'redux/actions/TradePanel';
import AssetPanel from 'pages/trade/asset-panel/AssetPanel';
import NumericInput from 'components/NumericInput';
import TradeTabButtons from './components/TradeTabButtons';

import { LOGGED_IN } from 'redux/actions/DexAccount';
import { formatter } from 'lightcone/common';
import config from 'lightcone/config';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import { faEthereum } from '@fortawesome/free-brands-svg-icons/faEthereum';

import {
  getEtherscanLink,
  saveAccountToLocal,
} from 'lightcone/api/localStorgeAPI';
import { notifyError, notifySuccess } from 'redux/actions/Notification';

import TradePanelErrorMessage from 'pages/trade/trade-panel/components/TradePanelErrorMessage';
import TradePanelWarnMessage from 'pages/trade/trade-panel/components/TradePanelWarnMessage';

const BigNumber = require('bignumber.js');

const TitleLabel = styled.div`
  padding-top: 16px;
  padding-bottom: 4px;
  padding-left: 0px;
  user-select: none;
  font-size: 0.9rem;
  color: ${(props) => props.theme.textDim};
`;

const EthereumIconWrapper = styled.div`
  color: ${(props) => props.theme.textDim};
  font-size: 0.85rem;
  user-select: none;
  text-align: center;
  margin-top: 100px;

  @media (max-height: 820px) {
    display: none;
  }
`;

const PercentageButton = styled(Button)`
  border: none !important;
  width: 56px !important;
  font-size: 0.8rem !important;
  margin: 0 !important;
  color: ${(props) => props.theme.textWhite}!important;
  background: ${(props) => props.theme.foreground}!important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
  height: 24px;

  &[disabled],
  &[disabled]:hover {
    color: ${(props) => props.theme.textDim}!important;
    background: ${(props) => props.theme.buttonBackground}!important;
  }

  &:hover {
    color: ${(props) => props.theme.textBigButton}!important;
    background: ${(props) => props.theme.primary}!important;
  }
`;

class TradePanel extends React.Component {
  state = {
    waitingForPassword: false,
    validatePrice: true,
    baseAmountValidate: true,
    quoteAmountValidate: true,
    orderTotalValidate: true,
    errorMessage1: '',
    errorToken: '',
    errorMessage2: '',
    warnMessage: '',
    loading: false,
    isBuy: true,
    sellToken: '-',
    needPriceConfirm: false,
    orderTotal: null,
    autoUpdateAmountFirst: true,
  };

  componentDidMount() {
    const { tradePanel } = this.props;
    const isBuy = tradePanel.tradeType.toLowerCase() === 'buy';
    const sellToken = isBuy
      ? this.props.currentMarket.quoteTokenSymbol
      : this.props.currentMarket.baseTokenSymbol;
    this.setState({ sellToken, isBuy });
  }

  componentDidUpdate(prevProps, prevState) {
    var inputPrecision;

    if (
      this.props.balances !== prevProps.balances ||
      prevProps.tradePanel !== this.props.tradePanel ||
      prevProps.currentMarket.current !== this.props.currentMarket.current ||
      (this.props.dexAccount.account &&
        this.props.dexAccount.account.address &&
        prevProps.dexAccount.account.address !==
          this.props.dexAccount.account.address &&
        this.props.currentMarket.current)
    ) {
      // console.log('update current market', this.props.currentMarket.current);

      const { currentMarket, tradePanel, exchange } = this.props;
      const tokens = currentMarket.current.split('-');
      const isBuy = tradePanel.tradeType.toLowerCase() === 'buy';
      const sellToken = isBuy ? tokens[1] : tokens[0];

      const baseToken = config.getTokenBySymbol(
        currentMarket.baseTokenSymbol,
        exchange.tokens
      );

      const quoteToken = config.getTokenBySymbol(
        currentMarket.quoteTokenSymbol,
        exchange.tokens
      );

      // Only check when token info is ready.
      if (baseToken.symbol && quoteToken.symbol) {
        let errorMessage1 = '';
        let errorToken = '';
        let errorMessage2 = '';

        let priceValidate =
          !tradePanel.price || parseFloat(tradePanel.price) >= 0;

        // Check the decimal points in price input.
        if (
          priceValidate &&
          tradePanel.price &&
          tradePanel.price.split('.').length === 2
        ) {
          inputPrecision = tradePanel.price.split('.')[1].length;
          const marketConfig = config.getMarketByPair(
            currentMarket.current,
            exchange.markets
          );
          const { precisionForPrice } = marketConfig;
          if (
            inputPrecision > precisionForPrice ||
            (parseFloat(tradePanel.price) === 0 &&
              inputPrecision === precisionForPrice)
          ) {
            errorMessage1 = 'Maximum_price_input_decimal_part_1';
            errorToken = `${precisionForPrice}`;
            errorMessage2 = 'Maximum_input_decimal_part_2';
            priceValidate = false;
          }
        }

        // Start checking amount
        const baseAmount = parseFloat(tradePanel.amount);
        const quoteAmount =
          !!tradePanel.amount &&
          baseAmount > 0 &&
          !!tradePanel.price &&
          parseFloat(tradePanel.price) > 0
            ? formatter.toBig(baseAmount).times(tradePanel.price).toNumber()
            : 0;

        const minBaseAmount = Number(
          config.fromWEI(
            baseToken.symbol,
            baseToken.minOrderAmount,
            exchange.tokens
          )
        );
        const maxBaseAmount = Number(
          config.fromWEI(
            baseToken.symbol,
            baseToken.maxOrderAmount,
            exchange.tokens
          )
        );

        const minQuoteAmount = Number(
          config.fromWEI(
            quoteToken.symbol,
            quoteToken.minOrderAmount,
            exchange.tokens
          )
        );

        const maxQuoteAmount = Number(
          config.fromWEI(
            quoteToken.symbol,
            quoteToken.maxOrderAmount,
            exchange.tokens
          )
        );

        let baseAmountValidate =
          !tradePanel.amount ||
          baseAmount === 0 ||
          (baseAmount >= minBaseAmount && baseAmount <= maxBaseAmount);

        let quoteAmountValidate =
          quoteAmount === 0 ||
          (quoteAmount >= minQuoteAmount && quoteAmount <= maxQuoteAmount);

        let orderTotalValidate = true;

        if (priceValidate && !baseAmountValidate) {
          if (baseAmount < minBaseAmount) {
            errorMessage1 = 'Minimum_order_size';
            errorToken = ` ${minBaseAmount} ${baseToken.symbol}`;
          } else if (baseAmount > maxBaseAmount) {
            errorMessage1 = 'Maximum_order_size';
            errorToken = ` ${maxBaseAmount} ${baseToken.symbol}`;
          }
        }

        if (baseAmountValidate && !quoteAmountValidate) {
          if (quoteAmount < minQuoteAmount) {
            errorMessage1 = 'Minimum_order_size';
            errorToken = ` ${minQuoteAmount} ${quoteToken.symbol}`;
          } else if (quoteAmount > maxQuoteAmount) {
            errorMessage1 = 'Maximum_order_size';
            errorToken = ` ${maxQuoteAmount} ${quoteToken.symbol}`;
          }
        }

        if (
          priceValidate &&
          !!tradePanel.price &&
          !!tradePanel.amount &&
          baseAmountValidate &&
          quoteAmountValidate
        ) {
          const amount =
            tradePanel.tradeType === 'sell' ? baseAmount : quoteAmount;
          if (tradePanel.tradeType === 'sell') {
            baseAmountValidate =
              amount <= this.getAvailableAmount(sellToken, this.props.balances);
            if (!baseAmountValidate) {
              errorMessage1 = 'Your balance is insufficient!';
            }
          } else {
            quoteAmountValidate =
              amount <= this.getAvailableAmount(sellToken, this.props.balances);
            if (!quoteAmountValidate) {
              errorMessage1 = 'Your balance is insufficient!';
            }
          }
        }

        // Check the decimal points in amount input.
        if (
          baseAmountValidate &&
          baseAmountValidate &&
          tradePanel.amount &&
          tradePanel.amount.split('.').length === 2
        ) {
          inputPrecision = tradePanel.amount.split('.')[1].length;
          const precision = (baseToken && baseToken.precision) || 6;
          if (
            inputPrecision > precision ||
            (parseFloat(tradePanel.amount) === 0 &&
              inputPrecision === precision)
          ) {
            errorMessage1 = 'Maximum_amount_input_decimal_part_1';
            errorToken = `${precision}`;
            errorMessage2 = 'Maximum_input_decimal_part_2';
            baseAmountValidate = false;
          }
        }

        if (
          errorMessage1 === '' &&
          baseAmountValidate &&
          !!this.state.orderTotal &&
          this.state.orderTotal.split('.').length === 2
        ) {
          const orderTotalPrecision = this.state.orderTotal.split('.')[1]
            .length;
          const precision = (quoteToken && quoteToken.precision) || 6;
          if (orderTotalPrecision > precision) {
            errorMessage1 = 'Maximum_order_total_input_decimal_part_1';
            errorToken = `${precision}`;
            errorMessage2 = 'Maximum_input_decimal_part_2';
            orderTotalValidate = false;
          }
        }

        // Display warinings
        let warnMessage = '';
        if (errorMessage1 === '' && priceValidate && tradePanel.price) {
          if (tradePanel.price && this.props.ticker.close) {
            let latestPrice = parseFloat(this.props.ticker.close);
            let price = parseFloat(this.props.tradePanel.price);
            if (price > 1.2 * latestPrice && isBuy) {
              warnMessage = 'BuyPriceHigher';
            } else if (price < 0.8 * latestPrice && !isBuy) {
              warnMessage = 'SellPriceLower';
            }
          }
        }

        this.setState({
          sellToken,
          isBuy,
          validatePrice: priceValidate,
          baseAmountValidate,
          quoteAmountValidate,
          orderTotalValidate,
          errorMessage1,
          errorToken,
          errorMessage2,
          warnMessage,
        });
      }
    }

    if (
      (prevProps.tradePanel.updateOrderTotalReferenceCount !==
        this.props.tradePanel.price ||
        prevProps.tradePanel.amount !== this.props.tradePanel.amount) &&
      prevProps.tradePanel.updateOrderTotalReferenceCount !==
        this.props.tradePanel.updateOrderTotalReferenceCount &&
      this.props.currentMarket &&
      this.props.exchange.isInitialized === true
    ) {
      const { currentMarket, exchange } = this.props;
      const quoteTokenSymbol = currentMarket.quoteTokenSymbol;
      const quoteToken = config.getTokenBySymbol(
        quoteTokenSymbol,
        exchange.tokens
      );
      let orderTotal = null;
      let precision = (quoteToken && quoteToken.precision) || 6;
      if (!!this.props.tradePanel.price && !!this.props.tradePanel.amount) {
        orderTotal = Number(
          formatter.toFixed(
            new BigNumber(this.props.tradePanel.price).times(
              this.props.tradePanel.amount
            ),
            precision,
            false
          )
        );
      }
      this.setState({
        orderTotal: orderTotal ? String(orderTotal) : orderTotal,
      });
    }
  }

  getAvailableAmount = (symbol, balances) => {
    const { tokens } = this.props.exchange;
    const selectedToken = config.getTokenBySymbol(symbol, tokens);
    const holdBalance = balances.find(
      (ba) => ba.tokenId === selectedToken.tokenId
    );
    try {
      return holdBalance ? Number(holdBalance.available) : 0;
    } catch {
      return 0;
    }
  };

  onPriceValueChange = (value) => {
    this.setState({
      autoUpdateAmountFirst: true,
    });

    const validate = value && parseFloat(value) >= 0;
    if (validate === false) {
      return;
    }
    this.props.updatePrice(value);

    const { currentMarket, exchange } = this.props;
    const quoteTokenSymbol = currentMarket.quoteTokenSymbol;
    const quoteToken = config.getTokenBySymbol(
      quoteTokenSymbol,
      exchange.tokens
    );
    let orderTotal = null;
    let precision = (quoteToken && quoteToken.precision) || 6;
    if (!!value && !!this.props.tradePanel.amount) {
      orderTotal = Number(
        formatter.toFixed(
          new BigNumber(value).times(this.props.tradePanel.amount),
          precision,
          false
        )
      );
    }

    this.setState({
      orderTotal: orderTotal ? String(orderTotal) : orderTotal,
    });
  };

  onAmountValueChange = (value) => {
    this.props.updateAmount(value, true);

    const { currentMarket, exchange } = this.props;
    const quoteTokenSymbol = currentMarket.quoteTokenSymbol;
    const quoteToken = config.getTokenBySymbol(
      quoteTokenSymbol,
      exchange.tokens
    );
    let orderTotal = null;
    let precision = (quoteToken && quoteToken.precision) || 6;
    if (!!this.props.tradePanel.price && !!value) {
      orderTotal = Number(
        formatter.toFixed(
          new BigNumber(this.props.tradePanel.price).times(value),
          precision,
          false
        )
      );
    }

    this.setState({
      orderTotal: orderTotal ? String(orderTotal) : orderTotal,
    });
  };

  onOrderTotalValueChange = (value) => {
    this.setState({
      orderTotal: String(value),
    });

    // If value is invalid, return
    if (value == '' || Number(value) == 0) {
      if (this.state.autoUpdateAmountFirst) {
        this.props.updateAmount('', false);
      } else {
        this.props.updatePrice('', false);
      }
      return;
    }

    const { currentMarket, exchange } = this.props;
    const baseTokenSymbol = currentMarket.baseTokenSymbol;
    const quoteTokenSymbol = currentMarket.quoteTokenSymbol;
    const baseToken = config.getTokenBySymbol(baseTokenSymbol, exchange.tokens);
    const quoteToken = config.getTokenBySymbol(
      quoteTokenSymbol,
      exchange.tokens
    );

    if (
      this.state.autoUpdateAmountFirst === true &&
      !!this.props.tradePanel.price &&
      this.props.tradePanel.price > 0
    ) {
      let precision = (baseToken && baseToken.precision) || 6;

      let amount = Number(
        formatter.toFixed(
          new BigNumber(value).dividedBy(this.props.tradePanel.price),
          precision,
          false
        )
      );
      this.props.updateAmount(amount, false);
    } else if (
      !!this.props.tradePanel.amount &&
      this.props.tradePanel.amount > 0
    ) {
      this.setState({
        autoUpdateAmountFirst: false,
      });
      let precision = (quoteToken && quoteToken.precision) || 6;
      let price = Number(
        formatter.toFixed(
          new BigNumber(value).dividedBy(this.props.tradePanel.amount),
          precision,
          false
        )
      );
      this.props.updatePrice(price, false);
    }
  };

  validatePrice = () => {
    if (
      this.props.tradePanel.price &&
      parseFloat(this.props.tradePanel.price) > 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  validateAmount = () => {
    if (
      this.props.tradePanel.amount &&
      parseFloat(this.props.tradePanel.amount) > 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  submitOrder = () => {
    this.setState({
      loading: true,
    });

    (async () => {
      try {
        const { tradePanel, exchange } = this.props;
        const { amount, price } = tradePanel;
        const baseTokenSymbol = this.props.currentMarket.baseTokenSymbol;
        const quoteTokenSymbol = this.props.currentMarket.quoteTokenSymbol;

        const baseToken = config.getTokenBySymbol(
          baseTokenSymbol,
          exchange.tokens
        );
        const quoteToken = config.getTokenBySymbol(
          quoteTokenSymbol,
          exchange.tokens
        );

        // Amount is always in base token
        const amountInBigNumber = new BigNumber(amount);

        const isBuy = this.props.tradePanel.tradeType === 'buy';

        var tokenS;
        var tokenSId;

        var tokenB;

        var amountS = 0;
        var amountB = 0;

        if (isBuy) {
          // Buying means selling ETH to get LRC. User enter LRC amount
          tokenS = quoteTokenSymbol;
          tokenSId = quoteToken.tokenId;
          amountS = amountInBigNumber.times(price).toFixed();

          tokenB = baseTokenSymbol;
          amountB = amountInBigNumber.toFixed();
        } else {
          // Selling means selling LRC to get ETH. User enter LRC amount
          tokenS = baseTokenSymbol;
          tokenSId = baseToken.tokenId;
          amountS = amountInBigNumber.toFixed();

          tokenB = quoteTokenSymbol;
          amountB = amountInBigNumber.times(price).toFixed();
        }

        const tradingPrivKey = this.props.dexAccount.account.accountKey;
        if (!tradingPrivKey) {
          throw new Error('please login first');
        }

        // Get order id
        const accountId = this.props.dexAccount.account.accountId;
        const apiKey = this.props.dexAccount.account.apiKey;
        // Use token sell id
        const orderId = await getOrderId(accountId, tokenSId, apiKey);

        // Timestamp in second
        const validSince = new Date().getTime() / 1000 - 3600;
        const validUntil = new Date().getTime() / 1000 + 3600 * 24 * 10000;

        const signedOrder = window.wallet.submitOrder(
          exchange.tokens,
          exchange.exchangeId,
          tokenS,
          tokenB,
          amountS,
          amountB,
          orderId,
          validSince,
          validUntil,
          config.getLabel(),
          isBuy,
          config.getChannelId()
        );

        await submitOrderToLightcone(signedOrder, apiKey);

        saveAccountToLocal(this.props.dexAccount.account);

        console.log('TradePanel fetchMyAccountPage');
        // Get the balance from API immediately
        this.props.fetchMyAccountPage(
          this.props.dexAccount.account.accountId,
          this.props.dexAccount.account.apiKey,
          this.props.exchange.tokens
        );

        // Get order from API immediately
        const marketInFetchMyOpenOrders = this.props.myOrders.showAllOpenOrders
          ? undefined
          : this.props.currentMarket.current;
        this.props.fetchMyOpenOrders(
          this.props.dexAccount.account.accountId,
          this.props.myOrders.openOrdersLimit,
          this.props.myOrders.openOrdersOffset,
          marketInFetchMyOpenOrders,
          apiKey,
          this.props.exchange.tokens
        );

        this.props.fetchMyHistoryOrders(
          this.props.dexAccount.account.accountId,
          this.props.myOrders.historyOrdersLimit,
          this.props.myOrders.historyOrdersOffset,
          marketInFetchMyOpenOrders,
          apiKey,
          this.props.exchange.tokens
        );

        // Reset trade form
        this.props.updateAmount('', true);

        notifySuccess(
          <I s="Your order has been submitted." />,
          this.props.theme
        );
      } catch (err) {
        console.log(err);
        notifyError(<I s="Failed to submit your order." />, this.props.theme);
      } finally {
        this.setState({
          loading: false,
        });
      }
    })();
  };

  pressedButton = () => {
    const validatePrice = this.validatePrice();
    this.setState({
      validatePrice,
    });
    if (validatePrice === false) {
      return;
    }

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

    this.submitOrder();
  };

  handleAmountPercentage = (percentage) => {
    const { sellToken, isBuy } = this.state;
    const {
      balances,
      tradePanel,
      exchange: { tokens },
    } = this.props;

    const price =
      tradePanel.price && Number(tradePanel.price) > 0
        ? Number(tradePanel.price)
        : 0;
    const availableAmount = isBuy
      ? price
        ? this.getAvailableAmount(sellToken, balances) / price
        : 0
      : this.getAvailableAmount(sellToken, balances);

    const amount = availableAmount * percentage;
    // Use base token precision to floor amount input
    const baseToken = config.getTokenBySymbol(
      this.props.currentMarket.baseTokenSymbol,
      tokens
    );
    const scale = Math.pow(10, baseToken.precision);
    this.props.updateAmount(Math.floor(amount * scale) / scale, true);
  };

  getExchangeContractLink = () => {
    const addr =
      this.props.exchange.chainId === 1
        ? 'loopringio.eth'
        : this.props.exchange.exchangeAddress;

    return `${getEtherscanLink(this.props.exchange.chainId)}/address/${addr}`;
  };

  render() {
    const theme = this.props.theme;
    const { isBuy } = this.state;
    const { currentMarket, exchange } = this.props;
    const marketConfig = config.getMarketByPair(
      currentMarket.current,
      exchange.markets
    );
    const baseTokenSymbol = currentMarket.baseTokenSymbol;
    const quoteTokenSymbol = currentMarket.quoteTokenSymbol;
    const baseToken = config.getTokenBySymbol(baseTokenSymbol, exchange.tokens);
    const quoteToken = config.getTokenBySymbol(
      quoteTokenSymbol,
      exchange.tokens
    );

    const disabled =
      !marketConfig ||
      !marketConfig.enabled ||
      this.props.dexAccount.account.state !== LOGGED_IN ||
      !this.props.metaMask.isDesiredNetwork ||
      !this.state.baseAmountValidate ||
      !this.state.quoteAmountValidate ||
      !this.state.orderTotalValidate ||
      !this.state.validatePrice ||
      !this.props.tradePanel.price ||
      parseFloat(this.props.tradePanel.price) === 0 ||
      !this.props.tradePanel.amount ||
      parseFloat(this.props.tradePanel.amount) === 0;

    const wrongNetworkInputDisable =
      this.props.dexAccount.account.state !== LOGGED_IN ||
      !this.props.metaMask.isDesiredNetwork;

    const percentageButtonDisabled =
      !this.props.tradePanel.price || this.props.tradePanel.price <= 0;

    const buyOrSellButton = isBuy ? (
      <ActionButton
        block
        buttonbackground={theme.buyPrimary}
        disabled={disabled}
        onClick={() => this.pressedButton()}
      >
        <I s="Buy" />
        &nbsp; {baseTokenSymbol}
      </ActionButton>
    ) : (
      <ActionButton
        block
        buttonbackground={theme.sellPrimary}
        disabled={disabled}
        onClick={() => this.pressedButton()}
      >
        <I s="Sell" />
        &nbsp; {baseTokenSymbol}
      </ActionButton>
    );

    return (
      <div
        style={{
          height: AppLayout.mainScreenHeight,
          backgroundColor: theme.sidePanelBackground,
          overflow: 'scroll',
        }}
      >
        <div
          style={{
            padding: `16px ${AppLayout.sidePadding} 0px`,
          }}
        >
          <AssetPanel />
        </div>
        <div
          style={{
            padding: `16px ${AppLayout.sidePadding} 0px`,
          }}
        >
          <div
            style={{
              paddingTop: '0px',
              paddingBottom: '0px',
            }}
          >
            <TradeTabButtons disabled={wrongNetworkInputDisable} />
            <div
              style={{
                marginBottom: '10px',
              }}
            >
              <TitleLabel>
                <I s="Price" />
              </TitleLabel>
              <NumericInput
                decimals={(marketConfig && marketConfig.precisionForPrice) || 6}
                color={this.state.validatePrice ? theme.textWhite : theme.red}
                borderColor={
                  this.state.validatePrice ? theme.border : theme.red
                }
                value={this.props.tradePanel.price}
                onChange={this.onPriceValueChange}
                suffix={quoteTokenSymbol}
                disabled={wrongNetworkInputDisable}
              />

              <TitleLabel>
                <I s="Amount" />
              </TitleLabel>
              <NumericInput
                decimals={(baseToken && baseToken.precision) || 6}
                color={
                  this.state.baseAmountValidate ? theme.textWhite : theme.red
                }
                borderColor={
                  this.state.baseAmountValidate ? theme.border : theme.red
                }
                value={this.props.tradePanel.amount}
                onChange={this.onAmountValueChange}
                suffix={baseTokenSymbol}
                disabled={wrongNetworkInputDisable}
              />

              <div
                style={{
                  margin: '4px 1px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <PercentageButton
                  disabled={
                    percentageButtonDisabled || wrongNetworkInputDisable
                  }
                  onClick={() => this.handleAmountPercentage(0.25)}
                >
                  25%
                </PercentageButton>
                <PercentageButton
                  disabled={
                    percentageButtonDisabled || wrongNetworkInputDisable
                  }
                  onClick={() => this.handleAmountPercentage(0.5)}
                >
                  50%
                </PercentageButton>
                <PercentageButton
                  disabled={
                    percentageButtonDisabled || wrongNetworkInputDisable
                  }
                  onClick={() => this.handleAmountPercentage(0.75)}
                >
                  75%
                </PercentageButton>
                <PercentageButton
                  disabled={
                    percentageButtonDisabled || wrongNetworkInputDisable
                  }
                  onClick={() => this.handleAmountPercentage(1)}
                >
                  100%
                </PercentageButton>
              </div>

              <TitleLabel>
                <I s="Order Total" />
              </TitleLabel>
              <NumericInput
                decimals={(quoteToken && quoteToken.precision) || 6}
                color={
                  this.state.orderTotalValidate ? theme.textWhite : theme.red
                }
                borderColor={
                  this.state.orderTotalValidate ? theme.border : theme.red
                }
                value={this.state.orderTotal}
                onChange={this.onOrderTotalValueChange}
                suffix={quoteTokenSymbol}
                disabled={wrongNetworkInputDisable}
              />

              <TradePanelErrorMessage
                show={
                  this.props.dexAccount.account.state === LOGGED_IN &&
                  (!this.state.baseAmountValidate ||
                    !this.state.quoteAmountValidate ||
                    !this.state.orderTotalValidate ||
                    !this.state.validatePrice)
                }
                errorMessage1={this.state.errorMessage1}
                errorToken={this.state.errorToken}
                errorMessage2={this.state.errorMessage2}
              />
              <TradePanelWarnMessage
                show={
                  this.props.dexAccount.account.state === LOGGED_IN &&
                  this.state.errorMessage1 === '' &&
                  this.state.warnMessage !== ''
                }
                message={this.state.warnMessage}
              />
            </div>
          </div>
          <Spin
            spinning={this.state.loading}
            indicator={<FontAwesomeIcon icon={faCircleNotch} spin />}
          >
            {buyOrSellButton}
          </Spin>
        </div>

        <EthereumIconWrapper>
          <a
            style={{ color: theme.textDim }}
            href={this.getExchangeContractLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              size="2x"
              style={{ opacity: 0.5, marginBottom: '8px' }}
              icon={faEthereum}
            />
            <div
              style={{
                fontSize: '0.75rem',
                opacity: '0.75',
              }}
            >
              <I s="Powered by Ethereum & Loopring" />
            </div>
          </a>
        </EthereumIconWrapper>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    ticker,
    currentMarket,
    tradePanel,
    Web3,
    dexAccount,
    balances,
    modalManager,
    metaMask,
    myOrders,
    exchange,
  } = state;

  return {
    ticker,
    currentMarket,
    tradePanel,
    Web3,
    dexAccount,
    balances: balances.balances,
    modalManager,
    metaMask,
    myOrders,
    exchange,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAmount: (amount, shouldUpdateOrderTotal) =>
      dispatch(updateAmount(amount, shouldUpdateOrderTotal)),
    updatePrice: (price, shouldUpdateOrderTotal) =>
      dispatch(updatePrice(price, shouldUpdateOrderTotal)),
    fetchMyAccountPage: (accountId, apiKey, tokens) =>
      dispatch(fetchMyAccountPage(accountId, apiKey, tokens)),
    fetchMyOpenOrders: (accountId, limit, offset, market, apiKey, tokens) =>
      dispatch(
        fetchMyOpenOrders(accountId, limit, offset, market, apiKey, tokens)
      ),
    fetchMyHistoryOrders: (accountId, limit, offset, market, apiKey, tokens) =>
      dispatch(
        fetchMyHistoryOrders(accountId, limit, offset, market, apiKey, tokens)
      ),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(TradePanel)
);
