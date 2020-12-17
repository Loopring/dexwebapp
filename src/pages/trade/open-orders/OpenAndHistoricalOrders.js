import { ThemeContext } from 'styled-components';
import { useSelector } from 'react-redux';
import React, { useContext } from 'react';

import AppLayout from 'AppLayout';
import HistoricalOrders from './HistoricalOrders';
import OpenOrders from './OpenOrders';
import TabHeader from './components/TabHeader';

const OpenAndHistoricalOrders = () => {
  const theme = useContext(ThemeContext);
  const tabs = useSelector((state) => state.tabs);

  return (
    <div
      style={{
        paddingLeft: '0px',
        paddingTop: '0px',
        marginTop: '0px',
        borderWidth: '0px',
        height: AppLayout.tradeOrderAndTradeHeight,
        background: theme.foreground,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '44px',
          backgroundColor: theme.background,
        }}
      >
        <TabHeader />
      </div>
      <div
        style={{
          display: tabs.type2 === 'open-orders' ? 'block' : 'none',
        }}
      >
        <OpenOrders />
      </div>
      <div
        style={{
          display: tabs.type2 === 'history-orders' ? 'block' : 'none',
        }}
      >
        <HistoricalOrders />
      </div>
    </div>
  );
};

export default OpenAndHistoricalOrders;
