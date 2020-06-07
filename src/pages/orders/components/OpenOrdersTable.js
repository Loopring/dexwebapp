import { connect } from "react-redux";
import React from "react";

import { LOGGED_IN } from "redux/actions/DexAccount";
import { compareDexAccounts } from "components/services/utils";
import { fetchMyOpenOrders } from "redux/actions/MyOrderPage";
import Header from "./Header";
import OrderBaseTable from "./OrderBaseTable";

class OpenOrdersTable extends React.Component {
  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (this.props.exchange.isInitialized !== prevProps.exchange.isInitialized ||
        !compareDexAccounts(prevProps.dexAccount, this.props.dexAccount)) &&
      this.props.dexAccount.account.apiKey
    ) {
      this.loadData();
    }

    if (
      this.props.exchange.isInitialized &&
      prevProps.myOrderPage.marketFilter !==
        this.props.myOrderPage.marketFilter &&
      this.props.dexAccount.account.apiKey
    ) {
      this.loadData();
    }
  }

  loadData(offset = -1) {
    const { dexAccount, exchange, myOrderPage, fetchMyOpenOrders } = this.props;

    if (
      exchange.isInitialized &&
      !!dexAccount.account.accountId &&
      dexAccount.account.state === LOGGED_IN &&
      dexAccount.account.apiKey
    ) {
      // If All, tokenSymbol is undefined.
      let market;
      if (myOrderPage.marketFilter !== "All") {
        market = myOrderPage.marketFilter;
      }

      fetchMyOpenOrders(
        dexAccount.account.accountId,
        market,
        myOrderPage.openOrdersLimit,
        offset !== -1 ? offset : myOrderPage.openOrdersOffset,
        dexAccount.account.apiKey,
        exchange.tokens
      );
    }
  }

  onChange = (page) => {
    const offset = this.props.myOrderPage.openOrdersLimit * (page - 1);
    this.loadData(offset);
  };

  render() {
    const current =
      Math.floor(
        this.props.myOrderPage.openOrdersOffset /
          this.props.myOrderPage.openOrdersLimit
      ) + 1;

    return (
      <div>
        <Header />
        <OrderBaseTable
          placeHolder="NoOpenOrders"
          data={this.props.myOrderPage.openOrders}
          total={this.props.myOrderPage.openOrdersTotalNum}
          limit={this.props.myOrderPage.openOrdersLimit}
          offset={this.props.myOrderPage.openOrdersOffset}
          current={current}
          onChange={this.onChange}
          loading={this.props.myOrderPage.isOpenOrdersLoading}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { myOrderPage, exchange, dexAccount } = state;
  return { myOrderPage, exchange, dexAccount };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMyOpenOrders: (accountId, market, limit, offset, apiKey, tokens) =>
      dispatch(
        fetchMyOpenOrders(accountId, market, limit, offset, apiKey, tokens)
      ),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(OpenOrdersTable);
