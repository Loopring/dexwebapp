import * as fm from 'lightcone/common/formatter';
import { BottomFormDiv, Section } from 'pages/swap/components/utils';
import { ThemeContext } from 'styled-components';
import { ViewAmmTransactionButton } from 'styles/Styles';
import { history } from 'redux/configureStore';
import I from 'components/I';
import React, { useContext } from 'react';
import SwapLabelValue from 'pages/swap/components/SwapLabelValue';
import SwapPoolTokenButton from 'pages/swap/components/SwapPoolTokenButton';

const SwapPoolYourPosition = ({
  ammMarket,
  token0,
  token1,
  yourShare,
  poolToken0Amount,
  poolToken1Amount,
}) => {
  const theme = useContext(ThemeContext);

  let yourShareString = '-';
  if (isNaN(Number(yourShare)) === false) {
    if (Number(yourShare) === 0) {
      yourShareString = '0%';
    } else if (Number(yourShare) > 0.01) {
      yourShareString = `${fm.toFixed(yourShare * 100, 2, true)}%`;
    } else if (Number(yourShare) > 0.0001) {
      yourShareString = `${fm.toFixed(yourShare * 100, 4, true)}%`;
    } else {
      yourShareString = `${fm.toFixed(yourShare * 100, 8, true)}%`;
    }
  }

  return (
    <BottomFormDiv>
      <Section
        style={{
          paddingTop: '0px',
        }}
      >
        <SwapLabelValue
          labelLeft={<I s="Swap your position" />}
          labelRight={''}
          leftColSpan={23}
          rightColSpan={1}
          color={theme.textWhite}
        />
      </Section>

      <Section
        style={{
          marginTop: '6px',
          marginBottom: '6px',
        }}
      >
        <SwapPoolTokenButton ammMarket={ammMarket} cursor="pointer" />
      </Section>

      <Section
        style={{
          marginTop: '6px',
          marginBottom: '6px',
        }}
      >
        <SwapLabelValue
          labelLeft={<I s="Your pool share" />}
          labelRight={
            <div
              style={{
                color: theme.textWhite,
              }}
            >
              {yourShareString}
            </div>
          }
          leftColSpan={12}
          rightColSpan={12}
        />
      </Section>

      <Section
        style={{
          marginTop: '6px',
          marginBottom: '6px',
        }}
      >
        <SwapLabelValue
          labelLeft={token0.symbol}
          labelRight={
            <div
              style={{
                color: theme.textWhite,
              }}
            >
              {poolToken0Amount
                ? fm.numberWithCommas(
                    fm.toFixed(poolToken0Amount, token0.precision, true)
                  )
                : '-'}
            </div>
          }
          leftColSpan={12}
          rightColSpan={12}
        />
      </Section>

      <Section
        style={{
          marginTop: '6px',
          marginBottom: '6px',
        }}
      >
        <SwapLabelValue
          labelLeft={token1.symbol}
          labelRight={
            <div
              style={{
                color: theme.textWhite,
              }}
            >
              {poolToken1Amount
                ? fm.numberWithCommas(
                    fm.toFixed(poolToken1Amount, token1.precision, true)
                  )
                : '-'}
            </div>
          }
          leftColSpan={12}
          rightColSpan={12}
        />
      </Section>

      <Section
        className="desktop-layout"
        style={{
          paddingTop: '0px',
        }}
      >
        <SwapLabelValue
          labelLeft={
            <ViewAmmTransactionButton
              type="link"
              onClick={() => {
                history.push('/account/amm-transactions');
              }}
            >
              <I s="View AMM transaction history" />
            </ViewAmmTransactionButton>
          }
          labelRight={''}
          leftColSpan={23}
          rightColSpan={1}
          color={theme.textWhite}
        />
      </Section>
    </BottomFormDiv>
  );
};

export default SwapPoolYourPosition;
