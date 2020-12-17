import { getAssetIconUrl } from 'pages/swap/components/utils';

import React from 'react';

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

const SwapPoolTokenLabel = ({ text, token0, token1, cursor = 'default' }) => {
  return (
    <div
      style={{
        cursor: cursor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '40px',
      }}
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
          <span>{text}</span>
        </ButtonDiv>
      </div>
    </div>
  );
};

export default SwapPoolTokenLabel;
