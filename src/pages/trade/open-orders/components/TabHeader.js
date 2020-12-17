import { Button, Checkbox, Popconfirm } from 'antd';

import { cancelAllOrders } from 'lightcone/api/v1/orders';
import { connect } from 'react-redux';
import { history } from 'redux/configureStore';

import I from 'components/I';
import React from 'react';
import styled, { withTheme } from 'styled-components';

import { CancelOrderButton, ViewMoreButton } from 'styles/Styles';
import { LOGGED_IN } from 'redux/actions/DexAccount';
import {
  emptyMyOpenOrders,
  fetchMyOpenOrders,
  updateShowAllOpenOrders,
} from 'redux/actions/MyOrders';
import { notifyError, notifySuccess } from 'redux/actions/Notification';
import { updateMyOrdersAndMyTradesType } from 'redux/actions/Tabs';

const TabRow = styled.div`
  padding-top: 7px;
  padding-bottom: 7px;
  padding-right: 0px;
`;

const CancelAllOrdersButton = styled(CancelOrderButton)`
  margin: 0px;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  padding-left: 4px !important;
  padding-right: 4px !important;
  margin-right: 4px;
  color: ${(props) => props.theme.red}!important;
`;

const CancelAllPopconfirm = styled(Popconfirm)`
  && {
    font-size: 0.85rem;
  }
`;

class TabHeader extends React.Component {
  clickedOpenOrdersButton = () => {
    this.props.updateMyOrdersAndMyTradesType('open-orders');
  };

  clickedOrderHistory = () => {
    this.props.updateMyOrdersAndMyTradesType('history-orders');
  };

  clickedShowAll = (e) => {
    this.props.updateShowAllOpenOrders(e.target.checked);
  };

  clickedCancelAllOrders = () => {
    (async () => {
      try {
        const apiKey = this.props.dexAccount.account.apiKey;

        const signed = window.wallet.submitFlexCancel();
        await cancelAllOrders(
          this.props.dexAccount.account.accountId,
          signed.signature,
          apiKey
        );

        notifySuccess(
          <I s="All of your orders have been cancelled successfully." />,
          this.props.theme
        );

        this.props.emptyMyOpenOrders();
        this.props.fetchMyOpenOrders(
          this.props.dexAccount.account.accountId,
          20,
          0,
          this.props.currentMarket.current,
          this.props.dexAccount.account.apiKey,
          this.props.tokens
        );
      } catch (err) {
        console.log('error', err);
        notifyError(<I s="Failed to cancel your order." />, this.props.theme);
      }
    })();
  };

  render() {
    const theme = this.props.theme;
    const openOrdersShown =
      this.props.tabs.type2 === 'open-orders' ? true : false;
    const historyOrdersShown =
      this.props.tabs.type2 === 'history-orders' ? true : false;

    const { account } = this.props.dexAccount;
    const viewMoreLink = () => {
      if (openOrdersShown) return '/orders/open-orders';
      else if (historyOrdersShown) return '/orders/order-history';
      else return '';
    };

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
      <TabRow>
        <Button
          style={openOrdersShown ? buyButtonActiveStyle : buttonInactiveStyle}
          onClick={this.clickedOpenOrdersButton}
        >
          <I s="Open Orders" />
        </Button>
        <Button
          style={
            historyOrdersShown ? buyButtonActiveStyle : buttonInactiveStyle
          }
          onClick={this.clickedOrderHistory}
        >
          <I s="Order History" />
        </Button>
        <div
          style={{
            float: 'right',
            marginTop: '4px',
          }}
        >
          {account.state === LOGGED_IN && (
            <Checkbox
              onChange={this.clickedShowAll}
              defaultChecked={this.props.myOrders.showAllOpenOrders}
            >
              <I s="Show Other Pairs" />
            </Checkbox>
          )}
          {this.props.myOrders.openOrders.length > 1 &&
            openOrdersShown &&
            account.state === LOGGED_IN && (
              <CancelAllPopconfirm
                mouseLeaveDelay={0.2}
                overlayClassName="defaultPopover"
                icon={<span />}
                title={<I s="CancelAllConfirm" />}
                placement={'bottom'}
                okText={<I s="Yes" />}
                cancelText={<I s="No" />}
                onConfirm={this.clickedCancelAllOrders}
              >
                <CancelAllOrdersButton>
                  <I s="Cancel All" />
                </CancelAllOrdersButton>
              </CancelAllPopconfirm>
            )}
          {account.state === LOGGED_IN && (
            <ViewMoreButton
              type="link"
              onClick={() => {
                history.push(viewMoreLink());
              }}
            >
              <I s="View More" />
            </ViewMoreButton>
          )}
        </div>
      </TabRow>
    );
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, currentMarket, myOrders, tabs, exchange } = state;
  return {
    dexAccount,
    currentMarket,
    myOrders,
    tabs,
    tokens: exchange.tokens,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateShowAllOpenOrders: (value) =>
      dispatch(updateShowAllOpenOrders(value)),
    emptyMyOpenOrders: () => dispatch(emptyMyOpenOrders()),
    fetchMyOpenOrders: (accountId, limit, offset, market, apiKey, tokens) =>
      dispatch(
        fetchMyOpenOrders(accountId, limit, offset, market, apiKey, tokens)
      ),
    updateMyOrdersAndMyTradesType: (type) =>
      dispatch(updateMyOrdersAndMyTradesType(type)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(TabHeader)
);
