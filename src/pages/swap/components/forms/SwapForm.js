import { ThemeContext } from 'styled-components';
import { history } from 'redux/configureStore';
import { useDispatch, useSelector } from 'react-redux';
import I from 'components/I';
import React, { useContext, useEffect, useState } from 'react';
import config from 'lightcone/config';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons/faExchangeAlt';

import { ActionButton, ViewAmmTransactionButton } from 'styles/Styles';
import {
  FormDiv,
  InputSection,
  Section,
  SwitchButton,
  applyOrderFee,
  applySlippageTolerance,
  getAmountOutWithSnapshot,
  getAmountOutWithSnapshot_reserve,
  getAssetIconUrl,
} from 'pages/swap/components/utils';
import { Spin } from 'antd';
import { fetchAmmSnapshot } from 'redux/actions/swap/AmmMarkets';
import { fetchMyAccountPage } from 'redux/actions/MyAccountPage';
import {
  getStorageId,
  submitOrderToLightcone,
} from 'lightcone/api/LightconeAPI';
import { notifyError, notifySuccess } from 'redux/actions/Notification';
import AssetSelect, {
  AssetSelectMenuItemStyled,
} from 'modals/components/AssetSelect';
import NumericInput from 'components/NumericInput';
import SwapBalanceLabel from 'pages/swap/components/SwapBalanceLabel';
import SwapLabelValue from 'pages/swap/components/SwapLabelValue';

import SwapPoolTokenLabel from 'pages/swap/components/SwapPoolTokenLabel';
import SwapRegisteringButton from 'pages/swap/components/SwapRegisteringButton';
import SwapSection from 'pages/swap/components/SwapSection';
import SwapTokenButton from 'pages/swap/components/SwapTokenButton';

import {
  LOGGED_IN,
  NOT_REGISTERED,
  REGISTERED,
  REGISTERING,
  UNDEFINED,
  WALLET_UNCONNECTED,
} from 'redux/actions/DexAccount';
import { dropTrailingZeroes } from 'pages/trade/components/defaults/util';
import { getAmmMarketUserFeeRates } from 'lightcone/api/AmmAPI';
import {
  loginModal,
  registerAccountModal,
  showConnectToWalletModal,
  showDepositModal,
} from 'redux/actions/ModalManager';
import { setSwapPair } from 'redux/actions/swap/CurrentSwapForm';

const BigNumber = require('bignumber.js');

