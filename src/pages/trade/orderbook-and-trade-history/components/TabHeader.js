import { connect } from 'react-redux';
import I from 'components/I';
import React from 'react';

import styled, { withTheme } from 'styled-components';

import { Button } from 'antd';
import { updateOrderBookTradeHistoryPanelType } from 'redux/actions/Tabs';

const TabHeaderDiv = styled.div`
  padding-top: 7px;
  padding-bottom: 7px;
  padding-right: 20px;
`;

class TabHeader extends React.Component {
  clickedBuyButton = () => {
    this.props.updateOrderBookTradeHistoryPanelType('orderBook');
  };

  clickedSellButton = () => {
    this.props.updateOrderBookTradeHistoryPanelType('tradeHistory');
  };

  render() {
    const theme = this.props.theme;
    const isBuy = this.props.tabs.type1 === 'orderBook' ? true : false;
    const isSell = this.props.tabs.type1 === 'tradeHistory' ? true : false;

    const buttonStyle = {
      color: theme.textWhite,
      backgroundColor: theme.background,
      borderStyle: 'none',
      height: '30px',
      borderRadius: '0px',
      fontWeight: '600',
      fontSize: '0.9rem',
      padding: '0px 2px',
      margin: '0px 15px 0px 0px',
      borderBottomWidth: '2px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'transparent',
    };

    const buyButtonActiveStyle = {
      ...buttonStyle,
      color: theme.textWhite,
      borderBottomColor: theme.primary,
    };

    const buttonInactiveStyle = {
      ...buttonStyle,
      color: theme.textDim,
    };

    return (
      <TabHeaderDiv>
        <Button
          style={isBuy ? buyButtonActiveStyle : buttonInactiveStyle}
          onClick={this.clickedBuyButton}
        >
          <I s="Order Book" />
        </Button>
        <Button
          style={isSell ? buyButtonActiveStyle : buttonInactiveStyle}
          onClick={this.clickedSellButton}
        >
          <I s="Recent Trades" />
        </Button>
      </TabHeaderDiv>
    );
  }
}

const mapStateToProps = (state) => {
  const { tabs } = state;
  return { tabs };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateOrderBookTradeHistoryPanelType: (type) =>
      dispatch(updateOrderBookTradeHistoryPanelType(type)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(TabHeader)
);
