import * as R from "ramda";
import { connect } from "react-redux";
import I from "components/I";
import PropTypes from "prop-types";
import React from "react";

import * as getters from "../components/defaults/getters";
import { withTheme } from "styled-components";

import { TableColHead, TableColHeadPrice } from "./styles/Styles";
import AbsoluteContainer from "../components/AbsoluteContainer";
import CompactOrderTable from "../components/CompactOrderTable";
import CompactTableHead from "../components/CompactTableHead";
import Panel from "../components/Panel";
import PanelHeader from "../components/PanelHeader";
import ScrollContainer from "../components/ScrollContainer";
import StickyContainer from "../components/StickyContainer";

import OrderRow from "./components/OrderRow";
import PrettyPrice from "../components/PrettyPrice";
import PrettySize from "../components/PrettySize";
import PrettyTimeStamp from "../components/PrettyTimeStamp";
import config from "lightcone/config";

const unsafePropNames = [
  "trades",
  "length",
  "headerText",
  "sizeLabel",
  "priceLabel",
  "timeStampLabel",
  "onClickTrade",
  "getSideFromLightconeData",
  "getTimeStampFromLightconeData",
  "sizeFormat",
  "priceFormat",
  "timeStampFormat",
  "renderSize",
  "renderPrice",
  "renderTimeStamp",
];

class TradeHistory extends React.Component {
  getSize = (entry) => {
    try {
      return config.fromWEI(
        this.props.baseTokenSymbol,
        entry.size,
        this.props.exchange.tokens
      );
    } catch (error) {
      return 0;
    }
  };

  getPrice = (entry) => {
    if (entry) {
      return Number(entry.price);
    } else {
      return 0;
    }
  };

  render() {
    const theme = this.props.theme;
    const {
      trades,
      length,
      onClickTrade,
      getSideFromLightconeData,
      getTimeStampFromLightconeData,
      sizeFormat,
      priceFormat,
      timeStampFormat,
      renderSize,
      renderPrice,
      renderTimeStamp,
      quoteTokenSymbol,
    } = this.props;

    const headerText = <I s="Recent Trades" />;
    const sizeLabel = <I s="Amount" />;
    const priceLabel = (
      <span>
        <I s="FillPrice" /> ({quoteTokenSymbol})
      </span>
    );
    const timeStampLabel = <I s="Filled At" />;

    const safeProps = R.omit(unsafePropNames, this.props);
    const visibleTrades = trades.slice(0, length);
    const dataConfigs = [
      {
        propName: "price",
        format: priceFormat,
        getter: this.getPrice,
        renderer: renderPrice,
      },
      {
        propName: "size",
        format: sizeFormat,
        getter: this.getSize,
        renderer: renderSize,
      },
      {
        propName: "timestamp",
        format: timeStampFormat,
        getter: getTimeStampFromLightconeData,
        renderer: renderTimeStamp,
      },
    ];

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
          <PanelHeader headerText={headerText} />
        </div>
      );
    }

    return (
      <Panel {...safeProps}>
        {/* UI HEADER */}
        {headerContent}
        <AbsoluteContainer>
          <StickyContainer>
            {/* TABLE COLUMN HEADERS */}
            <CompactTableHead>
              <TableColHeadPrice
                style={{
                  paddingLeft: "0px",
                  textAlign: "center",
                }}
              >
                {priceLabel}
              </TableColHeadPrice>
              <TableColHead
                style={{
                  paddingRight: "13px",
                  textAlign: "center",
                }}
              >
                {sizeLabel}
              </TableColHead>
              <TableColHead
                style={{
                  paddingRight: "13px",
                  textAlign: "right",
                }}
              >
                {timeStampLabel}
              </TableColHead>
            </CompactTableHead>
          </StickyContainer>
          <ScrollContainer>
            {/* TRADE TABLE */}
            <CompactOrderTable
              headerLabels={[sizeLabel, priceLabel, timeStampLabel]}
            >
              {visibleTrades.map((trade, i) => (
                <OrderRow
                  key={i}
                  order={trade}
                  preOrder={
                    i === trades.length - 1 ? null : visibleTrades[i + 1]
                  }
                  side={getSideFromLightconeData(trade)}
                  size={this.getSize(trade)}
                  onClick={onClickTrade}
                  dataConfigs={dataConfigs}
                  buyPrimary={theme.buyPrimary}
                  buyBar={theme.buyBar}
                  sellPrimary={theme.sellPrimary}
                  sellBar={theme.sellBar}
                />
              ))}
            </CompactOrderTable>
          </ScrollContainer>
        </AbsoluteContainer>
      </Panel>
    );
  }
}

TradeHistory.propTypes = {
  trades: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  length: PropTypes.number,
  getSideFromLightconeData: PropTypes.func,
  getTimeStampFromLightconeData: PropTypes.func,
  sizeFormat: PropTypes.string,
  priceFormat: PropTypes.string,
  timeStampFormat: PropTypes.string,
  renderSize: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  renderPrice: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  renderTimeStamp: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  onClickTrade: PropTypes.func,
  onScrollBottom: PropTypes.func,
};

TradeHistory.defaultProps = {
  trades: [],
  length: Infinity,
  getSideFromLightconeData: getters.getSideFromLightconeData,
  getTimeStampFromLightconeData: getters.getTimeStampFromLightconeData,
  sizeFormat: "0.0000",
  priceFormat: "0.000000",
  timeStampFormat: "HH:mm:ss",
  renderSize: PrettySize,
  renderPrice: PrettyPrice,
  renderTimeStamp: PrettyTimeStamp,
};

const mapStateToProps = (state) => {
  const { market, currentMarket, tradeHistory, exchange } = state;
  return {
    market,
    trades: tradeHistory.trades,
    baseTokenSymbol: currentMarket.baseTokenSymbol,
    quoteTokenSymbol: currentMarket.quoteTokenSymbol,
    exchange,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(TradeHistory)
);
