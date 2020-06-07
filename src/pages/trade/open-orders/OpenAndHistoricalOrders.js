import { connect } from "react-redux";
import React from "react";

import { withTheme } from "styled-components";
import AppLayout from "AppLayout";

import HistoricalOrders from "./HistoricalOrders";
import OpenOrders from "./OpenOrders";
import TabHeader from "./components/TabHeader";

class OpenAndHistoricalOrders extends React.Component {
  render() {
    const theme = this.props.theme;
    return (
      <div
        style={{
          paddingLeft: "0px",
          paddingTop: "0px",
          marginTop: "0px",
          borderWidth: "0px",
          height: AppLayout.tradeOrderAndTradeHeight,
          background: theme.foreground,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "44px",
            backgroundColor: theme.background,
          }}
        >
          <TabHeader />
        </div>
        <div
          style={{
            display: this.props.tabs.type2 === "open-orders" ? "block" : "none",
          }}
        >
          <OpenOrders />
        </div>
        <div
          style={{
            display:
              this.props.tabs.type2 === "history-orders" ? "block" : "none",
          }}
        >
          <HistoricalOrders />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { tabs } = state;
  return { tabs };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(OpenAndHistoricalOrders)
);
