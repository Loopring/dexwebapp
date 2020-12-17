import { Alert, Layout } from 'antd';

import { ThemeContext } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from 'AppLayout';
import I from 'components/I';
import React, { useContext, useEffect } from 'react';

import { BaseContent } from 'pages/swap/components/utils';
import { closeRickAlert } from 'redux/actions/ModalManager';
import { fetchAmmMarkets } from 'redux/actions/swap/AmmMarkets';
import SwapPoolAddForm from 'pages/swap/components/forms/SwapPoolAddForm';

const { Content } = Layout;

const SwapPoolAddLiquidityPage = () => {
  const theme = useContext(ThemeContext);
  const isRiskAlertVisible = useSelector(
    (state) => state.modalManager.isRiskAlertVisible
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAmmMarkets());
  });

  const handleClose = () => {
    dispatch(closeRickAlert());
  };

  return (
    <div>
      <div
        style={{
          height: AppLayout.borderWidth,
          backgroundColor: theme.background,
        }}
      />
      <Layout
        hasSider={false}
        style={{
          height: AppLayout.simpleSecondaryPageHeight,
        }}
      >
        <Content
          width="100%"
          style={{
            paddingTop: '0px',
            backgroundColor: theme.background,
            borderLeftStyle: 'none',
          }}
        >
          {isRiskAlertVisible ? (
            <Alert
              message={
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://loopring.io/#/legal/risks"
                >
                  <I s="Loopring Exchange v2 is using Loopring protocol 3.6 which is in beta. Use at your own risk. View risk warning." />
                </a>
              }
              type="warning"
              closable
              onClose={handleClose}
            />
          ) : null}
          <BaseContent>
            <SwapPoolAddForm />
          </BaseContent>
        </Content>
      </Layout>
    </div>
  );
};

export default SwapPoolAddLiquidityPage;
