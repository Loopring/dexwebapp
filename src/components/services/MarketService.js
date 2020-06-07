import { connect } from "react-redux";
import { history } from "redux/configureStore";
import { withTheme } from "styled-components";
import React from "react";

import I from "components/I";

import { emptyTradePanel } from "redux/actions/TradePanel";
import { saveLastTradePage } from "lightcone/api/localStorgeAPI";
import { setMarket } from "redux/actions/market/CurrentMarket";
import { updateOrderBooksLevel } from "redux/actions/market/OrderBook";

import { notifyError } from "redux/actions/Notification";

class MarketService extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    let pair;
    if (typeof this.props.match.params.pair === "undefined") {
      pair = "LRC-USDT";
    } else {
      pair = this.props.match.params.pair;
    }

    if (
      prevProps.exchange.isInitialized !== this.props.exchange.isInitialized &&
      this.props.exchange.isInitialized
    ) {
      const newMarket = pair;
      if (
        !this.props.markets.find(
          (m) => m.enabled && m.market === newMarket.toUpperCase()
        )
      ) {
        notifyError(
          <span>
            {newMarket} <I s="IsNotAValidMarket" />
          </span>,
          this.props.theme
        );
        saveLastTradePage("LRC-USDT");
        history.push("/404");
        return;
      }
    }

    if (
      pair.toUpperCase() !== this.props.market.currentMarket.current ||
      (prevProps.match.params.pair && prevProps.match.params.pair !== pair)
    ) {
      let market = pair;
      this.props.setMarket(market);
      this.props.updateOrderBooksLevel(market, 0);
      this.props.emptyTradePanel();
    }
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = (state) => {
  const { market, exchange } = state;
  return {
    market,
    tokens: exchange.tokens,
    markets: exchange.markets,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMarket: (marketName) => dispatch(setMarket(marketName)),
    updateOrderBooksLevel: (market, level) =>
      dispatch(updateOrderBooksLevel(market, level)),
    emptyTradePanel: () => dispatch(emptyTradePanel()),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(MarketService)
);
