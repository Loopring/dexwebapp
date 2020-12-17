import { ThemeContext } from 'styled-components';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import React, { useContext, useEffect, useState } from 'react';

import { history } from 'redux/configureStore';
import { useDispatch, useSelector } from 'react-redux';

import I from 'components/I';

import { Col, Row, Spin } from 'antd';
import { exitAmmPool } from 'lightcone/api/AmmAPI';
import { getStorageId, lightconeGetAccount } from 'lightcone/api/LightconeAPI';
import config from 'lightcone/config';

import { fetchMyAccountPage } from 'redux/actions/MyAccountPage';
import { notifyError, notifySuccess } from 'redux/actions/Notification';
import NumericInput from 'components/NumericInput';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';

import { ActionButton } from 'styles/Styles';
import {
  FormDiv,
  InputSection,
  Section,
  SwitchButton,
  getAssetIconUrl,
  getAvailableAmount,
  getAvailableAmountWithAddress,
  getCurrentPrice,
  getCurrentPriceBottomLabel,
} from 'pages/swap/components/utils';
import { fetchAmmSnapshot } from 'redux/actions/swap/AmmMarkets';
import SwapBalanceLabel from 'pages/swap/components/SwapBalanceLabel';
import SwapLabelValue from 'pages/swap/components/SwapLabelValue';
import SwapPoolPricesAndPoolShareItem from 'pages/swap/components/SwapPoolPricesAndPoolShareItem';
import SwapPoolRemoveSlider from 'pages/swap/components/SwapPoolRemoveSlider';
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
import {
  loginModal,
  registerAccountModal,
  showConnectToWalletModal,
  showWalletConnectIndicatorModal,
} from 'redux/actions/ModalManager';

import * as fm from 'lightcone/common/formatter';
import { dropTrailingZeroes } from 'pages/trade/components/defaults/util';
import {
  getSwapPoolRemoveFormType,
  saveLastPoolPage,
} from 'lightcone/api/localStorgeAPI';
import { roundToFloat24 } from 'lightcone/common/float';
import BN from 'bn.js';

