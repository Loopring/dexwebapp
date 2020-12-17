import { PoolFormDiv, Section, TitleLabel } from 'pages/swap/components/utils';
import { Spin } from 'antd';
import { ThemeContext } from 'styled-components';
import { useSelector } from 'react-redux';
import ActivePoolSection from './ActivePoolSection';
import AssetSelect, {
  AssetSelectMenuItemStyled,
} from 'modals/components/AssetSelect';
import I from 'components/I';
import React, { useContext, useEffect, useState } from 'react';
import SwapPoolTokenButton from './SwapPoolTokenButton';
import SwapSection from 'pages/swap/components/SwapSection';
import SwapYourPool from './SwapYourPool';
import config from 'lightcone/config';

const SwapPoolMain = () => {
  const theme = useContext(ThemeContext);
  const ammMarkets = useSelector((state) => state.ammMarkets.ammMarkets);
  const balances = useSelector((state) => state.balances.balances);
  const exchange = useSelector((state) => state.exchange);
  const [ammMarket, setAmmMarket] = useState(null);

  const myActiveAmmMarkets = useSelector(
    (state) => state.ammMarkets.myActiveAmmMarkets
  );

  useEffect(() => {
    if (!!ammMarkets && ammMarkets.length !== 0 && !ammMarket) {
      setAmmMarket(ammMarkets[0]);
    }
  }, [ammMarkets]);

  function getOptionText(tokenIds, tokens) {
    const text = tokenIds
      .map((tokenId) => config.getTokenByTokenId(tokenId, tokens))
      .reduce((a, b) => a.symbol + '-' + b.symbol);
    return text;
  }

  let bottomSection;
  let marketOptions = [];
  if (
    ammMarkets === null ||
    ammMarkets.length === 0 ||
    !exchange.isInitialized
  ) {
    bottomSection = <div />;
  } else {
    marketOptions = ammMarkets
      .filter((ammMarket) => ammMarket.enabled)
      .map((ammMarket, i) => {
        const menuItem = (
          <AssetSelectMenuItemStyled
            key={i}
            onMouseDown={() => {
              setAmmMarket(ammMarket);
            }}
            value={ammMarket}
            searchValue={getOptionText(ammMarket.inPoolTokens, exchange.tokens)}
          >
            <SwapPoolTokenButton ammMarket={ammMarket} cursor="pointer" />
          </AssetSelectMenuItemStyled>
        );

        return menuItem;
      });
    bottomSection = (
      <div>
        {' '}
        {!!ammMarket && exchange.isInitialized && (
          <ActivePoolSection
            ammMarket={ammMarket}
            isMyActivePool={false}
            key={getOptionText(ammMarket.inPoolTokens, exchange.tokens)}
          />
        )}
      </div>
    );
  }

  let topSection;
  let myAmmMarkets = [];
  if (ammMarkets && balances) {
    for (let i = 0; i < ammMarkets.length; i++) {
      const ammMarket = ammMarkets[i];
      const ammMarketBalance = balances.find(
        (balance) => balance.tokenId === ammMarket.poolTokenId
      );
      if (ammMarketBalance) {
        myAmmMarkets.push(ammMarket);
      }
    }
  }

  function onClickSwapYourPool(ammMarket) {
    setAmmMarket(ammMarket);
  }

  if (myAmmMarkets.length > 0) {
    topSection = (
      <SwapYourPool
        myAmmMarkets={myAmmMarkets}
        onClickSwapYourPool={onClickSwapYourPool}
      />
    );
  }

  return (
    <div>
      <PoolFormDiv
        style={{
          marginTop: '12px',
        }}
      >
        <Spin spinning={false}>
          <Section
            style={{
              // marginTop: '26px',
              marginTop: '0px',
              marginBottom: '4px',
              paddingLeft: '4px',
              paddingRight: '4px',
            }}
            s
          >
            <SwapSection
              leftComponent={
                <TitleLabel>
                  <I s="Active pools" />
                </TitleLabel>
              }
            />
          </Section>
          <Section
            style={{
              paddingTop: '0px',
              marginBottom: '18px',
              paddingLeft: '4px',
              paddingRight: '4px',
              color: theme.textDim,
            }}
          >
            <I s="SwapAddLiquidityInstruction_1" />
            {'0.15%'}
            <I s="SwapAddLiquidityInstruction_2" />
          </Section>
          <Section
            style={{
              marginBottom: '8px',
            }}
          >
            <AssetSelect
              style={{
                filter: theme.formDivFilter,
              }}
              noDataText={'NoAmmSwap'}
              options={marketOptions}
              value={
                <SwapPoolTokenButton ammMarket={ammMarket} cursor="pointer" />
              }
              paddingLeft="18px"
              paddingRight="18px"
              borderRadius="12px"
              size={'large'}
            />
          </Section>
          {bottomSection}
        </Spin>
      </PoolFormDiv>
      {topSection}
    </div>
  );
};

export default SwapPoolMain;
