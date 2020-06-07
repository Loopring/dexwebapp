import { connect } from "react-redux";
import React from "react";

import OrderBaseTable from "./components/OrderBaseTable";

import { updateOpenOrderOffset } from "redux/actions/MyOrders";

class OpenOrders extends React.Component {
  onChange = (page) => {
    const offset = this.props.myOrders.openOrdersLimit * (page - 1);
    this.props.updateOpenOrderOffset(offset);
  };

  render() {
    const current =
      Math.floor(
        this.props.myOrders.openOrdersOffset /
          this.props.myOrders.openOrdersLimit
      ) + 1;

    return (
      <OrderBaseTable
        placeHolder="NoOpenOrders"
        data={this.props.myOrders.openOrders}
        total={this.props.myOrders.openOrdersTotalNum}
        limit={this.props.myOrders.openOrdersLimit}
        offset={this.props.myOrders.openOrdersOffset}
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
    updateOpenOrderOffset: (offset) => dispatch(updateOpenOrderOffset(offset)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(OpenOrders);
