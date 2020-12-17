import { getAssetIconUrl } from 'pages/swap/components/utils';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import config from 'lightcone/config';
import styled from 'styled-components';

const ButtonDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 6px 0px 6px 0px;

  &:hover {
    // cursor: pointer;
    border-radius: 4px;
    // background: ${(props) => props.theme.sidePanelBackground} !important;
  }

  span {
    font-size: 1.2rem;
    margin-left: 8px;
    margin-right: 0px;
    color: ${(props) => props.theme.textBright};
  }
`;

const AssetIcon = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: 20px;
  background-position: center;
  background-origin: content-box;
  margin-left: 0px;
  margin-right: 0px;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4));
`;

const SwapPoolTokenButton = ({
  ammMarket,
  onClickSwapYourPool,
  cursor = 'default',
}) => {
  const [token0, setToken0] = useState(null);
  const [token1, setToken1] = useState(null);

  const tokens = useSelector((state) => state.exchange.tokens);
  const exchangeIsInitialized = useSelector(
    (state) => state.exchange.isInitialized
  );

function getOptionText(tokenIds,tokens){
    return tokenIds.map(tokenId => config.getTokenByTokenId(tokenId,tokens)).reduce((a,b) => a.symbol + "-" + b.symbol)
}

  useEffect(() => {
    if (ammMarket && tokens.length > 0 && exchangeIsInitialized) {
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
    }
  }, [ammMarket, tokens, exchangeIsInitialized]);

  return (
    <div
      style={{
        cursor: cursor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '40px',
      }}
      onClick={() => onClickSwapYourPool('hello')}
    >
      <div
        style={{
          marginRight: 'auto',
        }}
      >
        <ButtonDiv>
          <AssetIcon
            style={{
              backgroundImage: token0 ? getAssetIconUrl(token0) : '',
            }}
          />
          <AssetIcon
            style={{
              backgroundImage: token1 ? getAssetIconUrl(token1) : '',
            }}
          />
          <span>{ammMarket && exchangeIsInitialized ? getOptionText(ammMarket.inPoolTokens,tokens) : ''}</span>
        </ButtonDiv>
      </div>
    </div>
  );
};

export default SwapPoolTokenButton;
