import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeContext } from 'styled-components';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';

import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { history } from 'redux/configureStore';
import { useDispatch, useSelector } from 'react-redux';
import BN from 'bn.js';
import I from 'components/I';
import React, { useContext, useEffect, useState } from 'react';

import { Col, Row, Spin } from 'antd';
import { getStorageId, lightconeGetAccount } from 'lightcone/api/LightconeAPI';
import { joinAmmPool } from 'lightcone/api/AmmAPI';
import config from 'lightcone/config';

import * as fm from 'lightcone/common/formatter';
import {
  fetchAmmMarkets,
  fetchAmmSnapshot,
} from 'redux/actions/swap/AmmMarkets';
import { fetchMyAccountPage } from 'redux/actions/MyAccountPage';
import { notifyError, notifySuccess } from 'redux/actions/Notification';
import { roundToFloat24 } from 'lightcone/common/float';
import NumericInput from 'components/NumericInput';

import { ActionButton } from 'styles/Styles';
import {
  FormDiv,
  InputSection,
  Section,
  SwitchButton,
  getAddLiquidityToken1,
  getAddLiquidityToken2,
  getAssetIconUrl,
  getAvailableAmount,
  getAvailableAmountWithAddress,
  getCurrentPrice,
  getCurrentPriceBottomLabel,
} from 'pages/swap/components/utils';
import {
  loginModal,
  registerAccountModal,
  showConnectToWalletModal,
  showDepositModal,
  showWalletConnectIndicatorModal,
} from 'redux/actions/ModalManager';

import SwapBalanceLabel from 'pages/swap/components/SwapBalanceLabel';
import SwapLabelValue from 'pages/swap/components/SwapLabelValue';
import SwapPoolPricesAndPoolShareItem from 'pages/swap/components/SwapPoolPricesAndPoolShareItem';
import SwapPoolYourPosition from 'pages/swap/components/SwapPoolYourPosition';
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
import { saveLastPoolPage } from 'lightcone/api/localStorgeAPI';