const SwapForm = () => {
  const [amount0, setAmount0] = useState(null);
  const [availableAmount0, setAvailableAmount0] = useState('-');
  const [snapshotAmount0, setSnapshotAmount0] = useState(null);
  const [amount0ApplyOrderFee, setAmount0ApplyOrderFee] = useState(null);

  const [amount1, setAmount1] = useState(null);
  const [availableAmount1, setAvailableAmount1] = useState('-');
  const [snapshotAmount1, setSnapshotAmount1] = useState(null);
  const [amount1ApplyOrderFee, setAmount1ApplyOrderFee] = useState(null);

  const [minAmount0, setMinAmount0] = useState('-');

  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceImpact, setPriceImpact] = useState(0);
  // const [liqudityProviderFee, setLiquidityFee] = useState(null);

  const [swapDirection, setSwapDirection] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [showMaxButton, setShowMaxButton] = useState(false);

  const theme = useContext(ThemeContext);

  const tokens = useSelector((state) => state.exchange.tokens);
  const balances = useSelector((state) => state.balances.balances);
  const dexAccount = useSelector((state) => state.dexAccount);
  const exchange = useSelector((state) => state.exchange);
  const ammMarkets = useSelector((state) => state.ammMarkets.ammMarkets);
  const snapshot = useSelector((state) => state.ammMarkets.snapshot);
  const [currentAmmMarket, setCurrentAmmMarket] = useState(null);

  const slippageTolerance = useSelector(
    (state) => state.swapForm.slippageTolerance
  );
  const token0 = useSelector((state) => state.swapForm.token0);
  const token1 = useSelector((state) => state.swapForm.token1);

  const [token0Config, setToken0Config] = useState(null);
  const [token1Config, setToken1Config] = useState(null);

  const exchangeIsInitialized = useSelector(
    (state) => state.exchange.isInitialized
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !!ammMarkets &&
      ammMarkets.length !== 0 &&
      !!tokens &&
      tokens.length !== 0 &&
      exchangeIsInitialized
    ) {
      const swapPair01 = `${token0}-${token1}`;
      const swapPair10 = `${token1}-${token0}`;

      const filteredAmmMarket = ammMarkets.find(
        (ammMarket) =>
          (ammMarket.market.includes(swapPair01) ||
            ammMarket.market.includes(swapPair10)) &&
          ammMarket.enabled === true
      );

      if (filteredAmmMarket) {
        setCurrentAmmMarket(filteredAmmMarket);
        const poolAddress = filteredAmmMarket.address;
        dispatch(fetchAmmSnapshot(poolAddress));

        if (
          dexAccount &&
          dexAccount.account &&
          dexAccount.account.state === LOGGED_IN
        ) {
          (async () => {
            try {
              await getAmmMarketUserFeeRates(
                dexAccount.account.accountId,
                filteredAmmMarket.market,
                dexAccount.account.apiKey
              );
            } catch (err) {
              console.log('err', err);
            }
          })();
        } else {
        }
      }
    }
  }, [ammMarkets, tokens, exchangeIsInitialized, token0, token1, dexAccount]);

  useEffect(() => {
    if (tokens.length !== 0 && token0) {
      const availableAmount0 = getAvailableAmount(token0, tokens, balances);
      if (Number(availableAmount0) === 0) {
        setShowMaxButton(false);
      } else {
        setShowMaxButton(true);
      }
      setAvailableAmount0(availableAmount0);
    }

    if (tokens.length !== 0 && token1) {
      setAvailableAmount1(getAvailableAmount(token1, tokens, balances));
    }

    if (tokens.length !== 0 && token0 && token1 && snapshot) {
      const token0Config = config.getTokenBySymbol(token0, tokens);
      setToken0Config(token0Config);

      const token1Config = config.getTokenBySymbol(token1, tokens);
      setToken1Config(token1Config);

      let token0Amount =
        snapshot.tokenIds[0] === token0Config.tokenId
          ? snapshot.tokenAmounts[0]
          : snapshot.tokenAmounts[1];
      let token1Amount =
        snapshot.tokenIds[0] === token0Config.tokenId
          ? snapshot.tokenAmounts[1]
          : snapshot.tokenAmounts[0];
      const snapshotAmount0 = config.fromWEI(token0, token0Amount, tokens);
      const snapshotAmount1 = config.fromWEI(token1, token1Amount, tokens);

      const minAmount0 = config.fromWEI(
        token0,
        token0Config.minOrderAmount,
        tokens
      );
      setMinAmount0(minAmount0);

      setSnapshotAmount0(snapshotAmount0);
      setSnapshotAmount1(snapshotAmount1);
      setCurrentPrice(snapshotAmount1 / snapshotAmount0);
    }
  }, [balances, tokens, snapshot, token0, token1]);

  useEffect(() => {
    onAmount0Change(amount1);
  }, [swapDirection]);

  function getAvailableAmount(symbol, tokens, balances) {
    const token = config.getTokenBySymbol(symbol, tokens);
    const holdBalance = balances.find((ba) => ba.tokenId === token.tokenId);
    return holdBalance
      ? holdBalance.availableInAssetPanel
      : Number(0).toFixed(token.precision);
  }

  function pressedSwap() {
    submitOrder();
  }

  function goToDeposit() {
    dispatch(showDepositModal(true, token0));
  }

  function swapFromTo() {
    setCurrentPrice(1 / currentPrice);

    dispatch(setSwapPair(token1, token0));
    history.push(`/swap/${token1}-${token0}`);

    setSnapshotAmount0(snapshotAmount1);
    setSnapshotAmount1(snapshotAmount0);
    setAvailableAmount0(availableAmount1);
    setAvailableAmount1(availableAmount0);

    setSwapDirection(!swapDirection);
  }

  function submitOrder() {
    setIsButtonLoading(true);
    (async () => {
      try {
        const token0Config = config.getTokenBySymbol(token0, exchange.tokens);
        const token1Config = config.getTokenBySymbol(token1, exchange.tokens);

        // Amount is always in base token
        const amount0InBigNumber = new BigNumber(amount0);
        const amount1WithSlippage = applySlippageTolerance(
          amount1,
          token1,
          tokens,
          slippageTolerance
        );
        const amount1InBigNumber = new BigNumber(amount1WithSlippage);

        // 输入ETH的买单 TokenS:ETH TokenB:LRC, fillB = True, 输入ETH，计算Out值
        // 输入LRC的买单 TokenS:ETH TokenB:LRC, fillB = False, 输入LRC，计算IN值
        // 输入ETH的卖单 TokenS:LRC TokenB:ETH, fillB = False, 输入ETH，计算IN值
        // 输入LRC的卖单 TokenS:LRC TokenB:ETH, fillB = True, 输入LRC，计算OUT值

        // TODO: 遇到这个错误 Error: amm order only support fillAmountBOrS = false

        // amm order only support fillAmountBOrS = false
        const fillAmountBOrS = false;

        const tradingPrivKey = dexAccount.account.accountKey;
        if (!tradingPrivKey) {
          throw new Error('please login first');
        }

        // Get order id
        const accountId = dexAccount.account.accountId;
        const apiKey = dexAccount.account.apiKey;
        // Use token sell id

        const storageId = await getStorageId(
          accountId,
          token0Config.tokenId,
          apiKey
        );
        const orderId = storageId.orderId;

        // Timestamp in second
        const validSince = Math.ceil(new Date().getTime() / 1000) - 3600;
        const validUntil =
          Math.ceil(new Date().getTime() / 1000) + 3600 * 10000;

        const signedOrderData = window.wallet.submitOrder(
          exchange.tokens,
          exchange.exchangeAddress,
          token0Config.symbol,
          token1Config.symbol,
          amount0InBigNumber.toFixed(),
          amount1InBigNumber.toFixed(),
          orderId,
          validSince,
          validUntil,
          config.getLabel(),
          fillAmountBOrS,
          config.getChannelId(),
          'AMM',
          snapshot.poolAddress
        );

        signedOrderData['storageId'] = orderId;

        await submitOrderToLightcone(signedOrderData, apiKey);

        notifySuccess(<I s="Swapped successfully" />, theme, 20);
        dispatch(fetchAmmSnapshot(snapshot.poolAddress));
      } catch (err) {
        console.log(err);
        notifyError(<I s="Failed to submit your order." />, theme, 20);
      } finally {
        dispatch(
          fetchMyAccountPage(
            dexAccount.account.accountId,
            dexAccount.account.apiKey,
            tokens
          )
        );
        // Reset form
        setAmount0(null);
        setAmount1(null);
        setIsButtonLoading(false);
        dispatch(fetchAmmSnapshot(snapshot.poolAddress));
      }
    })();
  }

  function onAmount0Change(value) {
    setAmount0(value);
    setAmount0ApplyOrderFee(Number(value));
    if (!!value || value === '') {
      setPriceImpact(0);
    }

    // Hide MAX button if needed.
    if (Number(availableAmount0) === 0 || availableAmount0 === value) {
      setShowMaxButton(false);
    } else {
      setShowMaxButton(true);
    }

    if (currentAmmMarket && token1 != null && !!value) {
      console.log('currentAmmMarket', currentAmmMarket);
      const _amount1InWei = getAmountOutWithSnapshot(
        value,
        token0,
        currentAmmMarket,
        snapshot,
        tokens
      );
      const _amount1 = config.fromWEI(token1, _amount1InWei, tokens);

      const _amount1ApplyOrderFeeInWei = applyOrderFee(
        _amount1,
        token1,
        tokens,
        currentAmmMarket.feeBips
      );
      const _amount1ApplyOrderFee = config.fromWEI(
        token1,
        _amount1ApplyOrderFeeInWei,
        tokens
      );

      const _amount0 = value;
      if (Number(_amount1ApplyOrderFee) > 0) {
        setAmount1(Number(_amount1ApplyOrderFee));
        setAmount1ApplyOrderFee(Number(_amount1ApplyOrderFee));
        const newPrice =
          (Number(snapshotAmount1) - Number(_amount1ApplyOrderFee)) /
          (Number(snapshotAmount0) + Number(_amount0));
        setPriceImpact((newPrice - currentPrice) / currentPrice);
      } else {
        setAmount1(null);
        setAmount1ApplyOrderFee(0);
        setPriceImpact(0);
      }
    }
  }

  function onAmount1Change(value) {
    setAmount1(value);
    setAmount1ApplyOrderFee(Number(value));
    if (!!value || value === '') {
      setPriceImpact(0);
    }

    if (currentAmmMarket && token0 != null && !!value) {
      const _amount0InWei = getAmountOutWithSnapshot_reserve(
        value,
        token1,
        currentAmmMarket,
        snapshot,
        tokens
      );
      const _amount0 = config.fromWEI(token0, _amount0InWei, tokens);

      const _amount0ApplyOrderFeeInWei = applyOrderFee(
        _amount0,
        token0,
        tokens,
        currentAmmMarket.feeBips
      );
      const _amount0ApplyOrderFee = config.fromWEI(
        token0,
        _amount0ApplyOrderFeeInWei,
        tokens
      );

      const _amount1 = value;
      if (Number(_amount0ApplyOrderFee) > 0) {
        setAmount0(Number(_amount0ApplyOrderFee));
        setAmount0ApplyOrderFee(Number(_amount0ApplyOrderFee));

        // Hide MAX button if needed.
        if (
          Number(availableAmount0) === 0 ||
          availableAmount0 === _amount0ApplyOrderFee
        ) {
          setShowMaxButton(false);
        } else {
          setShowMaxButton(true);
        }

        setPriceImpact(
          (Number(_amount1) / Number(_amount0ApplyOrderFee) - currentPrice) /
            currentPrice
        );
      } else {
        setAmount0(null);
        setAmount0ApplyOrderFee(0);
        setPriceImpact(0);
      }
    }
  }

  function getSwapButton(dexAccount) {
    if (dexAccount && dexAccount.account && dexAccount.account.state) {
      if (dexAccount.account.state === LOGGED_IN) {
        const token0Config = config.getTokenBySymbol(token0, tokens);
        const minAmount0 = config.fromWEI(
          token0,
          token0Config.minOrderAmount,
          tokens
        );
        const maxAmount0 = config.fromWEI(
          token0,
          token0Config.maxOrderAmount,
          tokens
        );

        if (amount0 && amount0 > 0) {
          if (Number(amount0) > maxAmount0) {
            return (
              <ActionButton
                disabled={true}
                disabledbuttonbackground={theme.red}
                disabledcolor={theme.textSelection}
              >
                <div
                  style={{
                    textTransform: 'none',
                  }}
                >
                  <I s="swap_amount_too_large" />: {Number(maxAmount0)}
                  {token0}
                </div>
              </ActionButton>
            );
          }

          if (amount1ApplyOrderFee === 0) {
            return (
              <ActionButton
                disabled={true}
                disabledbuttonbackground={theme.red}
                disabledcolor={theme.textSelection}
              >
                <div
                  style={{
                    textTransform: 'none',
                  }}
                >
                  <I s="swap_amount_too_small" />: {Number(minAmount0)}
                  {token0}
                </div>
              </ActionButton>
            );
          }

          if (Number(amount0) < Number(minAmount0)) {
            return (
              <ActionButton
                disabled={true}
                disabledbuttonbackground={theme.red}
                disabledcolor={theme.textSelection}
              >
                <div
                  style={{
                    textTransform: 'none',
                  }}
                >
                  <I s="swap_amount_too_small" />: {Number(minAmount0)}
                  {token0}
                </div>
              </ActionButton>
            );
          }

          // Check if insufficient balance
          if (Number(amount0) > Number(availableAmount0)) {
            return (
              <ActionButton
                onClick={() => goToDeposit()}
                disabled={false}
                buttonbackground={theme.red}
              >
                <div
                  style={{
                    textTransform: 'none',
                  }}
                >
                  <I s="swap_insufficient_1" />
                  {token0}
                  <I s="swap_insufficient_2" />
                </div>
              </ActionButton>
            );
          }

          return (
            <ActionButton onClick={() => pressedSwap()} disabled={false}>
              <I s="Swap" />
            </ActionButton>
          );
        } else {
          return (
            <ActionButton disabled={true}>
              <I s="Enter an amount" />
            </ActionButton>
          );
        }
      } else if (dexAccount.account.state === REGISTERED) {
        return (
          <ActionButton
            onClick={() => dispatch(loginModal(true))}
            disabled={false}
          >
            <I s="Unlock" />
          </ActionButton>
        );
      } else if (dexAccount.account.state === NOT_REGISTERED) {
        return (
          <ActionButton
            onClick={() => dispatch(registerAccountModal(true))}
            disabled={false}
          >
            <I s="Deposit to Activate Layer-2" />
          </ActionButton>
        );
      } else if (dexAccount.account.state === REGISTERING) {
        return <SwapRegisteringButton />;
      } else if (
        dexAccount.account.state === WALLET_UNCONNECTED ||
        dexAccount.account.state === UNDEFINED
      ) {
        return (
          <ActionButton
            onClick={() => dispatch(showConnectToWalletModal(true))}
            disabled={false}
          >
            <I s="Connect Wallet" />
          </ActionButton>
        );
      }
    }
    return (
      <ActionButton onClick={() => pressedSwap()} disabled={true}>
        <I s="Swap" />
      </ActionButton>
    );
  }
  let swapButton = getSwapButton(dexAccount);

  let fromInput = (
    <NumericInput
      decimals={6}
      fontSize={'1.2rem'}
      value={amount0}
      onChange={onAmount0Change}
    />
  );

  let fromToken = (
    <SwapTokenButton
      symbol={token0}
      iconUrl={getAssetIconUrl(token0Config)}
      // onClick={() => {
      //   dispatch(showSwapSelectTokenModal(true, token0, true));
      // }}
      showMax={showMaxButton}
      onMaxClick={() => {
        onAmount0Change(availableAmount0);
      }}
    />
  );

  let toInput = (
    <NumericInput
      decimals={6}
      fontSize={'1.2rem'}
      value={amount1}
      onChange={onAmount1Change}
    />
  );

  let toToken = (
    <SwapTokenButton
      symbol={token1}
      iconUrl={getAssetIconUrl(token1Config)}
      // onClick={() => {
      //   dispatch(showSwapSelectTokenModal(true, token1, false));
      // }}
      showMax={false}
      onMaxClick={() => {
        onAmount1Change(availableAmount1);
      }}
    />
  );

  let slippageTolerancePercentage;
  if ([0.001, 0.005, 0.01].includes(slippageTolerance)) {
    slippageTolerancePercentage = (Math.abs(slippageTolerance) * 100).toFixed(
      2
    );
  } else {
    slippageTolerancePercentage = dropTrailingZeroes(
      (slippageTolerance * 100).toFixed(6)
    );
  }

  let currentPriceString = '';
  if (currentPrice) {
    let decimals = 8;
    if (Number(currentPrice) > 10) {
      decimals = 2;
    }
    currentPriceString = (
      <div>
        {`${currentPrice.toFixed(decimals)} ${token1}`}
        <I s="Swap Per" />
        {`${token0}`}
      </div>
    );
  } else {
    currentPriceString = '-';
  }

  // let minAmount0Color = theme.textWhite;
  // if (
  //   minAmount0 &&
  //   minAmount0 !== '-' &&
  //   amount0 &&
  //   Number(amount0) < Number(minAmount0)
  // ) {
  //   minAmount0Color = theme.red;
  // }

  let priceImpactPercentage = `${(Math.abs(priceImpact) * 100).toFixed(2)}%`;
  let priceImpactColor = theme.textWhite;
  let minimumReceivedString = `- ${token1}`;
  if (amount0 && amount1) {
    let minimumReceived = amount1 * (1 - slippageTolerance);
    minimumReceivedString = `${minimumReceived.toFixed(6)} ${token1}`;
    if (Math.abs(slippageTolerance) > Math.abs(priceImpact)) {
      priceImpactColor = theme.green;
      if (Math.abs(priceImpact) < 0.01) {
        priceImpactPercentage = '< 0.01%';
      }
    } else {
      priceImpactColor = theme.red;
    }
  }

  let options = [];
  if (ammMarkets && exchangeIsInitialized) {
    options = ammMarkets
      .filter((ammMarket) => ammMarket.enabled)
      .map((ammMarket, i) => {
        const token0 = config.getTokenByTokenId(
          ammMarket.inPoolTokens[0],
          tokens
        );

        const token1 = config.getTokenByTokenId(
          ammMarket.inPoolTokens[1],
          tokens
        );

        let menuItem = (
          <AssetSelectMenuItemStyled
            style={{}}
            key={i}
            onMouseDown={() => {
              setAmount0(null);
              setAmount1(null);
              history.push(`/swap/${token0.symbol}-${token1.symbol}`);
              dispatch(setSwapPair(token0.symbol, token1.symbol));
            }}
            value={`${token0.symbol}-${token1.symbol}`}
            searchValue={`${token0.symbol}-${token1.symbol}`}
          >
            <SwapPoolTokenLabel
              text={`${token0.symbol}-${token1.symbol}`}
              token0={token0}
              token1={token1}
              cursor="pointer"
            />
          </AssetSelectMenuItemStyled>
        );

        return menuItem;
      });
  }

  // TODO: fix me ETH
  let currentSwapPairSorted = '';
  let stableTokens = ['USDT', 'DAI', 'USDC'];
  if (stableTokens.includes(token0)) {
    currentSwapPairSorted = `${token1}-${token0}`;
  } else if (stableTokens.includes(token1)) {
    currentSwapPairSorted = `${token0}-${token1}`;
  } else if (token0 === 'ETH') {
    currentSwapPairSorted = `${token1}-${token0}`;
  } else {
    currentSwapPairSorted = `${token0}-${token1}`;
  }

  return (
    <FormDiv>
      <Spin spinning={false}>
        <Section
          style={{
            marginBottom: '16px',
          }}
        >
          <AssetSelect
            style={{
              filter: theme.formDivFilter,
            }}
            noDataText={'NoAmmSwap'}
            options={options}
            value={
              token0Config ? (
                <SwapPoolTokenLabel
                  text={`${token0Config.symbol}-${token1Config.symbol}`}
                  token0={token0Config}
                  token1={token1Config}
                  cursor="pointer"
                />
              ) : (
                <div />
              )
            }
            paddingLeft="18px"
            paddingRight="18px"
            borderRadius="12px"
            size={'large'}
          />
        </Section>
        <InputSection>
          <Section>
            <SwapLabelValue
              labelLeft={<I s="Swap From" />}
              labelRight={
                <SwapBalanceLabel
                  text={<I s="Swap Balance" />}
                  availableAmount={availableAmount0}
                  token={token0}
                />
              }
              leftColSpan={8}
              rightColSpan={16}
            />
          </Section>

          <Section>
            <SwapSection
              leftComponent={fromInput}
              rightComponent={fromToken}
              leftColSpan={showMaxButton ? 12 : 16}
              rightColSpan={showMaxButton ? 12 : 8}
            />
          </Section>
        </InputSection>

        <Section
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '4px',
            marginBottom: '4px',
          }}
        >
          <SwitchButton
            icon={
              <FontAwesomeIcon
                style={{
                  color: theme.primary,
                }}
                rotation={90}
                icon={faExchangeAlt}
              />
            }
            onClick={() => {
              swapFromTo();
            }}
          />
        </Section>

        <InputSection>
          <Section>
            <SwapLabelValue
              labelLeft={<I s="Swap To" />}
              labelRight={
                <SwapBalanceLabel
                  text={<I s="Swap Balance" />}
                  availableAmount={availableAmount1}
                  token={token1}
                />
              }
              leftColSpan={8}
              rightColSpan={16}
            />
          </Section>

          <Section>
            <SwapSection
              leftComponent={toInput}
              rightComponent={toToken}
              leftColSpan={16}
              rightColSpan={8}
            />
          </Section>
        </InputSection>

        <Section
          style={{
            marginTop: '18px',
            marginBottom: '10px',
            paddingLeft: '8px',
            paddingRight: '8px',
          }}
          s
        >
          <SwapLabelValue
            labelLeft={<I s="Current Price" />}
            labelRight={
              <span
                style={{
                  color: theme.textWhite,
                }}
              >
                {currentPriceString}
              </span>
            }
            leftColSpan={6}
            rightColSpan={18}
          />
        </Section>

        {/*<Section*/}
        {/*  style={{*/}
        {/*    marginTop: '10px',*/}
        {/*    marginBottom: '10px',*/}
        {/*    paddingLeft: '8px',*/}
        {/*    paddingRight: '8px',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <SwapLabelValue*/}
        {/*    labelLeft={<I s="Minimum Order Amount" />}*/}
        {/*    labelRight={*/}
        {/*      <span*/}
        {/*        style={{*/}
        {/*          color: minAmount0Color,*/}
        {/*        }}*/}
        {/*      >*/}
        {/*        {`${dropTrailingZeroes(minAmount0)} ${token0}`}*/}
        {/*      </span>*/}
        {/*    }*/}
        {/*    leftColSpan={12}*/}
        {/*    rightColSpan={12}*/}
        {/*  />*/}
        {/*</Section>*/}

        <Section
          style={{
            marginTop: '10px',
            marginBottom: '10px',
            paddingLeft: '8px',
            paddingRight: '8px',
          }}
        >
          <SwapLabelValue
            labelLeft={<I s="Slippage Tolerance" />}
            labelRight={
              <span
                style={{
                  color: theme.textWhite,
                }}
              >{`${slippageTolerancePercentage}%`}</span>
            }
            leftColSpan={12}
            rightColSpan={12}
          />
        </Section>

        <Section
          style={{
            marginTop: '10px',
            marginBottom: '10px',
            paddingLeft: '8px',
            paddingRight: '8px',
          }}
        >
          <SwapLabelValue
            labelLeft={<I s="Minimum Received" />}
            labelRight={
              <span
                style={{
                  color: theme.textWhite,
                }}
              >{`${minimumReceivedString}`}</span>
            }
            leftColSpan={12}
            rightColSpan={12}
          />
        </Section>

        <Section
          style={{
            marginTop: '10px',
            marginBottom: '10px',
            paddingLeft: '8px',
            paddingRight: '8px',
          }}
        >
          <SwapLabelValue
            labelLeft={<I s="Price Impact" />}
            labelRight={
              <span
                style={{
                  color: priceImpactColor,
                }}
              >
                {priceImpactPercentage}
              </span>
            }
            leftColSpan={12}
            rightColSpan={12}
          />
        </Section>

        <Section
          style={{
            marginTop: '10px',
            marginBottom: '10px',
            paddingLeft: '8px',
            paddingRight: '8px',
          }}
        >
          <SwapLabelValue
            labelLeft={<I s="Swap Fee" />}
            labelRight={
              <span
                style={{
                  color: theme.textWhite,
                }}
              >{`${0.25}%`}</span>
            }
            leftColSpan={12}
            rightColSpan={12}
          />
        </Section>

        <Section
          className="desktop-layout"
          style={{
            marginTop: '10px',
            marginBottom: '10px',
            paddingTop: '0px',
            paddingLeft: '8px',
            paddingRight: '8px',
          }}
        >
          <SwapLabelValue
            labelLeft={
              <ViewAmmTransactionButton
                disabled={dexAccount.account.state === LOGGED_IN ? false : true}
                type="link"
                onClick={() => {
                  history.push('/orders/order-history');
                }}
              >
                <I s="View order history" />
              </ViewAmmTransactionButton>
            }
            labelRight={''}
            leftColSpan={23}
            rightColSpan={1}
            color={theme.textWhite}
          />
        </Section>

        <Section
          style={{
            paddingTop: '10px',
          }}
        >
          <Spin
            spinning={isButtonLoading}
            indicator={<FontAwesomeIcon icon={faCircleNotch} spin />}
          >
            {swapButton}
          </Spin>
        </Section>
      </Spin>
    </FormDiv>
  );
};

export default SwapForm;
