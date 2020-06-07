import * as R from "ramda";
import { connect } from "react-redux";
import { withTheme } from "styled-components";
import I from "components/I";
import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
// Defaults
import * as getters from "../components/defaults/getters";
import * as util from "../components/defaults/util";

// Components
import { EmptyOrderRow, OrderRow } from "./components/OrderRow";
import {
  OrderBookHeaderPosition,
  OrderBookHeaderPrice,
  OrderBookHeaderSize,
} from "./styles/Styles";
import { getLanguage } from "lightcone/api/localStorgeAPI";
import AbsoluteContainer from "../components/AbsoluteContainer";
import CompactOrderTable from "../components/CompactOrderTable";
import CompactTableHead from "../components/CompactTableHead";
import Panel from "../components/Panel";
import PanelHeader from "../components/PanelHeader";
import PrettyPosition from "../components/PrettyPosition";
import PrettyPrice from "../components/PrettyPrice";
import PrettySize from "../components/PrettySize";
import ScrollContainer from "../components/ScrollContainer";
import Spread from "./components/Spread";
import StickyContainer from "../components/StickyContainer";

import config from "lightcone/config";

const unsafePropNames = [
  "asks",
  "bids",
  "depth",
  "spreadText",
  "onClickOrder",
  "sizeBarMaxWidth",
  "sizeBarUnitSize",
  "getSize",
  "getPrice",
  "getPosition",
  "sizeFormat",
  "priceFormat",
  "renderSize",
  "renderPrice",
  "renderPosition",
];

