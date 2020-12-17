import { history } from 'redux/configureStore';
import { showSwapSelectTokenModal } from 'redux/actions/ModalManager';
import { useDispatch, useSelector } from 'react-redux';

import I from 'components/I';
import React from 'react';
import styled from 'styled-components';

import { List } from 'antd';
import { MyModal, Section, TextPopupTitle } from 'modals/styles/Styles';
import { setSwapPair } from 'redux/actions/swap/CurrentSwapForm';

import { getAssetIconUrl } from 'pages/swap/components/utils';

const ListItem = styled(List.Item)`
  color: ${(props) => props.theme.textBright};
  border-top: none !important;
  margin-top: 4px !important;
  margin-bottom: 4px !important;
  height: 45px !important;
  cursor: pointer;
  transition: 0.75s !important;
  &:hover {
    background: ${(props) => props.theme.background}!important;
  }
`;

const TitleListItem = styled(ListItem)`
  cursor: default;
  &:hover {
    background: none !important;
  }
`;

const AssetIcon = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: 18px;
  background-position: center;
  background-origin: content-box;
  margin-left: 8px;
  margin-right: 8px;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4));
`;

const MyModalStyled = styled(MyModal)`
  .ant-modal-body {
    padding: 0px;
  }

  .ant-list-items {
    padding-inline-start: 0px;
  }

  .ant-list-bordered .ant-list-item {
    padding-right: 20px;
    padding-left: 12px;
  }
`;

const SwapSelectTokenModal = () => {
  const isVislble = useSelector(
    (state) => state.modalManager.isSwapSelectTokenModalVisible
  );
  const swapToken = useSelector((state) => state.modalManager.swapToken);
  const isSwapToken0 = useSelector((state) => state.modalManager.isSwapToken0);

  const swapForm = useSelector((state) => state.swapForm);
  const token0 = useSelector((state) => state.swapForm.token0);
  const token1 = useSelector((state) => state.swapForm.token1);

  const balances = useSelector((state) => state.balances.balances);
  const tokens = useSelector((state) => state.exchange.tokens);
  const dispatch = useDispatch();

  function onClose() {
    dispatch(showSwapSelectTokenModal(false));
  }

  function clickedTokenItem(tokenItem) {
    console.log('tokenItem', tokenItem);
    dispatch(showSwapSelectTokenModal(false));
    if (isSwapToken0) {
      if (token0 === tokenItem.token.symbol) {
        history.push('/swap');
      } else {
        dispatch(setSwapPair(tokenItem.token.symbol, token1));
        history.push(`/swap/${tokenItem.token.symbol}-${token1}`);
      }
    } else {
      dispatch(setSwapPair(token0, tokenItem.token.symbol));
      history.push(`/swap/${token0}-${tokenItem.token.symbol}`);
    }
  }

  let tokenList = [];
  let tokenSymbols = ['ETH', 'LRC', 'USDT'];
  console.log('tokens', tokens);
  for (let i = 0; i < tokenSymbols.length; i = i + 1) {
    const tokenSymbol = tokenSymbols[i];
    const holdBalance = balances.find((ba) => ba.token.symbol === tokenSymbol);
    const token = tokens.find((ba) => ba.symbol === tokenSymbol);
    console.log('token', token);
    if (token) {
      console.log('tokens', tokens);
      const balance = holdBalance
        ? holdBalance.availableInAssetPanel
        : Number(0).toFixed(token.precision);
      tokenList.push({
        token,
        balance,
      });
    }
  }

  console.log('tokenList', tokenList);

  return (
    <MyModalStyled
      centered
      width={'420px'}
      title={
        <TextPopupTitle>
          <I s="Select a Token" />
        </TextPopupTitle>
      }
      footer={null}
      closable={true}
      maskClosable={true}
      visible={isVislble}
      onCancel={() => onClose()}
    >
      <Section
        style={{
          marginBottom: '0px',
        }}
      >
        <div
          style={{
            height: '45px !important',
            paddingTop: '0px',
            paddingLeft: '20px',
            paddingRight: '20px',
            marginBottom: '0px',
          }}
        >
          <TitleListItem>
            <span>
              <I s="Token Name" />
            </span>
            <span
              style={{
                width: '60%',
                textAlign: 'right',
                fontSize: '1rem',
              }}
            >
              <I s="Swap Balance" />
            </span>
          </TitleListItem>
        </div>
      </Section>
      <Section
        style={{
          paddingBottom: '4px',
        }}
      >
        <List
          bordered
          dataSource={tokenList}
          renderItem={(tokenItem) => (
            <div
              onClick={() => {
                clickedTokenItem(tokenItem);
              }}
            >
              <ListItem>
                <AssetIcon
                  style={{
                    backgroundImage: getAssetIconUrl(tokenItem.token.symbol),
                  }}
                />
                <span
                  style={{
                    width: '40%',
                    fontSize: '1rem',
                  }}
                >
                  {tokenItem.token.symbol}
                </span>
                <span
                  style={{
                    width: '60%',
                    textAlign: 'right',
                    fontSize: '1rem',
                  }}
                >
                  {tokenItem.balance}
                </span>
              </ListItem>
            </div>
          )}
        />
      </Section>
    </MyModalStyled>
  );
};

export default SwapSelectTokenModal;
