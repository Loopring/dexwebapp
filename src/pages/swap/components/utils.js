import * as fm from 'lightcone/common/formatter';
import { Button } from 'antd';
import I from 'components/I';
import React from 'react';
import config from 'lightcone/config';
import styled from 'styled-components';

export const BaseContent = styled.div`
  margin: auto;
  display: flex;
  justify-content: center;
`;

export const FormDiv = styled.div`
  width: 420px;
  background: ${(props) => props.theme.foreground};
  margin: 24px 12px 12px;
  padding: 24px;
  border-radius: 24px;
  filter: ${(props) => props.theme.formDivFilter};

  .ant-spin-blur {
    opacity: 0.1 !important;
    transition: none !important;

    button {
      color: #00000000 !important;
    }
  }

  @media only screen and (max-width: 770px) {
    width: 90vw;
  }
`;

export const BottomFormDiv = styled.div`
  width: 420px;
  background: ${(props) => props.theme.foreground2};
  margin: 12px 12px 24px;
  padding: 24px;
  border-radius: 12px;
  filter: ${(props) => props.theme.formDivFilter};

  @media only screen and (max-width: 770px) {
    width: 90vw;
  }
`;

export const PoolFormDiv = styled.div`
  width: 420px;
  background: ${(props) => props.theme.foreground};
  margin: 24px 12px 12px;
  padding: 24px;
  border-radius: 24px;
  filter: ${(props) => props.theme.formDivFilter};

  @media only screen and (max-width: 770px) {
    width: 90vw;
  }
`;

export const Section = styled.div`
  width: 100%;
  margin-bottom: 0px;
  color: ${(props) => props.theme.textWhite};
  font-weight: 400;
  font-size: 0.9rem;
`;

export const InputSection = styled.div`
  border: 1px solid ${(props) => props.theme.inputBorderColor};
  border-radius: 12px;
  padding: 12px 18px 6px;
`;

export const PoolSection = styled.div`
  border: 1px solid ${(props) => props.theme.inputBorderColor};
  border-radius: 12px;
  padding: 10px 18px;
`;

export const TitleLabel = styled.div`
  color: ${(props) => props.theme.textWhite};
  font-size: 1.2rem;
`;

export const SwitchButton = styled(Button)`
  background-color: ${(props) => props.theme.foreground} !important;
  border: none !important;
  &[disabled],
  &:hover {
    border: none;
    background-color: ${(props) => props.theme.foreground} !important;
    color: ${(props) => props.theme.primary} !important;
  }
  &[disabled] {
    color: ${(props) => props.theme.foreground} s !important;
  }
`;

export const AssetIcon = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: 20px;
  background-position: center;
  background-origin: content-box;
`;

export const ActivePoolSectionStyled = styled.div`
  border: 1px solid ${(props) => props.theme.inputBorderColor};
  border-radius: 12px;
  margin-top: 12px;
  margin-bottom: 4px;

  // cursor: pointer;
  &:hover {
    // background: ${(props) => props.theme.background}!important;
  }
