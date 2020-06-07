import { connect } from "react-redux";
import React from "react";

import OrderBaseTable from "./OrderBaseTable";

import { LOGGED_IN } from "redux/actions/DexAccount";
import { compareDexAccounts } from "components/services/utils";
import { fetchMyHistoryOrders } from "redux/actions/MyOrderPage";
import Header from "./Header";

class HistoryOrdersTable extends React.Component {
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
    const {
      dexAccount,
      exchange,
      myOrderPage,
      fetchMyHistoryOrders,
    } = this.props;

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

      fetchMyHistoryOrders(
        dexAccount.account.accountId,
        market,
        myOrderPage.historyOrdersLimit,
        offset !== -1 ? offset : myOrderPage.historyOrdersOffset,
        dexAccount.account.apiKey,
        exchange.tokens
      );
    }
  }

  onChange = (page) => {
    const offset = this.props.myOrderPage.historyOrdersLimit * (page - 1);
    this.loadData(offset);
  };

  render() {
    const current =
      Math.floor(
        this.props.myOrderPage.historyOrdersOffset /
          this.props.myOrderPage.historyOrdersLimit
      ) + 1;
    return (
      <div>
        <Header />
        <OrderBaseTable
          placeHolder="NoHistoryOrders"
          data={this.props.myOrderPage.historyOrders}
          total={this.props.myOrderPage.historyOrdersTotalNum}
          limit={this.props.myOrderPage.historyOrdersLimit}
          offset={this.props.myOrderPage.historyOrdersOffset}
          current={current}
          onChange={this.onChange}
          loading={this.props.myOrderPage.isHistoryOrdersLoading}
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
    fetchMyHistoryOrders: (accountId, market, limit, offset, apiKey, tokens) =>
      dispatch(
        fetchMyHistoryOrders(accountId, market, limit, offset, apiKey, tokens)
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryOrdersTable);
