import { Alert, Layout } from 'antd';

import { ThemeContext } from 'styled-components';
import { history } from 'redux/configureStore';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from 'AppLayout';
import I from 'components/I';
import React, { useContext, useEffect } from 'react';

import { BaseContent, Section } from 'pages/swap/components/utils';
import { closeRickAlert } from 'redux/actions/ModalManager';
import { fetchAmmMarkets } from 'redux/actions/swap/AmmMarkets';
import SwapForm from 'pages/swap/components/forms/SwapForm';

const { Content } = Layout;

const SwapPage = () => {
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
            <SwapForm />
          </BaseContent>
          <BaseContent>
            <Section
              style={{
                width: '420px',
                paddingTop: '0px',
                marginBottom: '18px',
                paddingLeft: '32px',
                paddingRight: '32px',
                color: theme.textDim,
              }}
            >
              <I s="SwapAddLiquidityInstruction_1" />
              {'0.15%'}
              <I s="SwapAddLiquidityInstruction_2" />
              <div
                style={{
                  color: theme.primary,
                  paddingLeft: '0px',
                  display: 'inline',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  history.push('/pool');
                }}
              >
                <I s="Go to add liquidity" />
              </div>
            </Section>
          </BaseContent>
        </Content>
      </Layout>
    </div>
  );
};

export default SwapPage;