const SwapPoolRemoveForm = () => {
  const [ammMarket, setAmmMarket] = useState(null);
  const [token0, setToken0] = useState(null);
  const [amount0, setAmount0] = useState(null);
  const [snapshotAmount0, setSnapshotAmount0] = useState(null);

  const [token1, setToken1] = useState(null);
  const [amount1, setAmount1] = useState(null);
  const [snapshotAmount1, setSnapshotAmount1] = useState(null);

  const [yourShare, setYourShare] = useState(null);
  const [poolToken0Amount, setPoolToken0Amount] = useState(null);
  const [poolToken1Amount, setPoolToken1Amount] = useState(null);

  const [poolToken, setPoolToken] = useState(null);
  const [poolTokenAmount, setPoolTokenAmount] = useState(null);
  const [availablePoolTokenAmount, setAvailablePoolTokenAmount] = useState('-');
  const [snapshotPoolTokenAmount, setSnapshotPoolTokenAmount] = useState(null);

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [showMaxButton, setShowMaxButton] = useState(false);

  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const [percentage, setPercentage] = useState(0);
  const [formType, setFormType] = useState(getSwapPoolRemoveFormType());

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

  const dispatch = useDispatch();

  useEffect(() => {
    if (ammMarkets && tokens !== 0 && exchange.isInitialized) {
      if (pathname.startsWith('/pool/remove/')) {
        const poolAddress = pathname.replace('/pool/remove/', '');
        dispatch(fetchAmmSnapshot(poolAddress));
        const ammMarket = ammMarkets.find(
          (ammMarket) =>
            ammMarket.address.toLowerCase() === poolAddress.toLowerCase()
        );

        if (ammMarket) {
          setAmmMarket(ammMarket);
          const poolTokenConf = config.getTokenByTokenId(
            ammMarket.poolTokenId,
            tokens
          );
          setPoolToken(poolTokenConf);

          const token0Id = ammMarket.inPoolTokens[0];
          const tokenConf0 = config.getTokenByTokenId(token0Id, tokens);
          setToken0(tokenConf0);

          const token1Id = ammMarket.inPoolTokens[1];
          const tokenConf1 = config.getTokenByTokenId(token1Id, tokens);
          setToken1(tokenConf1);

          if (
            dexAccount &&
            dexAccount.account &&
            dexAccount.account.state === LOGGED_IN
          ) {
            const poolTokenBalance = getAvailableAmountWithAddress(
              poolAddress,
              tokens,
              balances
            );
            const availablePoolTokenAmount = getAvailableAmount(
              poolTokenConf,
              balances
            );
            if (Number(availablePoolTokenAmount) === 0) {
              setShowMaxButton(false);
              setIsFormDisabled(true);
            } else {
              setShowMaxButton(true);
              setIsFormDisabled(false);
            }
            setAvailablePoolTokenAmount(availablePoolTokenAmount);

            if (Number(availablePoolTokenAmount) > 0) {
              const snapshot = ammMarket.snapshot;
              let token0Amount =
                snapshot.tokenIds[0] === tokenConf0.tokenId
                  ? snapshot.tokenAmounts[0]
                  : snapshot.tokenAmounts[1];
              let token1Amount =
                snapshot.tokenIds[0] === tokenConf0.tokenId
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
              const yourShare =
                Number(poolTokenBalance.totalAmount) /
                Number(ammMarket.snapshot.PoolTokenAmount);
              setYourShare(yourShare);

              const poolToken0Amount = Number(snapshotAmount0) * yourShare;
              setPoolToken0Amount(poolToken0Amount);

              const poolToken1Amount = Number(snapshotAmount1) * yourShare;
              setPoolToken1Amount(poolToken1Amount);

              const snapshotPoolTokenAmount = config.fromWEI(
                poolTokenConf.symbol,
                ammMarket.snapshot.PoolTokenAmount,
                tokens
              );
              setSnapshotPoolTokenAmount(snapshotPoolTokenAmount);
            }
          }
        }
      } else {
        history.push('/pool');
        saveLastPoolPage('');
      }
    }
  }, [ammMarkets, exchange, tokens, pathname, balances]);

  function pressedExitLiquidity() {
    setIsButtonLoading(true);
    // if (dexAccount.account.walletType === 'WalletConnect') {
    //   dispatch(showWalletConnectIndicatorModal(true, 'SWAP_REMOVE'));
    // }

    (async () => {
      try {
        const poolAddress = pathname.replace('/pool/remove/', '');
        const ammMarket = ammMarkets.find(
          (ammMarket) =>
            ammMarket.address.toLowerCase() === poolAddress.toLowerCase()
        );

        const name = ammMarket.name;
        const poolTokenId = ammMarket.poolTokenId;

        const validUntil =
          Math.ceil(new Date().getTime() / 1000) + 3600 * 24 * 60;

        const tokenConf = config.getTokenByTokenId(poolTokenId, tokens);
        const storageId = await getStorageId(
          dexAccount.account.accountId,
          poolTokenId,
          dexAccount.account.apiKey
        );

        const amountInBN = roundToFloat24(
          new BN(config.toWEI(tokenConf.symbol, poolTokenAmount, tokens))
        ).toString();
        const exitMinAmounts =
          snapshot && slippageTolerance
            ? snapshot.tokenAmounts.map((amount) => {
                return roundToFloat24(
                  new BN(
                    fm.toFixed(
                      fm
                        .toBig(amount)
                        .times(amountInBN)
                        .div(snapshot.PoolTokenAmount)
                        .times(1 - Number(slippageTolerance)),
                      0,
                      false
                    )
                  )
                ).toString();
              })
            : ['10', '10'];

        let data = {
          name: name,
          owner: dexAccount.account.owner,
          exchange: poolAddress,
          burnAmount: amountInBN,
          burnStorageID: storageId.offchainId,
          exitMinAmounts: exitMinAmounts,
          fee: '0', //TODO: 后端配置没有添加
          validUntil: Math.floor(validUntil),
        };

        const { eddsaSig } = await window.wallet.ammExit(data);

        data['eddsaSig'] = eddsaSig;
        data['exitMinAmounts'] = exitMinAmounts;
        data['fee'] = '0';
        data['poolAddress'] = poolAddress;

        const result = await exitAmmPool(
          data,
          dexAccount.account.apiKey
        );
        notifySuccess(<I s="AMM_exit_succeeded" />, theme, 20);
      } catch (err) {
        console.log(err);
        notifyError(<I s="AMM_exit_failed" />, theme, 20);
      } finally {
        lightconeGetAccount(window.wallet.address);
        dispatch(
          fetchMyAccountPage(
            dexAccount.account.accountId,
            dexAccount.account.apiKey,
            tokens
          )
        );
        setPoolTokenAmount(null);
        setIsButtonLoading(false);
        // if (dexAccount.walletType === 'WalletConnect') {
        //   dispatch(showWalletConnectIndicatorModal(false, ''));
        // }
      }
    })();
  }

  function formTypeOnChange(formType) {
    setFormType(formType);
  }

  function percentageOnChange(percentage) {
    let amount = (Number(percentage) / 100) * availablePoolTokenAmount;
    setPoolTokenAmount(amount);
  }

  function onPoolTokenAmountChange(value) {
    setPoolTokenAmount(value);

    // Hide MAX button if needed.
    if (
      Number(availablePoolTokenAmount) === 0 ||
      availablePoolTokenAmount === value
    ) {
      setShowMaxButton(false);
    } else {
      setShowMaxButton(true);
    }

    if (isNaN(Number(availablePoolTokenAmount)) === false) {
      let percentage = (
        (Number(value) / Number(availablePoolTokenAmount)) *
        100
      ).toFixed(0);
      setPercentage(Number(percentage));
    }
  }

  function getRemoveButton(dexAccount) {
    if (dexAccount && dexAccount.account && dexAccount.account.state) {
      if (dexAccount.account.state === LOGGED_IN) {
        if (poolTokenAmount && poolTokenAmount > 0) {
          if (poolToken) {
            const poolTokenMinAmount = config.fromWEI(
              poolToken.symbol,
              poolToken.minOrderAmount,
              tokens
            );
            if (Number(poolTokenAmount) < Number(poolTokenMinAmount)) {
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
                    {dropTrailingZeroes(poolTokenMinAmount)} {poolToken.symbol}
                  </div>
                </div>
              );
            }
          }

          if (Number(poolTokenAmount) > Number(availablePoolTokenAmount)) {
            return (
              <ActionButton
                disabled={true}
                disabledbuttonbackground={theme.red}
                disabledcolor={theme.textSelection}
              >
                <I s="remove_liquidity_amount_too_large" />
              </ActionButton>
            );
          }

          return (
            <ActionButton
              onClick={() => pressedExitLiquidity()}
              disabled={
                !availablePoolTokenAmount ||
                !poolTokenAmount ||
                fm.toBig(availablePoolTokenAmount).lt(poolTokenAmount)
              }
            >
              <I s="Remove liquidity button" />
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
      <ActionButton onClick={() => pressedExitLiquidity()} disabled={true}>
        <I s="Remove liquidity button" />
      </ActionButton>
    );
  }
  let removeButton = getRemoveButton(dexAccount);

  let inputPoolTokenAmountComponent;
  let poolTokenComponent;

  let shareOfPool = '-';
  let poolAndShareComponent;
  let buttomComponent;

  let receivedTokenEstimatedComponent;

  let _token0Amount;
  let _token1Amount;

  if (poolToken) {
    inputPoolTokenAmountComponent = (
      <NumericInput
        decimals={poolToken.precision}
        fontSize={'1.2rem'}
        value={poolTokenAmount}
        onChange={onPoolTokenAmountChange}
        disabled={isFormDisabled}
      />
    );
    poolTokenComponent = (
      <SwapTokenButton
        symbol={`${token0.symbol}-${token1.symbol}`}
        iconUrl={getAssetIconUrl(poolToken)}
        showMax={showMaxButton}
        onMaxClick={() => {
          onPoolTokenAmountChange(availablePoolTokenAmount);
        }}
      />
    );

    if (isNaN(Number(poolTokenAmount)) === false) {
      shareOfPool = Number(poolTokenAmount) / Number(snapshotPoolTokenAmount);
      if (Number(poolTokenAmount) === 0) {
        shareOfPool = '0%';
      } else if (shareOfPool > 1) {
        shareOfPool = (
          <span
            style={{
              color: theme.red,
            }}
          >
            {'> 100%'}
          </span>
        );
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
    inputPoolTokenAmountComponent = (
      <NumericInput
        decimals={6}
        value={poolTokenAmount}
        onChange={onPoolTokenAmountChange}
      />
    );
    poolTokenComponent = <SwapTokenButton />;
  }

  if (poolToken && token0 && token1 && poolTokenAmount) {
    const amountInBN = roundToFloat24(
      new BN(config.toWEI(poolToken.symbol, poolTokenAmount, tokens))
    ).toString();
    const exitMinAmounts =
      snapshot && slippageTolerance
        ? snapshot.tokenAmounts.map((amount) => {
            return roundToFloat24(
              new BN(
                fm.toFixed(
                  fm
                    .toBig(amount)
                    .times(amountInBN)
                    .div(snapshot.PoolTokenAmount)
                    .times(1 - Number(slippageTolerance)),
                  0,
                  false
                )
              )
            ).toString();
          })
        : ['10', '10'];

    _token0Amount = config.fromWEI(token0.symbol, exitMinAmounts[0], tokens);
    _token1Amount = config.fromWEI(token1.symbol, exitMinAmounts[1], tokens);
  }

  receivedTokenEstimatedComponent = (
    <Section
      style={{
        marginTop: '0px',
        marginBottom: '0px',
        padding: '10px 18px 6px',
        border: `1px solid ${theme.inputBorderColor}`,
        borderRadius: '12px',
      }}
    >
      <Section
        style={{
          marginTop: '6px',
          marginBottom: '6px',
        }}
      >
        <SwapLabelValue
          labelLeft={
            <div>
              <I s="Minimum Received" /> {token0 ? token0.symbol : ''}
            </div>
          }
          labelRight={
            <div
              style={{
                color: theme.textWhite,
              }}
            >
              {_token0Amount ? fm.numberWithCommas(_token0Amount) : '-'}
            </div>
          }
          leftColSpan={13}
          rightColSpan={11}
        />
      </Section>

      <Section
        style={{
          marginTop: '6px',
          marginBottom: '6px',
        }}
      >
        <SwapLabelValue
          labelLeft={
            <div>
              <I s="Minimum Received" /> {token1 ? token1.symbol : ''}
            </div>
          }
          labelRight={
            <div
              style={{
                color: theme.textWhite,
              }}
            >
              {_token1Amount ? _token1Amount : '-'}
            </div>
          }
          leftColSpan={13}
          rightColSpan={11}
        />
      </Section>
    </Section>
  );

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
          <SwapPoolRemoveSlider
            percentage={percentage}
            setPercentage={setPercentage}
            percentageOnChange={percentageOnChange}
            formTypeOnChange={formTypeOnChange}
            disabled={isFormDisabled}
          />
          <InputSection
            style={{
              marginTop: '18px',
              padding: '16px 18px 6px',
              display: formType === 'details' ? 'inherit' : 'none',
            }}
          >
            <Section>
              <SwapLabelValue
                labelLeft={<I s="Swap Input" />}
                labelRight={
                  <SwapBalanceLabel
                    text={<I s="Swap Balance" />}
                    availableAmount={availablePoolTokenAmount}
                    token={poolToken}
                  />
                }
              />
            </Section>

            <Section>
              <SwapSection
                leftComponent={inputPoolTokenAmountComponent}
                rightComponent={poolTokenComponent}
                leftColSpan={showMaxButton ? 10 : 14}
                rightColSpan={showMaxButton ? 14 : 10}
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
                cursor: 'default',
              }}
              icon={
                <FontAwesomeIcon
                  style={{
                    color: theme.textWhite,
                  }}
                  icon={faArrowDown}
                />
              }
            />
          </Section>

          {receivedTokenEstimatedComponent}
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
              {removeButton}
            </Spin>
          </Section>
        </Spin>
      </FormDiv>
      {buttomComponent}
    </div>
  );
};

export default SwapPoolRemoveForm;
