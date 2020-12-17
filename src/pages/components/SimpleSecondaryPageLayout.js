import { Layout } from 'antd';
import { ThemeContext } from 'styled-components';

import React, { useContext } from 'react';

import AppLayout from 'AppLayout';

import SecondaryNavBar from 'components/SecondaryNavBar';
import SwapPage from 'pages/swap/SwapPage';
import TableLoadingSpin from 'components/TableLoadingSpin';

const SimpleSecondaryPageLayout = ({
  navbarConfig,
  children,
  pageId,
  loading,
}) => {
  const theme = useContext(ThemeContext);
  return (
    <Layout
      style={{
        height: AppLayout.simpleSecondaryPageHeight,
        backgroundColor: theme.background,
      }}
    >
      <Layout.Content
        width="100%"
        style={{
          padding: '0px',
          backgroundColor: theme.background,
        }}
      >
        <div
          className="desktop-layout"
          style={{
            padding: '0px',
            backgroundColor: theme.background,
          }}
        >
          <SecondaryNavBar selected={pageId} subPages={navbarConfig} />
          <div
            style={{
              paddingLeft: '60px',
              paddingRight: '60px',
              paddingTop: '24px',
            }}
          >
            <TableLoadingSpin loading={loading}>{children}</TableLoadingSpin>
          </div>
        </div>
        <div className="mobile-layout">
          <SwapPage />
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default SimpleSecondaryPageLayout;