class OrderBook extends React.Component {
  constructor(props, context) {
    super(props, context);
    // hasOrders is required for hasCentered.
    this.state = { hasOrders: false, hasCentered: false };
    this.scroller = null;
    this.centerSpread = this.centerSpread.bind(this);
    this.centerSpreadOnResize = this.centerSpreadOnResize.bind(this);
    window.addEventListener("resize", this.centerSpreadOnResize);
    const mql = window.matchMedia("(max-width: 1240px)");
    mql.addListener(this.centerSpread);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.hasOrders && util.hasReceivedOrderBook(this.props)) {
      return this.setState({ hasOrders: true });
    }
    if (this.scroller && this.state.hasOrders && !this.state.hasCentered) {
      return this.setState({ hasCentered: true }, this.centerSpread);
    }
    if (
      prevProps.market.currentMarket.current !==
      this.props.market.currentMarket.current
    ) {
      this.centerSpread();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.centerSpreadOnResize);
  }

  centerSpread() {
    if (this.scroller) {
      // Add a round method to avoid the first row is cut off.
      // 4 is for padding-top
      const diff =
        (this.scroller.scrollHeight - this.scroller.clientHeight) / 2 + 4;
      const otherHeights = 32 * 3 + 14;
      // Limit is 24.
      const num = Math.round((diff - otherHeights) / 24);
      this.scroller.scrollTop = num * 24 + otherHeights;
    }
  }

  centerSpreadOnResize() {
    if (!this.state.hasCentered) {
      return this.centerSpread();
    }
  }

  render() {
    const theme = this.props.theme;
    const {
      asks,
      bids,
      depth,
      onClickOrder,
      sizeBarMaxWidth,
      sizeBarUnitSize,
      getSize,
      getPrice,
      getPosition,
      renderSize,
      renderPrice,
      renderPosition,
      quoteTokenSymbol,
      exchange,
    } = this.props;

    const priceLabel = (
      <span>
        <I s="Price" /> ({quoteTokenSymbol})
      </span>
    );
    const sizeLabel = <I s="Amount" />;
    const positionLabel = <I s="Sum" />;

    const safeProps = R.omit(unsafePropNames, this.props);
    const visibleAsks = asks.slice(Math.max(asks.length - depth, 0));
    const visibleBids = bids.slice(0, depth);
    const maxRow = Math.max(visibleAsks.length, visibleBids.length, 20);

    var sizeMaxInSell = Math.max.apply(
      Math,
      visibleAsks.map(function (o) {
        return o.sizeInNumber;
      })
    );

    var sizeMaxInBuy = Math.max.apply(
      Math,
      visibleBids.map(function (o) {
        return o.sizeInNumber;
      })
    );

    let sizeBarMaxSize = Math.max(sizeMaxInSell, sizeMaxInBuy);
    if (!isFinite(sizeBarMaxSize)) {
      sizeBarMaxSize = 1000;
    }

    // https://github.com/Loopring/dexwebapp/issues/946
    let spread = "-";
    if (getLanguage() === "zh") {
      spread = this.props.latestTrade ? this.props.latestTrade.price : "-";
    } else {
      if (visibleAsks.length > 0 && visibleBids.length > 0) {
        spread =
          parseFloat(visibleAsks[visibleAsks.length - 1].price) -
          parseFloat(visibleBids[0].price);
      }
    }

    // Get priceFormat from orderBook.level
    let market = this.props.market.currentMarket.current;
    const baseTokenSymbol = this.props.market.currentMarket.baseTokenSymbol;
    const baseToken = config.getTokenBySymbol(baseTokenSymbol, exchange.tokens);
    const marketConfig = config.getMarketByPair(market, exchange.markets);
    const precisionForPrice = marketConfig ? marketConfig.precisionForPrice : 8;
    const precision = precisionForPrice - this.props.market.orderBook.level;
    let priceFormat;
    if (precision > 0) {
      priceFormat = "0." + "0".repeat(precision);
    } else if (precision < 0) {
      priceFormat = "1" + "0".repeat(-precision);
    }
    let sizeFormat;
    if (baseToken.precision > 0) {
      sizeFormat = "0." + "0".repeat(baseToken.precision);
    } else {
      sizeFormat = "1" + "0".repeat(-baseToken.precision);
    }

    const dataConfigs = [
      {
        propName: "price",
        format: priceFormat,
        getter: getPrice,
        renderer: renderPrice,
      },
      {
        propName: "size",
        format: sizeFormat,
        getter: getSize,
        renderer: renderSize,
      },
      {
        propName: "position",
        format: sizeFormat,
        getter: getPosition,
        renderer: renderPosition,
      },
    ];

    let orderBookComponent = (
      <AbsoluteContainer>
        <StickyContainer>
          {/* TABLE COLUMN HEADERS */}
          <CompactTableHead>
            <OrderBookHeaderPrice>{priceLabel}</OrderBookHeaderPrice>
            <OrderBookHeaderSize>{sizeLabel}</OrderBookHeaderSize>
            <OrderBookHeaderPosition>{positionLabel}</OrderBookHeaderPosition>
          </CompactTableHead>
        </StickyContainer>
        <ScrollContainer
          style={{
            visibility: this.state.hasOrders ? "visible" : "hidden",
          }}
          scrollerRef={(c) => {
            this.scroller = ReactDOM.findDOMNode(c);
          }}
        >
          <CompactOrderTable
            headerLabels={[priceLabel, sizeLabel, positionLabel]}
          >
            {Array(Math.max(0, maxRow - visibleAsks.length))
              .fill()
              .map((x, i) => i)
              .map((i) => (
                <EmptyOrderRow key={i} />
              ))}
            {visibleAsks.map((order, index) => (
              <OrderRow
                key={index}
                side="sell"
                order={order}
                size={getSize(order)}
                onClick={onClickOrder}
                dataConfigs={dataConfigs}
                sizeBarMaxSize={sizeBarMaxSize}
                sizeBarUnitSize={sizeBarUnitSize}
                sizeBarMaxWidth={sizeBarMaxWidth}
                buyPrimary={theme.buyPrimary}
                buyBar={theme.buyBar}
                sellPrimary={theme.sellPrimary}
                sellBar={theme.sellBar}
              />
            ))}
            <tr>
              <td colSpan="4">
                <Spread
                  spread={spread}
                  label={
                    getLanguage() === "zh" ? (
                      <I s="Last Price" />
                    ) : (
                      <I s="Spread" />
                    )
                  }
                  format={priceFormat}
                  buyPrimary={theme.buyPrimary}
                  sellPrimary={theme.sellPrimary}
                />
              </td>
            </tr>
            {visibleBids.map((order, index) => (
              <OrderRow
                key={index}
                side="buy"
                order={order}
                size={getSize(order)}
                onClick={onClickOrder}
                dataConfigs={dataConfigs}
                sizeBarMaxSize={sizeBarMaxSize}
                sizeBarUnitSize={sizeBarUnitSize}
                sizeBarMaxWidth={sizeBarMaxWidth}
                buyPrimary={theme.buyPrimary}
                buyBar={theme.buyBar}
                sellPrimary={theme.sellPrimary}
                sellBar={theme.sellBar}
              />
            ))}
            {Array(Math.max(0, maxRow - visibleBids.length))
              .fill()
              .map((x, i) => i)
              .map((i) => (
                <EmptyOrderRow key={i} />
              ))}
          </CompactOrderTable>
        </ScrollContainer>
      </AbsoluteContainer>
    );

    let headerContent;

    if (this.props.hideHeader) {
      headerContent = <div />;
    } else {
      headerContent = (
        <div
          style={{
            paddingTop: "0px",
            paddingLeft: "0px",
            backgroundColor: theme.background,
          }}
        >
          <PanelHeader headerText={<I s="Order Book" />} />
        </div>
      );
    }

    return (
      <Panel {...safeProps}>
        {/* UI HEADER */}
        {headerContent}
        {orderBookComponent}
      </Panel>
    );
  }
}

OrderBook.propTypes = {
  asks: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  bids: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  depth: PropTypes.number,
  sizeBarMaxWidth: PropTypes.number,
  sizeBarUnitSize: PropTypes.number,
  getSize: PropTypes.func,
  getPrice: PropTypes.func,
  getPosition: PropTypes.func,
  sizeFormat: PropTypes.string,
  priceFormat: PropTypes.string,
  renderSize: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  renderPrice: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  renderPosition: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  onClickOrder: PropTypes.func,
};

OrderBook.defaultProps = {
  asks: [],
  bids: [],
  depth: Infinity,
  sizeBarMaxWidth: 20,
  sizeBarUnitSize: 0.01, // decimals in depth bar
  getSize: getters.getSize,
  getPrice: getters.getPrice,
  getPosition: getters.getPosition,
  sizeFormat: "0.0000",
  priceFormat: "0.000000",
  renderSize: PrettySize,
  renderPrice: PrettyPrice,
  renderPosition: PrettyPosition,
};

const mapStateToProps = (state) => {
  const { layoutManager, market, exchange } = state;
  return { layoutManager, market, exchange };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(OrderBook)
);
