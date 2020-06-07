import { Button, Col, Row } from "antd";
import { connect } from "react-redux";
import { updateTradeType } from "redux/actions/TradePanel";
import { withTheme } from "styled-components";
import I from "components/I";
import React from "react";

class TradeTabButtons extends React.Component {
  clickedBuyButton = () => {
    this.props.updateTradeType("buy");
  };

  clickedSellButton = () => {
    this.props.updateTradeType("sell");
  };

  render() {
    const theme = this.props.theme;
    const isBuy = this.props.tradeType === "buy";
    const isSell = this.props.tradeType === "sell";

    const buttonStyle = {
      color: theme.textBigButton,
      borderStyle: "none",
      height: "32px",
      borderRadius: "0px",
      fontWeight: "600",
      fontSize: "0.85rem",
      textTransform: "uppercase",
      borderBottomWidth: "2px",
      borderBottomStyle: "solid",
      borderBottomColor: "transparent",
      background: "transparent",
    };

    const buyButtonActiveStyle = {
      ...buttonStyle,
      borderBottomColor: theme.buyPrimary,
      color: theme.textWhite,
    };

    const sellButtonActiveStyle = {
      ...buttonStyle,
      borderBottomColor: theme.sellPrimary,
      color: theme.textWhite,
    };

    const buttonInactiveStyle = {
      ...buttonStyle,
      color: theme.textDim,
    };

    return (
      <div>
        <Row
          gutter={0}
          style={{
            paddingTop: "0px",
            paddingBottom: "0px",
            color: theme.textWhite,
            backgroundColor: "transparent",
            borderRadius: "4px",
          }}
        >
          <Col className="columnLeft" span={12}>
            <Button
              block
              style={isBuy ? buyButtonActiveStyle : buttonInactiveStyle}
              onClick={this.clickedBuyButton}
              disabled={this.props.disabled}
            >
              <I s="Buy" />
            </Button>
          </Col>
          <Col className="columnRight" span={12}>
            <Button
              block
              style={isSell ? sellButtonActiveStyle : buttonInactiveStyle}
              onClick={this.clickedSellButton}
              disabled={this.props.disabled}
            >
              <I s="Sell" />
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { tradeType } = state.tradePanel;
  return {
    tradeType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTradeType: (tradeType) => dispatch(updateTradeType(tradeType)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(TradeTabButtons)
);