const SwapPoolAddForm = () => {
  const [ammMarket, setAmmMarket] = useState(null);

  const [token0, setToken0] = useState(null);
  const [amount0, setAmount0] = useState(null);
  const [availableAmount0, setAvailableAmount0] = useState('-');
  const [snapshotAmount0, setSnapshotAmount0] = useState(null);
  const [showMaxButton0, setShowMaxButton0] = useState(true);

  const [token1, setToken1] = useState(null);
  const [amount1, setAmount1] = useState(null);
  const [availableAmount1, setAvailableAmount1] = useState('-');
  const [snapshotAmount1, setSnapshotAmount1] = useState(null);
  const [showMaxButton1, setShowMaxButton1] = useState(true);

  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const [poolTokenAmount, setPoolTokenAmount] = useState(null);
  const [yourShare, setYourShare] = useState(null);
  const [poolToken0Amount, setPoolToken0Amount] = useState(null);
  const [poolToken1Amount, setPoolToken1Amount] = useState(null);

  const theme = useContext(ThemeContext);
  const pathname = useSelector((state) => state.router.location.pathname);
  const tokens = useSelector((state) => state.exchange.tokens);
  const balances = useSelector((state) => state.balances.balances);
  const dexAccount = useSelector((state) => state.dexAccount);
  const ammMarkets = useSelector((state) => state.ammMarkets.ammMarkets);
  const snapshot = useSelector((state) => state.ammMarkets.snapshot);
  const exchange = useSelector((state) => state.exchange);
  const slippageTolerance = useSelector(
    (state) => state.swapForm.slippageTolerance
  );

  const exchangeIsInitialized = useSelector(
    (state) => state.exchange.isInitialized
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (pathname.startsWith('/pool/add/')) {
      const poolAddress = pathname.replace('/pool/add/', '');
      dispatch(fetchAmmSnapshot(poolAddress));
    }
  }, [pathname]);

  useEffect(() => {
    if (ammMarkets && tokens !== 0 && exchangeIsInitialized) {
      if (pathname.startsWith('/pool/add/')) {
        const poolAddress = pathname.replace('/pool/add/', '');
        dispatch(fetchAmmSnapshot(poolAddress));
        const ammMarket = ammMarkets.find(
          (ammMarket) =>
            ammMarket.address.toLowerCase() === poolAddress.toLowerCase()
        );

        if (typeof ammMarket === 'undefined') {
          return;
        }

        setAmmMarket(ammMarket);

        const token0Id = ammMarket.inPoolTokens[0];
        const tokenConf0 = config.getTokenByTokenId(token0Id, tokens);
        setToken0(tokenConf0);

        const token1Id = ammMarket.inPoolTokens[1];
        const tokenConf1 = config.getTokenByTokenId(token1Id, tokens);
        setToken1(tokenConf1);

        const snapshot = ammMarket.snapshot;
        if (tokens.length !== 0 && snapshot) {
          const token0Config = config.getTokenBySymbol(
            tokenConf0.symbol,
            tokens
          );
          let token0Amount =
            snapshot.tokenIds[0] === token0Config.tokenId
              ? snapshot.tokenAmounts[0]
              : snapshot.tokenAmounts[1];
          let token1Amount =
            snapshot.tokenIds[0] === token0Config.tokenId
              ? snapshot.tokenAmounts[1]
              : snapshot.tokenAmounts[0];
          const snapshotAmount0 = config.fromWEI(
            tokenConf0.symbol,
            token0Amount,
            tokens
          );
          const snapshotAmount1 = config.fromWEI(
            tokenConf1.symbol,
            token1Amount,
            tokens
          );
          setSnapshotAmount0(snapshotAmount0);
          setSnapshotAmount1(snapshotAmount1);

          // Your share
          const poolAddress = ammMarket.address;
          const poolTokenBalance = getAvailableAmountWithAddress(
            poolAddress,
            tokens,
            balances
          );
          if (poolTokenBalance) {
            setPoolTokenAmount(
              poolTokenBalance
                ? poolTokenBalance.availableInAssetPanel
                : Number(0).toFixed(4)
            );
            const yourShare =
              Number(poolTokenBalance.totalAmount) /
              Number(ammMarket.snapshot.PoolTokenAmount);
            setYourShare(yourShare);

            const poolToken0Amount = Number(snapshotAmount0) * yourShare;
            setPoolToken0Amount(poolToken0Amount);

            const poolToken1Amount = Number(snapshotAmount1) * yourShare;
            setPoolToken1Amount(poolToken1Amount);
          }
        }

        if (
          dexAccount &&
          dexAccount.account &&
          dexAccount.account.state === LOGGED_IN
        ) {
          const availableAmount0 = getAvailableAmount(tokenConf0, balances);
          if (Number(availableAmount0) === 0) {
            setShowMaxButton0(false);
          } else {
            setShowMaxButton0(true);
          }
          setAvailableAmount0(availableAmount0);
          const availableAmount1 = getAvailableAmount(tokenConf1, balances);
          if (Number(availableAmount1) === 0) {
            setShowMaxButton1(false);
          } else {
            setShowMaxButton1(true);
          }
          setAvailableAmount1(availableAmount1);
        }
      } else {
        history.push('/pool');
        saveLastPoolPage('');
      }
    }
  }, [ammMarkets, exchangeIsInitialized, tokens, pathname, balances]);

  function goToDeposit(token) {
    dispatch(showDepositModal(true, token));
  }

  function pressedAddLiquidity() {
    setIsButtonLoading(true);
    // if (dexAccount.account.walletType === 'WalletConnect') {
    //   dispatch(showWalletConnectIndicatorModal(true, 'SWAP_ADD'));
    // }

    (async () => {
      try {
        const poolAddress = pathname.replace('/pool/add/', '');
        const ammMarket = ammMarkets.find(
          (ammMarket) =>
            ammMarket.address.toLowerCase() === poolAddress.toLowerCase()
        );
        const name = ammMarket.name;
        const validUntil =
          Math.ceil(new Date().getTime() / 1000) + 3600 * 24 * 60;

        // token顺序要和amm返回的一致
        // 比如amm token是 [1, 0]
        // 那你的提交是
        // [amount of token 1, amount of token 0],
        // [storageId of token 1, storageId of token 0]

        const tokenConf1 = config.getTokenBySymbol(token0.symbol, tokens);
        const storageId1 = await getStorageId(
          dexAccount.account.accountId,
          tokenConf1.tokenId,
          dexAccount.account.apiKey
        );

        const tokenConf2 = config.getTokenBySymbol(token1.symbol, tokens);
        const storageId2 = await getStorageId(
          dexAccount.account.accountId,
          tokenConf2.tokenId,
          dexAccount.account.apiKey
        );

        const joinStorageIDs = [storageId1.offchainId, storageId2.offchainId];
        const amount0InBN = roundToFloat24(
          new BN(config.toWEI(token0.symbol, amount0, tokens))
        ).toString();
        const amount1InBN = roundToFloat24(
          new BN(config.toWEI(token1.symbol, amount1, tokens))
        ).toString();

        const mintMinAmount =
          snapshot && snapshot.PoolTokenAmount !== '0' && slippageTolerance
            ? roundToFloat24(
                fm.toBN(
                  fm.toFixed(
                    fm
                      .toBig(amount0InBN)
                      .times(snapshot.PoolTokenAmount)
                      .div(snapshot.tokenAmounts[0])
                      .times(1 - Number(slippageTolerance)),
                    0,
                    false
                  )
                )
              )
            : new BN('100');

        let data = {
          name: name,
          owner: dexAccount.account.owner,
          exchange: poolAddress,
          joinAmounts: [amount0InBN, amount1InBN],
          joinStorageIDs: joinStorageIDs,
          mintMinAmount: mintMinAmount.toString(),
          validUntil: Math.floor(validUntil),
        };

        const { eddsaSig } = await window.wallet.ammJoin(data);
        data['eddsaSig'] = eddsaSig;
        data['joinAmounts'] = [amount0InBN, amount1InBN];
        data['joinStorageIDs'] = joinStorageIDs;

        data['mintMinAmount'] = mintMinAmount.toString();
        data['poolAddress'] = poolAddress;

        await joinAmmPool(data, dexAccount.account.apiKey);

        notifySuccess(<I s="AMM_join_succeeded" />, theme, 20);
      } catch (err) {
        console.log('AMM join failed', err);
        notifyError(<I s="AMM_join_failed" />, theme, 20);
      } finally {
        await dispatch(fetchAmmMarkets());
        await lightconeGetAccount(window.wallet.address);
        dispatch(
          fetchMyAccountPage(
            dexAccount.account.accountId,
            dexAccount.account.apiKey,
            tokens
          )
        );
        setAmount0(null);
        setAmount1(null);
        setIsButtonLoading(false);
        // if (dexAccount.walletType === 'WalletConnect') {
        //   dispatch(showWalletConnectIndicatorModal(false, ''));
        // }
      }
    })();
  }

  function onAmount0Change(value) {
    setAmount0(value);

    if (snapshot.PoolTokenAmount !== '0') {
      // Hide MAX button if needed.
      if (Number(availableAmount0) === 0 || availableAmount0 === value) {
        setShowMaxButton0(false);
      } else {
        setShowMaxButton0(true);
      }

      if (token1 != null && !!value) {
        const _amount1 = getAddLiquidityToken2(
          value,
          token0.symbol,
          token1.symbol,
          snapshot,
          tokens
        );
        if (Number(_amount1) > 0) {
          setAmount1(Number(_amount1));
          // Hide MAX button if needed.
          if (
            Number(availableAmount1) === 0 ||
            availableAmount1 === Number(_amount1)
          ) {
            setShowMaxButton1(false);
          } else {
            setShowMaxButton1(true);
          }
        } else {
          setAmount1(null);
        }
      }
    }
  }

  function onAmount1Change(value) {
    setAmount1(value);

    if (snapshot.PoolTokenAmount !== '0') {
      // Hide MAX button if needed.
      if (Number(availableAmount1) === 0 || availableAmount1 === value) {
        setShowMaxButton1(false);
      } else {
        setShowMaxButton1(true);
      }

      if (token0 != null && !!value) {
        const _amount0 = getAddLiquidityToken1(
          value,
          token0.symbol,
          token1.symbol,
          snapshot,
          tokens
        );
        if (Number(_amount0) > 0) {
          setAmount0(Number(_amount0));
          // Hide MAX button if needed.
          if (
            Number(availableAmount0) === 0 ||
            availableAmount0 === Number(_amount0)
          ) {
            setShowMaxButton0(false);
          } else {
            setShowMaxButton0(true);
          }
        } else {
          setAmount0(null);
        }
      }
    }
  }

  function getAddButton(dexAccount) {
    if (dexAccount && dexAccount.account && dexAccount.account.state) {
      if (dexAccount.account.state === LOGGED_IN) {
        if (amount0 && Number(amount0) > 0 && amount1 && Number(amount1) > 0) {
          if (fm.toBig(availableAmount0).lt(amount0)) {
            return (
              <ActionButton
                onClick={() => goToDeposit(token0.symbol)}
                disabled={false}
                buttonbackground={theme.red}
              >
                <div
                  style={{
                    textTransform: 'none',
                  }}
                >
                  <I s="swap_insufficient_1" />
                  {token0.symbol}
                  <I s="swap_insufficient_2" />
                </div>
              </ActionButton>
            );
          }

          if (fm.toBig(availableAmount1).lt(amount1)) {
            return (
              <ActionButton
                onClick={() => goToDeposit(token1.symbol)}
                disabled={false}
                buttonbackground={theme.red}
              >
                <div
                  style={{
                    textTransform: 'none',
                  }}
                >
                  <I s="swap_insufficient_1" />
                  {token1.symbol}
                  <I s="swap_insufficient_2" />
                </div>
              </ActionButton>
            );
          }

          if (token0 && token1) {
            const minAmount0 = config.fromWEI(
              token0.symbol,
              token0.minOrderAmount,
              tokens
            );
            const minAmount1 = config.fromWEI(
              token1.symbol,
              token1.minOrderAmount,
              tokens
            );

            if (Number(amount0) < Number(minAmount0)) {
              return (
                <div>
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
                      <I s="remove_liquidity_amount_too_small" />
                    </div>
                  </ActionButton>
                  <div
                    style={{
                      color: theme.red,
                      marginTop: '14px',
                      textAlign: 'center',
                    }}
                  >
                    <I s="swap_amount_too_small_error_message_1" />
                    <I s="swap_amount_too_small_error_message_2" />
                    {dropTrailingZeroes(minAmount0)} {token0.symbol}
                  </div>
                </div>
              );
            }

            if (Number(amount1) < Number(minAmount1)) {
              return (
                <div>
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
                      <I s="remove_liquidity_amount_too_small" />
                    </div>
                  </ActionButton>
                  <div
                    style={{
                      color: theme.red,
                      marginTop: '14px',
                      textAlign: 'center',
                    }}
                  >
                    <I s="swap_amount_too_small_error_message_1" />
                    <I s="swap_amount_too_small_error_message_2" />
                    {dropTrailingZeroes(minAmount1)} {token1.symbol}
                  </div>
                </div>
              );
            }
          }

          return (
            <ActionButton
              onClick={() => pressedAddLiquidity()}
              disabled={false}
            >
              <I s="Add liquidity button" />
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
      <ActionButton onClick={() => pressedAddLiquidity()} disabled={true}>
        <I s="Add liquidity button" />
      </ActionButton>
    );
  }
  let addButton = getAddButton(dexAccount);

  let input0;
  let token0Component;
  let input1;
  let token1Component;

  let shareOfPool = '-';
  let poolAndShareComponent;
  let buttomComponent;

  if (token0 && token1) {
    input0 = (
      <NumericInput
        decimals={token0.precision}
        fontSize={'1.2rem'}
        value={amount0}
        onChange={onAmount0Change}
      />
    );
    token0Component = (
      <SwapTokenButton
        symbol={token0.symbol}
        iconUrl={getAssetIconUrl(token0)}
        showMax={showMaxButton0}
        onMaxClick={() => {
          onAmount0Change(availableAmount0);
        }}
      />
    );
    input1 = (
      <NumericInput
        decimals={token1.precision}
        fontSize={'1.2rem'}
        value={amount1}
        onChange={onAmount1Change}
      />
    );
    token1Component = (
      <SwapTokenButton
        symbol={token1.symbol}
        iconUrl={getAssetIconUrl(token1)}
        showMax={showMaxButton1}
        onMaxClick={() => {
          onAmount1Change(availableAmount1);
        }}
      />
    );

    if (isNaN(Number(amount0)) === false) {
      shareOfPool =
        Number(amount0) / (Number(snapshotAmount0) + Number(amount0));
      if (Number(amount0) === 0) {
        shareOfPool = '0%';
      } else if (shareOfPool > 0.01) {
        shareOfPool = `${fm.toFixed(shareOfPool * 100, 2, true)}%`;
      } else if (shareOfPool > 0.0001) {
        shareOfPool = `${fm.toFixed(shareOfPool * 100, 4, true)}%`;
      } else {
        shareOfPool = `${fm.toFixed(shareOfPool * 100, 8, true)}%`;
      }
    }

    poolAndShareComponent = (
      <Section
        style={{
          marginTop: '18px',
          marginBottom: '0px',
          padding: '16px 18px 12px',
          border: `1px solid ${theme.inputBorderColor}`,
          borderRadius: '12px',
        }}
      >
        <SwapLabelValue
          labelLeft={<I s="Prices and pool share" />}
          labelRight={''}
          leftColSpan={23}
          rightColSpan={1}
          color={theme.textWhite}
        />
        <Row
          style={{
            marginTop: '8px',
          }}
        >
          <Col span="8">
            <SwapPoolPricesAndPoolShareItem
              topLabel={getCurrentPrice(snapshotAmount1, snapshotAmount0)}
              bottomLabel={getCurrentPriceBottomLabel(
                token0.symbol,
                token1.symbol
              )}
            />
          </Col>
          <Col span="8">
            <SwapPoolPricesAndPoolShareItem
              topLabel={getCurrentPrice(snapshotAmount0, snapshotAmount1)}
              bottomLabel={getCurrentPriceBottomLabel(
                token1.symbol,
                token0.symbol
              )}
            />
          </Col>
          <Col span="8">
            <SwapPoolPricesAndPoolShareItem
              topLabel={shareOfPool}
              bottomLabel={<I s="Share of Pool" />}
            />
          </Col>
        </Row>
      </Section>
    );

    if (yourShare) {
      buttomComponent = (
        <SwapPoolYourPosition
          ammMarket={ammMarket}
          token0={token0}
          token1={token1}
          yourShare={yourShare}
          poolToken0Amount={poolToken0Amount}
          poolToken1Amount={poolToken1Amount}
        />
      );
    }
  } else {
    input0 = (
      <NumericInput decimals={6} value={amount0} onChange={onAmount0Change} />
    );
    token0Component = <SwapTokenButton />;
    input1 = (
      <NumericInput decimals={6} value={amount1} onChange={onAmount1Change} />
    );
    token1Component = <SwapTokenButton />;
    poolAndShareComponent = <div />;
  }

  return (
    <div>
      <FormDiv>
        <Spin spinning={false}>
          <Section
            style={{
              marginBottom: '8px',
            }}
          >
            <SwitchButton
              icon={
                <FontAwesomeIcon
                  style={{
                    color: theme.textWhite,
                  }}
                  icon={faArrowLeft}
                />
              }
              onClick={() => {
                history.push('/pool');
                saveLastPoolPage('');
              }}
            ></SwitchButton>
          </Section>
          <InputSection
            style={{
              padding: '16px 18px 6px',
            }}
          >
            <Section>
              <SwapLabelValue
                labelLeft={<I s="Swap Input" />}
                labelRight={
                  <SwapBalanceLabel
                    text={<I s="Swap Balance" />}
                    availableAmount={availableAmount0}
                    token={token0}
                  />
                }
              />
            </Section>

            <Section>
              <SwapSection
                leftComponent={input0}
                rightComponent={token0Component}
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
              style={{
                pointerEvents: 'none',
              }}
              icon={
                <FontAwesomeIcon
                  style={{
                    color: theme.textWhite,
                  }}
                  icon={faPlus}
                />
              }
              onClick={() => {}}
            ></SwitchButton>
          </Section>

          <InputSection
            style={{
              padding: '16px 18px 6px',
            }}
          >
            <Section>
              <SwapLabelValue
                labelLeft={<I s="Swap Input" />}
                labelRight={
                  <SwapBalanceLabel
                    text={<I s="Swap Balance" />}
                    availableAmount={availableAmount1}
                    token={token1}
                  />
                }
              />
            </Section>

            <Section>
              <SwapSection
                leftComponent={input1}
                rightComponent={token1Component}
              />
            </Section>
          </InputSection>

          {poolAndShareComponent}

          <Section
            style={{
              paddingTop: '18px',
            }}
          >
            <Spin
              spinning={isButtonLoading}
              indicator={<FontAwesomeIcon icon={faCircleNotch} spin />}
            >
              {addButton}
            </Spin>
          </Section>
        </Spin>
      </FormDiv>
      {buttomComponent}
    </div>
  );
};

export default SwapPoolAddForm;
