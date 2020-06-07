import { connect } from "react-redux";
import React from "react";

import { compareDexAccounts } from "./utils";
import {
  emptyMyHistoryOrders,
  emptyMyOpenOrders,
  fetchMyHistoryOrders,
  fetchMyOpenOrders,
} from "redux/actions/MyOrders";

import { LOGGED_IN } from "redux/actions/DexAccount";

class DexAccountOrderService extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.dexAccount.account.apiKey &&
      this.props.dexAccount.account.state === LOGGED_IN
    ) {
      const marketInFetchMyOpenOrders = this.props.myOrders.showAllOpenOrders
        ? undefined
        : this.props.currentMarket.current;
      if (
        prevProps.dexAccount.account &&
        this.props.dexAccount.account &&
        this.props.dexAccount.account.accountId &&
        compareDexAccounts(prevProps.dexAccount, this.props.dexAccount) ===
          false
      ) {
        this.props.fetchMyOpenOrders(
          this.props.dexAccount.account.accountId,
          this.props.myOrders.openOrdersLimit,
          this.props.myOrders.openOrdersOffset,
          marketInFetchMyOpenOrders,
          this.props.dexAccount.account.apiKey,
          this.props.tokens
        );
        this.props.fetchMyHistoryOrders(
          this.props.dexAccount.account.accountId,
          this.props.myOrders.historyOrdersLimit,
          this.props.myOrders.historyOrdersOffset,
          marketInFetchMyOpenOrders,
          this.props.dexAccount.account.apiKey,
          this.props.tokens
        );
      }

      const { accountId, apiKey } = this.props.dexAccount.account;

      if (
        prevProps.currentMarket.current !== this.props.currentMarket.current
      ) {
        this.props.emptyMyOpenOrders();
        this.props.emptyMyHistoryOrders();
        this.props.fetchMyOpenOrders(
          accountId,
          this.props.myOrders.openOrdersLimit,
          0,
          marketInFetchMyOpenOrders,
          apiKey,
          this.props.tokens
        );

        this.props.fetchMyHistoryOrders(
          accountId,
          this.props.myOrders.historyOrdersLimit,
          0,
          marketInFetchMyOpenOrders,
          apiKey,
          this.props.tokens
        );
      }

      if (
        prevProps.myOrders.openOrdersOffset !==
        this.props.myOrders.openOrdersOffset
      ) {
        this.props.fetchMyOpenOrders(
          accountId,
          this.props.myOrders.openOrdersLimit,
          this.props.myOrders.openOrdersOffset,
          marketInFetchMyOpenOrders,
          apiKey,
          this.props.tokens
        );
      }

      if (
        prevProps.myOrders.historyOrdersOffset !==
        this.props.myOrders.historyOrdersOffset
      ) {
        this.props.fetchMyHistoryOrders(
          accountId,
          this.props.myOrders.historyOrdersLimit,
          this.props.myOrders.historyOrdersOffset,
          marketInFetchMyOpenOrders,
          apiKey,
          this.props.tokens
        );
      }

      if (
        prevProps.myOrders.showAllOpenOrders !==
        this.props.myOrders.showAllOpenOrders
      ) {
        this.props.fetchMyOpenOrders(
          accountId,
          this.props.myOrders.openOrdersLimit,
          this.props.myOrders.openOrdersOffset,
          marketInFetchMyOpenOrders,
          apiKey,
          this.props.tokens
        );
      }
    }
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, currentMarket, myOrders, exchange } = state;
  return { dexAccount, currentMarket, myOrders, tokens: exchange.tokens };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMyOpenOrders: (accountId, limit, offset, market, apiKey, tokens) =>
      dispatch(
        fetchMyOpenOrders(accountId, limit, offset, market, apiKey, tokens)
      ),
    fetchMyHistoryOrders: (accountId, limit, offset, market, apiKey, tokens) =>
      dispatch(
        fetchMyHistoryOrders(accountId, limit, offset, market, apiKey, tokens)
      ),
    emptyMyHistoryOrders: () => dispatch(emptyMyHistoryOrders()),
    emptyMyOpenOrders: () => dispatch(emptyMyOpenOrders),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DexAccountOrderService);
