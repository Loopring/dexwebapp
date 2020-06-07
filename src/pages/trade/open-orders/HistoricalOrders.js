import { connect } from "react-redux";
import React from "react";

import OrderBaseTable from "./components/OrderBaseTable";

import { updateHistoryOrderOffset } from "redux/actions/MyOrders";

class HistoricalOrders extends React.Component {
  onChange = (page) => {
    const offset = this.props.myOrders.historyOrdersLimit * (page - 1);
    this.props.updateHistoryOrderOffset(offset);
  };

  render() {
    const current =
      Math.floor(
        this.props.myOrders.historyOrdersOffset /
          this.props.myOrders.historyOrdersLimit
      ) + 1;
    return (
      <OrderBaseTable
        placeHolder="NoHistoryOrders"
        data={this.props.myOrders.historyOrders}
        total={this.props.myOrders.historyOrdersTotalNum}
        limit={this.props.myOrders.historyOrdersLimit}
        offset={this.props.myOrders.historyOrdersOffset}
        current={current}
        onChange={this.onChange}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { myOrders } = state;
  return { myOrders };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateHistoryOrderOffset: (offset) =>
      dispatch(updateHistoryOrderOffset(offset)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalOrders);
