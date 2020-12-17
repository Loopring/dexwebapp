import I from 'components/I';
import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

const ButtonDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 6px 0px 6px 6px;

  &:hover {
    // cursor: pointer;
    border-radius: 4px;
    // background: ${(props) => props.theme.sidePanelBackground} !important;
  }

  span {
    font-size: 1.2rem;
    margin-right: 0px;
  }
`;

const MaxButtonDiv = styled.div`
  border-radius: 6px;
  text-align: center;
  padding-left: 6px;
  padding-right: 6px;
  font-size: 1rem;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4));

  &:hover {
    cursor: pointer;
    border-radius: 6px;
    // background: ${(props) => props.theme.sidePanelBackground} !important;
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
  margin-left: 8px;
  margin-right: 8px;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4));
`;

const SwapTokenButton = ({ symbol, iconUrl, showMax, onMaxClick }) => {
  const theme = useContext(ThemeContext);

  return (
    <div
      style={{
        cursor: 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '40px',
      }}
    >
      <div
        style={{
          marginLeft: 'auto',
        }}
      >
        <ButtonDiv>
          {showMax ? (
            <MaxButtonDiv
              style={{
                color: `${theme.textBigButton}`,
                background: `${theme.primary}`,
              }}
              onClick={onMaxClick}
            >
              <I s="MAX" />
            </MaxButtonDiv>
          ) : (
            <div />
          )}
          <AssetIcon
            style={{
              backgroundImage: iconUrl,
            }}
          />
          <span
            style={{
              userSelect: 'none',
            }}
          >
            {symbol}
          </span>
        </ButtonDiv>
      </div>
    </div>
  );
};

export default SwapTokenButton;
