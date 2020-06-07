import { connect } from "react-redux";
import { formatter } from "lightcone/common";
import { toBig } from "lightcone/common/formatter";
import {
  updateAmount,
  updatePrice,
  updateTradeType,
} from "redux/actions/TradePanel";
import { withTheme } from "styled-components";
import AggregationWidget from "./components/AggregationWidget";
import OrderBook from "pages/trade/orderbook/OrderBook";
import React from "react";
import TabHeader from "./components/TabHeader";
import TradeHistory from "pages/trade/trade-history/TradeHistory";
import config from "lightcone/config";

import "./OrderBookTradeHistoryPanel.less";

class OrderBookTradeHistoryPanel extends React.Component {
  render() {
    const theme = this.props.theme;

    const { market, exchange } = this.props;
    const baseTokenSymbol = this.props.market.currentMarket.baseTokenSymbol;
    const quoteTokenSymbol = this.props.market.currentMarket.quoteTokenSymbol;
    const baseToken = config.getTokenBySymbol(baseTokenSymbol, exchange.tokens);
    const marketConfig = config.getMarketByPair(
      market.currentMarket.current,
      exchange.markets
    ) || {
      precisionForPrice: 6,
    };

    const sizeFormat = baseToken.precision
      ? "0." + "0".repeat(baseToken.precision)
      : "1" + "0".repeat(-baseToken.precision);
    const priceFormat =
      marketConfig.precisionForPrice > 0
        ? " 0." + "0".repeat(marketConfig.precisionForPrice)
        : "1" + "0".repeat(-marketConfig.precisionForPrice);

    const orderbookSide = (
      <div className="orderbook-side">
        <OrderBook
          hideHeader={false}
          depth={30}
          baseTokenSymbol={baseTokenSymbol}
          quoteTokenSymbol={quoteTokenSymbol}
          asks={this.props.market.orderBook.sells}
          bids={this.props.market.orderBook.buys}
          latestTrade={this.props.market.tradeHistory.latestTrade}
          getPrice={(entry) => {
            // Have to check if entry is null or not
            if (entry) {
              return entry.price;
            } else {
              return 0;
            }
          }}
          getSize={(entry) => {
            try {
              return entry.sizeInNumber;
            } catch (error) {
              return 0;
            }
          }}
          getPosition={(entry) => {
            return entry.aggregatedSize;
          }}
          onClickOrder={(order, side, position) => {
            this.props.updatePrice(toBig(order.price).toFixed(), true);
            if (this.props.tradeType !== side || position === "size") {
              let size = 0;
              if (side.toLowerCase() === "buy") {
                const slots = this.props.market.orderBook.buys.filter(
                  (slot) => parseFloat(slot.price) >= parseFloat(order.price)
                );
                size = slots
                  .map((slot) =>
                    formatter.toBig(
                      config.fromWEI(
                        this.props.market.currentMarket.baseTokenSymbol,
                        slot.size,
                        exchange.tokens
                      )
                    )
                  )
                  .reduce((sum, size) => sum.plus(size));
              } else {
                const slots = this.props.market.orderBook.sells.filter(
                  (slot) => parseFloat(slot.price) <= parseFloat(order.price)
                );
                size = slots
                  .map((slot) =>
                    formatter.toBig(
                      config.fromWEI(
                        this.props.market.currentMarket.baseTokenSymbol,
                        slot.size,
                        exchange.tokens
                      )
                    )
                  )
                  .reduce((sum, size) => sum.plus(size));
              }

              this.props.updateAmount(formatter.toNumber(size), true);
            }
          }}
        />
        <AggregationWidget />
      </div>
    );

    let content = (
      <div
        style={{
          display: this.props.tabs.type1 === "orderBook" ? "initial" : "none",
        }}
      >
        <OrderBook
          style={{
            height: "calc(100vh - 64px - 45px - 45.59px + 8px)",
          }}
          hideHeader={true}
          baseTokenSymbol={baseTokenSymbol}
          quoteTokenSymbol={quoteTokenSymbol}
          depth={1000}
          asks={this.props.market.orderBook.sells}
          bids={this.props.market.orderBook.buys}
          latestTrade={this.props.market.tradeHistory.latestTrade}
          getPrice={(entry) => {
            // Have to check if entry is null or not
            if (entry) {
              return entry.price;
            } else {
              return 0;
            }
          }}
          getSize={(entry) => {
            try {
              return config.fromWEI(
                baseTokenSymbol,
                entry.size,
                exchange.tokens
              );
            } catch (error) {
              return 0;
            }
          }}
          getPosition={(entry) => {
            return entry.aggregatedSize;
          }}
          onClickOrder={(order, side, position) => {
            this.props.updatePrice(toBig(order.price).toFixed(), true);
            if (this.props.tradeType !== side || position === "size") {
              let size = 0;
              if (side.toLowerCase() === "buy") {
                const slots = this.props.market.orderBook.buys.filter(
                  (slot) => parseFloat(slot.price) >= parseFloat(order.price)
                );
                size = slots
                  .map((slot) =>
                    formatter.toBig(
                      config.fromWEI(
                        this.props.market.currentMarket.baseTokenSymbol,
                        slot.size,
                        exchange.tokens
                      )
                    )
                  )
                  .reduce((sum, size) => sum.plus(size));
              } else {
                const slots = this.props.market.orderBook.sells.filter(
                  (slot) => parseFloat(slot.price) <= parseFloat(order.price)
                );
                size = slots
                  .map((slot) =>
                    formatter.toBig(
                      config.fromWEI(
                        this.props.market.currentMarket.baseTokenSymbol,
                        slot.size,
                        exchange.tokens
                      )
                    )
                  )
                  .reduce((sum, size) => sum.plus(size));
              }

              this.props.updateAmount(formatter.toNumber(size), true);
            }
          }}
        />
        <AggregationWidget />
      </div>
    );
    const orderBookAndTradeHistorySide = (
      <div className="orderbook-side-and-trade-history">
        <div
          style={{
            height: "44px",
            backgroundColor: theme.background,
          }}
        >
          <TabHeader />
        </div>
        {content}
        <TradeHistory
          style={{
            display: this.props.tabs.type1 === "orderBook" ? "none" : "initial",
            height: "calc(100vh - 64px - 45px - 45.59px + 8px)",
          }}
          hideHeader={true}
          getTimeStamp={(order) => order.timestamp}
          onClickTrade={(order, side) => {
            this.props.updatePrice(toBig(order.price).toFixed(), true);
          }}
          sizeFormat={sizeFormat}
          priceFormat={priceFormat}
        />
      </div>
    );

    return (
      <div>
        {orderbookSide}
        {orderBookAndTradeHistorySide}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { layoutManager, market, tabs, myOrders, exchange, tradePanel } = state;
  return {
    layoutManager,
    market,
    tabs,
    myOrders,
    exchange,
    tradeType: tradePanel.tradeType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePrice: (price, shouldUpdateOrderTotal) =>
      dispatch(updatePrice(price, shouldUpdateOrderTotal)),
    updateAmount: (size, shouldUpdateOrderTotal) =>
      dispatch(updateAmount(size, shouldUpdateOrderTotal)),
    updateTradeType: (type) => dispatch(updateTradeType(type)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(OrderBookTradeHistoryPanel)
);
