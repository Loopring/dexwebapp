import { ActivePoolSectionStyled, Section } from 'pages/swap/components/utils';
import { history } from 'redux/configureStore';
import { useDispatch, useSelector } from 'react-redux';
import I from 'components/I';

import * as fm from 'lightcone/common/formatter';
import { Button, Col, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import config from 'lightcone/config';
import styled, { ThemeContext } from 'styled-components';

import {
  LOGGED_IN,
  NOT_REGISTERED,
  REGISTERED,
  UNDEFINED,
  WALLET_UNCONNECTED,
} from 'redux/actions/DexAccount';
import {
  loginModal,
  registerAccountModal,
  showConnectToWalletModal,
} from 'redux/actions/ModalManager';
import { saveLastPoolPage } from 'lightcone/api/localStorgeAPI';
import SwapLabelValue from 'pages/swap/components/SwapLabelValue';
import SwapPoolTokenButton from 'pages/swap/components/SwapPoolTokenButton';

import { ActionButton } from 'styles/Styles';

const RowStyled = styled(Row)`
  padding: 16px 20px 0px 20px;
  margin-left: 0px !important;
  margin-right: 0px !important;
  margin-bottom: 0px;
`;

const ExpaneddSectionRowStyled = styled(Row)`
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 16px;
`;

const MyButton = styled(Button)`
  color: ${(props) => props.theme.textBigButton}!important;
  height: 32px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  background: ${(props) => props.theme.primary}!important;
  margin: auto;
  padding: 0;

  &:hover {
  }

  &:not([disabled]) {
    background: ${(props) =>
      props.buttonbackground
        ? props.buttonbackground
        : props.theme.primary}!important;
  }

  &[disabled],
  &[disabled]:hover {
    background: ${(props) => props.theme.buttonBackground}!important;
    color: ${(props) => props.theme.textDim}!important;
  }
`;

const ActivePoolSection = ({ ammMarket }) => {
  const [poolTokenAmount, setPoolTokenAmount] = useState(null);
  const [yourShare, setYourShare] = useState(null);

  const [token0, setToken0] = useState(null);
  const [amount0, setAmount0] = useState(null);
  const [token1, setToken1] = useState(null);
  const [amount1, setAmount1] = useState(null);

  const balances = useSelector((state) => state.balances.balances);
  const tokens = useSelector((state) => state.exchange.tokens);
  const prices = useSelector((state) => state.legalPrice.prices);
  const dexAccount = useSelector((state) => state.dexAccount);
  const exchange = useSelector((state) => state.exchange);
  const exchangeIsInitialized = useSelector(
    (state) => state.exchange.isInitialized
  );

  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof ammMarket.snapshot === 'undefined') {
      setAmount0(0);
      setAmount1(0);
    }

    if (tokens.length > 0 && exchangeIsInitialized) {
      const poolAddress = ammMarket.address;
      const poolToken = config.getTokenByAddress(poolAddress, tokens);
      const poolTokenBalance = getAvailableAmount(
        poolAddress,
        tokens,
        balances
      );
      if (poolTokenBalance) {
        setPoolTokenAmount(poolTokenBalance.availableInAssetPanel);
        if (ammMarket.snapshot) {
          const yourShare =
            Number(poolTokenBalance.totalAmount) /
            Number(ammMarket.snapshot.PoolTokenAmount);
          setYourShare(yourShare);
        }
      } else {
        setPoolTokenAmount(Number(0).toFixed(poolToken.precision));
      }

      const token0 = config.getTokenByTokenId(
        ammMarket.inPoolTokens[0],
        tokens
      );
      setToken0(token0);

      const token1 = config.getTokenByTokenId(
        ammMarket.inPoolTokens[1],
        tokens
      );
      setToken1(token1);

      if (ammMarket.snapshot) {
        let token0Amount =
          ammMarket.snapshot.tokenIds[0] == token0.tokenId
            ? ammMarket.snapshot.tokenAmounts[0]
            : ammMarket.snapshot.tokenAmounts[1];
        let token1Amount =
          ammMarket.snapshot.tokenIds[0] == token0.tokenId
            ? ammMarket.snapshot.tokenAmounts[1]
            : ammMarket.snapshot.tokenAmounts[0];
        const _amount0 = config.fromWEI(token0.symbol, token0Amount, tokens);
        const _amount1 = config.fromWEI(token1.symbol, token1Amount, tokens);
        setAmount0(_amount0);
        setAmount1(_amount1);

        if (ammMarket.apy) {
          const _tokenFee0 = config.fromWEI(
            token0.symbol,
            ammMarket.apy.tokenFees[0],
            tokens
          );
          const _tokenFee1 = config.fromWEI(
            token1.symbol,
            ammMarket.apy.tokenFees[1],
            tokens
          );
          const tokenPrice0 = prices.find(
            (price) => price.symbol === token0.symbol
          );
          const tokenPrice1 = prices.find(
            (price) => price.symbol === token1.symbol
          );
          if (tokenPrice0 && tokenPrice1) {
            const dpy =
              (Number(_tokenFee0) * Number(tokenPrice0.price) +
                Number(_tokenFee1) * Number(tokenPrice1.price)) /
              (Number(_amount0) * Number(tokenPrice0.price) +
                Number(_amount1) * Number(tokenPrice1.price));
            const apy = dpy * 356;
            // console.log('apy, dpy', tokenPrice0, tokenPrice1, apy, dpy);
          }
        }
      }
    }
  }, [balances, tokens, prices, exchangeIsInitialized, ammMarket]);

  function getAvailableAmount(address, tokens, balances) {
    const token = config.getTokenByAddress(address, tokens);
    const holdBalance = balances.find((ba) => ba.tokenId === token.tokenId);
    return holdBalance;
  }

  function getActionButton(dexAccount) {
    if (dexAccount && dexAccount.account && dexAccount.account.state) {
      if (dexAccount.account.state === REGISTERED) {
        return (
          <ActionButton
            block
            onClick={() => dispatch(loginModal(true))}
            disabled={false}
          >
            <I s="Unlock to add liquidity" />
          </ActionButton>
        );
      } else if (dexAccount.account.state === NOT_REGISTERED) {
        return (
          <ActionButton
            block
            onClick={() => dispatch(registerAccountModal(true))}
            disabled={false}
          >
            <I s="Deposit to Activate Layer-2" />
          </ActionButton>
        );
      } else if (
        dexAccount.account.state === WALLET_UNCONNECTED ||
        dexAccount.account.state === UNDEFINED
      ) {
        return (
          <ActionButton
            block
            onClick={() => dispatch(showConnectToWalletModal(true))}
            disabled={false}
          >
            <I s="Connect Wallet" />
          </ActionButton>
        );
      }
    }
  }

  let actionButton = getActionButton(dexAccount);

  let isButtonDisabled = true;
  if (dexAccount && dexAccount.account && dexAccount.account.state) {
    if (dexAccount.account.state === LOGGED_IN) {
      isButtonDisabled = false;
    }
  }

  let expandedSection;
  expandedSection = actionButton ? (
    <ExpaneddSectionRowStyled>
      <Col span={24} style={{}}>
        {actionButton}
      </Col>
    </ExpaneddSectionRowStyled>
  ) : (
    <ExpaneddSectionRowStyled gutter={16}>
      <Col span={12} style={{}}>
        <MyButton
          block
          disabled={isButtonDisabled}
          onClick={() => {
            history.push(`/pool/add/${ammMarket.address}`);
            saveLastPoolPage(`add/${ammMarket.address}`);
          }}
        >
          <I s="Add liquidity button" />
        </MyButton>
      </Col>
      <Col span={12}>
        <MyButton
          block
          disabled={isButtonDisabled}
          onClick={() => {
            history.push(`/pool/remove/${ammMarket.address}`);
            saveLastPoolPage(`remove/${ammMarket.address}`);
          }}
        >
          <I s="Remove liquidity button" />
        </MyButton>
      </Col>
    </ExpaneddSectionRowStyled>
  );

  let fromToken = <div />;
  let _token0;
  let _token1;
  if (exchange.isInitialized === true) {
    _token0 = config.getTokenByTokenId(
      ammMarket.inPoolTokens[0],
      exchange.tokens
    );

    _token1 = config.getTokenByTokenId(
      ammMarket.inPoolTokens[1],
      exchange.tokens
    );

    fromToken = <SwapPoolTokenButton ammMarket={ammMarket} />;
  }

  return (
    <ActivePoolSectionStyled>
      {/* <RowStyled
        gutter={16}
        style={{
          fontSize: '1rem',
        }}
      >
        <Col
          span={18}
          style={{
            paddingLeft: '0px',
            paddingRight: '0px',
            width: '40px',
          }}
        >
          {fromToken}
        </Col>
        <Col
          span={6}
          style={{
            textAlign: 'right',
          }}
        ></Col>
      </RowStyled> */}
      <Section
        style={{
          marginTop: '16px',
          marginBottom: '10px',
          paddingLeft: '20px',
          paddingRight: '20px',
        }}
      >
        <SwapLabelValue
          labelLeft={<I s="Your total pool tokens" />}
          labelRight={fm.numberWithCommas(poolTokenAmount)}
          leftColSpan={12}
          rightColSpan={12}
          color={theme.textWhite}
        />
      </Section>
      <Section
        style={{
          marginTop: '6px',
          marginBottom: '6px',
          paddingLeft: '20px',
          paddingRight: '20px',
        }}
        s
      >
        <SwapLabelValue
          labelLeft={
            <div>
              <I s="Pooled" />
              {_token0 ? ` ${_token0.symbol}` : ''}
            </div>
          }
          labelRight={
            amount0 !== null
              ? fm.numberWithCommas(Number(amount0).toFixed(6))
              : '-'
          }
          leftColSpan={12}
          rightColSpan={12}
          color={theme.textWhite}
        />
      </Section>
      <Section
        style={{
          marginTop: '6px',
          marginBottom: '6px',
          paddingLeft: '20px',
          paddingRight: '20px',
        }}
        s
      >
        <SwapLabelValue
          labelLeft={
            <div>
              <I s="Pooled" />
              {_token1 ? ` ${_token1.symbol}` : ''}
            </div>
          }
          labelRight={
            amount1 !== null
              ? fm.numberWithCommas(Number(amount1).toFixed(6))
              : '-'
          }
          leftColSpan={12}
          rightColSpan={12}
          color={theme.textWhite}
        />
      </Section>
      <Section
        style={{
          marginTop: '6px',
          marginBottom: '18px',
          paddingLeft: '20px',
          paddingRight: '20px',
        }}
        s
      >
        <SwapLabelValue
          labelLeft={<I s="Your pool share" />}
          labelRight={yourShare ? `${(yourShare * 100).toFixed(2)}%` : '0%'}
          leftColSpan={12}
          rightColSpan={12}
          color={theme.textWhite}
        />
      </Section>
      {expandedSection}
    </ActivePoolSectionStyled>
  );
};

export default ActivePoolSection;