`;

export function getAssetIconUrl(token) {
  const defaultIcon = `url("/assets/images/default_logo.png")`;
  if (token) {
    var path;
    if (token.symbol === 'ETH') {
      path = 'info';
    } else if (token.symbol === 'LRC') {
      return 'url(/assets/images/LRC.png)';
    } else if (token.symbol.toUpperCase() === 'TON') {
      // Use default icon for TON
      return defaultIcon;
    } else if (token.symbol.toUpperCase() === 'DEFIL') {
      return 'url(/assets/images/DeFi+L.png)';
    } else if (token.symbol.toUpperCase() === 'DEFIS') {
      return 'url(/assets/images/DeFi++S.png)';
    } else if (token.symbol.toUpperCase() === 'DOUGH') {
      return 'url(/assets/images/DOUGH2v.png)';
    } else if (token.address === '0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44') {
      path = 'assets/' + token.address;
      return 'url(/assets/images/ethereum/' + path + '/logo1.png)';
    } else {
      path = 'assets/' + token.address;
    }
    return 'url(/assets/images/ethereum/' + path + '/logo.png)';
  }
  return defaultIcon;
}

export function applyOrderFee(value, token, tokens, feeBip) {
  const tokenConfig = config.getTokenBySymbol(token, tokens);
  const feeFactor = fm.toBig(10000 - feeBip);
  const amount = fm.toBig(value).times('1e' + tokenConfig.decimals);
  const appliedAmount = amount.times(feeFactor).dividedBy(10000);
  return appliedAmount;
}

export function applySlippageTolerance(
  value,
  token,
  tokens,
  slippageTolerance
) {
  const tokenConfig = config.getTokenBySymbol(token, tokens);
  const feeFactor = fm.toBig(100000000 * (1 - slippageTolerance));
  const amount = fm.toBig(value).times('1e' + tokenConfig.decimals);
  const outInWei = amount.times(feeFactor).dividedBy(100000000);
  return config.fromWEI(token, outInWei, tokens);
}

export function getAmountOutWithSnapshot(
  value,
  token1,
  ammMarket,
  snapshot,
  tokens
) {
  const token1Config = config.getTokenBySymbol(token1, tokens);
  let token1Amount =
    snapshot.tokenIds[0] === token1Config.tokenId
      ? snapshot.tokenAmounts[0]
      : snapshot.tokenAmounts[1];
  let token2Amount =
    snapshot.tokenIds[0] === token1Config.tokenId
      ? snapshot.tokenAmounts[1]
      : snapshot.tokenAmounts[0];

  // https://github.com/Uniswap/uniswap-v2-periphery/blob/master/contracts/libraries/UniswapV2Library.sol#L41
  /*
  const _amount2InWei = fm
    .toBig(value * 0.997)
    .times('1e' + token1Config.decimals)
    .times(token2Amount)
    .dividedBy(token1Amount);
  */
  const amountIn = fm.toBig(value).times('1e' + token1Config.decimals);
  const feeBips = ammMarket.feeBips;
  const reserveIn = fm.toBig(token1Amount);
  const reserveOut = fm.toBig(token2Amount);
  const _amount2InWei = getAmountOut(amountIn, feeBips, reserveIn, reserveOut);

  return _amount2InWei;
}

function getAmountOut(amountIn, feeBips, reserveIn, reserveOut) {
  const feeBipsFactor = fm.toBig(1000 - feeBips / 10);
  const amountInWithFee = amountIn.times(feeBipsFactor);
  const numerator = amountInWithFee.times(reserveOut);
  const denominator = reserveIn.times(1000).plus(amountInWithFee);
  const amountOut = numerator.dividedBy(denominator);
  return amountOut;
}

export function getAmountOutWithSnapshot_reserve(
  value,
  token2,
  ammMarket,
  snapshot,
  tokens
) {
  const token2Config = config.getTokenBySymbol(token2, tokens);
  let token1Amount =
    snapshot.tokenIds[1] === token2Config.tokenId
      ? snapshot.tokenAmounts[0]
      : snapshot.tokenAmounts[1];
  let token2Amount =
    snapshot.tokenIds[1] === token2Config.tokenId
      ? snapshot.tokenAmounts[1]
      : snapshot.tokenAmounts[0];

  const amountOut = fm.toBig(value).times('1e' + token2Config.decimals);
  const feeBips = ammMarket.feeBips;
  const reserveIn = fm.toBig(token1Amount);
  const reserveOut = fm.toBig(token2Amount);

  const _amount1InWei = getAmountOut_reserve(
    amountOut,
    feeBips,
    reserveIn,
    reserveOut
  );
  return _amount1InWei;
}

function getAmountOut_reserve(amountOut, feeBips, reserveIn, reserveOut) {
  const numerator = amountOut.times(reserveIn).times(1000);
  const feeBipsFactor = fm.toBig(1000 - feeBips / 10);

  // If amountOut is larger than reserveOut?
  // It's handled before getAmountOut_reserve
  const reserveOutSubAmountOut = reserveOut.minus(amountOut);

  const denominator = feeBipsFactor.times(reserveOutSubAmountOut);
  const amountIn = numerator.dividedBy(denominator);
  return amountIn;
}

// 暂时没有 getAmountIn
function getAmountInWithSnapshot(value, token2, ammMarket, snapshot, tokens) {
  const token2Config = config.getTokenBySymbol(token2, tokens);
  let token1Amount =
    snapshot.tokenIds[1] === token2Config.tokenId
      ? snapshot.tokenAmounts[0]
      : snapshot.tokenAmounts[1];
  let token2Amount =
    snapshot.tokenIds[1] === token2Config.tokenId
      ? snapshot.tokenAmounts[1]
      : snapshot.tokenAmounts[0];

  /*
  const _amount1InWei = fm
    .toBig(value)
    .times('1e' + token2Config.decimals)
    .times(token1Amount)
    .dividedBy(token2Amount);
  */

  const amountOut = fm.toBig(value).times('1e' + token2Config.decimals);
  const feeBips = ammMarket.feeBips;
  const reserveIn = fm.toBig(token1Amount);
  const reserveOut = fm.toBig(token2Amount);

  const _amount1InWei = getAmountIn(amountOut, feeBips, reserveIn, reserveOut);
  return _amount1InWei;
}

function getAmountIn(amountOut, feeBips, reserveIn, reserveOut) {
  const numerator = reserveIn.times(amountOut).times(1000);
  const denominator = reserveOut.minus(amountOut).times(1000 - feeBips / 10);
  const amountIn = numerator.dividedBy(denominator).plus(1);
  return amountIn;
}

// Only used in UI
export function getAddLiquidityToken1(value, token1, token2, snapshot, tokens) {
  const token1Config = config.getTokenBySymbol(token1, tokens);
  let token1AmountInWei =
    snapshot.tokenIds[0] === token1Config.tokenId
      ? snapshot.tokenAmounts[0]
      : snapshot.tokenAmounts[1];
  const _token1Amount = config.fromWEI(token1, token1AmountInWei, tokens);

  let token2AmountInWei =
    snapshot.tokenIds[0] === token1Config.tokenId
      ? snapshot.tokenAmounts[1]
      : snapshot.tokenAmounts[0];
  const _token2Amount = config.fromWEI(token2, token2AmountInWei, tokens);

  const _amount =
    (Number(_token1Amount) * Number(value)) / Number(_token2Amount);
  return _amount.toFixed(token1Config.precision);
}

// Only used in UI
export function getAddLiquidityToken2(value, token1, token2, snapshot, tokens) {
  const token2Config = config.getTokenBySymbol(token2, tokens);
  let token1AmountInWei =
    snapshot.tokenIds[1] === token2Config.tokenId
      ? snapshot.tokenAmounts[0]
      : snapshot.tokenAmounts[1];
  const _token1Amount = config.fromWEI(token1, token1AmountInWei, tokens);

  let token2AmountInWei =
    snapshot.tokenIds[1] === token2Config.tokenId
      ? snapshot.tokenAmounts[1]
      : snapshot.tokenAmounts[0];
  const _token2Amount = config.fromWEI(token2, token2AmountInWei, tokens);

  const _amount =
    (Number(_token2Amount) * Number(value)) / Number(_token1Amount);
  return _amount.toFixed(token2Config.precision);
}

export function getLpTokenPrice(ammMarket, snapshot, tokens, prices) {
  try {
    const token0Id = ammMarket.inPoolTokens[0];
    const tokenConf0 = config.getTokenByTokenId(token0Id, tokens);
    const _token0Amount = config.fromWEI(
      tokenConf0.symbol,
      snapshot.tokenAmounts[0],
      tokens
    );

    const filteredPrice0 = prices.find(
      (price) => price.symbol === tokenConf0.symbol
    );

    const token1Id = ammMarket.inPoolTokens[1];
    const tokenConf1 = config.getTokenByTokenId(token1Id, tokens);
    const _token1Amount = config.fromWEI(
      tokenConf1.symbol,
      snapshot.tokenAmounts[1],
      tokens
    );

    const filteredPrice1 = prices.find(
      (price) => price.symbol === tokenConf1.symbol
    );

    const poolTokenId = ammMarket.poolTokenId;
    const poolTokenConf1 = config.getTokenByTokenId(poolTokenId, tokens);
    const poolTokenAmount = config.fromWEI(
      poolTokenConf1.symbol,
      snapshot.PoolTokenAmount,
      tokens
    );

    if (filteredPrice0 && filteredPrice1) {
      const lpTokenPrice =
        (_token0Amount * parseFloat(filteredPrice0.price) +
          _token1Amount * parseFloat(filteredPrice1.price)) /
        poolTokenAmount;
      return lpTokenPrice;
    }
  } catch (error) {}
  return 0;
}

export function getAvailableAmountWithAddress(address, tokens, balances) {
  const token = config.getTokenByAddress(address, tokens);
  const holdBalance = balances.find((ba) => ba.tokenId === token.tokenId);
  return holdBalance;
}

export function getAvailableAmount(token, balances) {
  const holdBalance = balances.find((ba) => ba.tokenId === token.tokenId);
  return holdBalance
    ? holdBalance.availableInAssetPanel
    : Number(0).toFixed(token.precision);
}

export function getCurrentPrice(a, b) {
  let currentPrice = Number(a) / Number(b);
  let currentPriceString = '';
  if (currentPrice) {
    let decimals = 8;
    if (Number(currentPrice) > 10) {
      decimals = 2;
    }
    currentPriceString = currentPrice.toFixed(decimals);
  } else {
    currentPriceString = '-';
  }
  return currentPriceString;
}

export function getCurrentPriceBottomLabel(aName, bName) {
  return (
    <div>
      {`${bName}`}
      <I s="Swap Per" />
      {`${aName}`}
    </div>
  );
}
