import { Button } from "antd";

import "./AggregationWidget.less";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons/faMinusCircle";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import I from "components/I";
import React from "react";
import config from "lightcone/config";
import styled, { withTheme } from "styled-components";

import { updateOrderBooksLevel } from "redux/actions/market/OrderBook";

const AggregationButton = styled(Button)`
  border-style: none;
  background:none!important;
  color: ${(props) => props.theme.textDim};
  width: 30px;
  float: right;
  line-height: 30px;
  padding: 0px;

  &:hover {
    color: ${(props) => props.theme.primary}!important;
    border-style: none;
  }

  &:disabled {
    color: ${(props) => props.theme.inputPlaceHolderColor}!important;
  }

  @media only screen and (max-width: 992px) {
    display: none;
  }

  FontAwesomeIcon {
    color:${(props) => props.theme.textDim};
  }
}
`;
class AggregationWidget extends React.Component {
  render() {
    const theme = this.props.theme;
    const marketConfig = config.getMarketByPair(
      this.props.market.currentMarket.current,
      this.props.exchange.markets
    );

    let maxLevel = 8;
    let precision = 8;
    if (marketConfig) {
      maxLevel = marketConfig.orderbookAggLevels;
      precision =
        marketConfig.precisionForPrice - this.props.market.orderBook.level;
    }

    let showLevel = "1";
    if (precision > 0) {
      showLevel = "0." + "0".repeat(precision - 1) + "1";
    } else if (precision < 0) {
      showLevel = "1" + "0".repeat(-precision);
    }
    return (
      <div
        className="order-book-level"
        style={{
          backgroundColor: theme.spreadAggregationBackground,
          position: "absolute",
          bottom: "0px",
          width: "100%",
          fontSize: "0.85rem",
          fontWeight: "700",
          lineHeight: "30px",
        }}
      >
        <div
          style={{
            color: theme.textDim,
            display: "inline-block",
            width: "35%",
            textAlign: "left",
            padding: "1px",
            userSelect: "none",
            paddingLeft: "12px",
          }}
        >
          {showLevel}
        </div>
        <div
          style={{
            color: theme.textDim,
            display: "inline-block",
            marginLeft: "2px",
            width: "30%",
            textAlign: "right",
            padding: "1px 1px 1px 12px",
            userSelect: "none",
          }}
        >
          <I s="Aggregation" />
        </div>

        <AggregationButton
          style={{
            marginRight: "2px",
          }}
          disabled={this.props.market.orderBook.level === 0 ? true : false}
          onClick={() => {
            const nextValue = this.props.market.orderBook.level - 1;
            if (nextValue >= 0) {
              this.props.updateOrderBooksLevel(
                this.props.market.currentMarket.current,
                this.props.market.orderBook.level - 1
              );
            }
          }}
        >
          <FontAwesomeIcon icon={faPlusCircle} />
        </AggregationButton>

        <AggregationButton
          disabled={this.props.market.orderBook.level === maxLevel - 1}
          onClick={() => {
            const nextValue = this.props.market.orderBook.level + 1;
            if (nextValue < maxLevel) {
              this.props.updateOrderBooksLevel(
                this.props.market.currentMarket.current,
                this.props.market.orderBook.level + 1
              );
            }
          }}
        >
          <FontAwesomeIcon icon={faMinusCircle} />
        </AggregationButton>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { market, exchange } = state;
  return { market, exchange };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateOrderBooksLevel: (market, level) =>
      dispatch(updateOrderBooksLevel(market, level)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(AggregationWidget)
);
