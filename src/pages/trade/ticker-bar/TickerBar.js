import { Button, Carousel, Menu, Popover } from "antd";
import { HighlightTextSpan, RegularTextSpan } from "styles/Styles";
import { connect } from "react-redux";
import { withUserPreferences } from "components/UserPreferenceContext";
import AppLayout from "AppLayout";
import I from "components/I";
import MarketSelector from "modals/market-selector/MarketSelector";
import React from "react";
import styled, { withTheme } from "styled-components";
import ReactToolTip from 'react-tooltip';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faDotCircle } from "@fortawesome/free-solid-svg-icons/faDotCircle";
import { fetchTicker, restTicker } from "redux/actions/market/Ticker";

import TickerBarStatusIcon from "pages/trade/ticker-bar/TickerBarStatusIcon";
import config from "lightcone/config";

const SelectMarketButton = styled(Button)`
  background: ${(props) => props.theme.foreground};
  color: ${(props) => props.theme.textWhite};
  height: 53px !important;
  font-size: 0.9rem !important;
  font-weight: 600 !important;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.inputBorderColor}  !important;

  &:hover, &:focus  {
    background: ${(props) => props.theme.background} !important;
    border 1px solid  ${(props) =>
      props.theme.inputBorderActiveColor}  !important;
    color: ${(props) => props.theme.textBright};
  }

  FontAwesomeIcon {
    font-size: 16px;
  }
`;

const StyledReactTooltip = styled(ReactToolTip)`
  padding: 0;
  padding-left: 6px;
  padding-right: 6px;
  height: auto;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
`;

// const BlinkFontAwesomeIcon = styled(FontAwesomeIcon)`
//   // @keyframes blinker {
//   //   50% {
//   //     opacity: 0;
//   //     // filter: drop-shadow(0 0 0px ${(props) => props.color});
//   //   }
//   // }
//   margin-left: 4px;
//   margin-right: 4px;
//   // filter: drop-shadow(0 0 8px ${(props) => props.color});
//   // animation: blinker 3s ease-in-out infinite;
// `;

const MenuItem = styled(Menu.Item)`
  cursor: "default";
  padding-left: 0px;
  padding-right: 20px;
  line-height: ${AppLayout.tickerBarHeight};
`;

const MenuHighlightTextSpan = styled(HighlightTextSpan)`
  padding-left: 4px;
`;

class TickerBar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.handleClickChange = this.handleClickChange.bind(this);
  }

  state = {
    modalVisible: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.exchange.isInitialized !== this.props.exchange.isInitialized
    ) {
      this.props.restTicker();
      this.props.fetchTicker(
        this.props.currentMarket.current,
        this.props.exchange.tokens
      );
    }

    if (
      prevProps &&
      prevProps.currentMarket &&
      prevProps.currentMarket.current &&
      prevProps.currentMarket.current !== this.props.currentMarket.current
    ) {
      this.props.restTicker();
      this.props.fetchTicker(
        this.props.currentMarket.current,
        this.props.exchange.tokens
      );
    }
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  handleClickChange(visible) {
    this.setState({
      modalVisible: visible,
    });
  }

  render() {
    const theme = this.props.theme;
    const { ticker, currentMarket, exchange } = this.props;

    // Find base price
    const { prices } = this.props.cmcPrice;
    let price = "-";
    let priceUnit = this.props.cmcPrice.legal;
    let priceLabel = <I s="Last Price" />;
    let priceLabelValue = `${ticker.close} ${currentMarket.quoteTokenSymbol}`; // USDT Price
    let usdPriceLabelValue = ``; // USD Price

    const marketConfig = config.getMarketByPair(
      currentMarket.current,
      exchange.markets
    ) || {
      precisionForPrice: 6,
    };

    // If it fails to get price, use default value.
    try {
      const result = prices.filter(
        (x) => x.symbol === currentMarket.quoteTokenSymbol
      );
      if (result) {
        price = (result[0]["price"] * ticker.close).toFixed(
          marketConfig.precisionForPrice
        );
        if (!isNaN(price)) {
          priceLabelValue = `${ticker.close} ${currentMarket.quoteTokenSymbol}`;
          usdPriceLabelValue = `(${price} ${priceUnit})`;
        }
      }
    } catch (error) {}

    return (
      <div
        style={{
          borderBottomStyle: "none",
        }}
      >
        <Menu
          selectedKeys={[]}
          mode="horizontal"
          theme="dark"
          style={{
            background: theme.secondaryNavbarBackground,
          }}
        >
          <Menu.Item
            key="current-market"
            style={{
              width: AppLayout.tradePanelWidth,
              height: "53px",
              background: theme.sidePanelBackground,
              paddingLeft: AppLayout.sidePadding,
              paddingRight: AppLayout.sidePadding,
            }}
          >
            <Popover
              overlayClassName="marketSelection"
              placement="bottomLeft"
              title={null}
              content={
                <MarketSelector
                  isVisible={this.state.modalVisible}
                  closePopover={() => {
                    this.setModalVisible(false);
                  }}
                />
              }
              trigger="click"
              visible={this.state.modalVisible}
              onVisibleChange={this.handleClickChange}
            >
              <SelectMarketButton
                block
                onClick={() => this.setModalVisible(true)}
              >
                <span
                  style={{
                    width: "94%",
                    textAlign: "left",
                  }}
                >
                  {currentMarket.current}
                </span>
                <TickerBarStatusIcon />
              </SelectMarketButton>
            </Popover>
          </Menu.Item>
          <MenuItem
            key="current-market-trade-price"
            selectable={false}
            style={{
              paddingLeft: "12px",
            }}
          >
            <RegularTextSpan>{priceLabel}</RegularTextSpan>
            <MenuHighlightTextSpan>{priceLabelValue}</MenuHighlightTextSpan>
            <MenuHighlightTextSpan data-tip="Price Oracle Powered by Band Protocol">{usdPriceLabelValue}</MenuHighlightTextSpan>
            <StyledReactTooltip backgroundColor="#4a4f59" />
          </MenuItem>
          <MenuItem key="current-market-trade-change" selectable={false}>
            <RegularTextSpan>
              <I s="24h Change" />
            </RegularTextSpan>
            <MenuHighlightTextSpan
              style={{
                color: ticker.percentChange24h.startsWith("-")
                  ? theme.downColor
                  : theme.upColor,
              }}
            >
              {ticker.percentChange24h}
            </MenuHighlightTextSpan>
          </MenuItem>
          <MenuItem key="current-market-trade-volume" selectable={false}>
            <RegularTextSpan>
              <I s="24h Volume" />
            </RegularTextSpan>
            <MenuHighlightTextSpan>
              {ticker.volume} {currentMarket.quoteTokenSymbol}
            </MenuHighlightTextSpan>
          </MenuItem>
          <MenuItem key="current-market-trade-high" selectable={false}>
            <RegularTextSpan>
              <I s="High" />
            </RegularTextSpan>
            <MenuHighlightTextSpan>
              {ticker.high} {currentMarket.quoteTokenSymbol}
            </MenuHighlightTextSpan>
          </MenuItem>

          <MenuItem key="current-market-trade-low">
            <RegularTextSpan>
              <I s="Low" />
            </RegularTextSpan>
            <MenuHighlightTextSpan>
              {ticker.low} {currentMarket.quoteTokenSymbol}
            </MenuHighlightTextSpan>
          </MenuItem>

          <Menu.Item
            key="market-available"
            style={{
              float: "right",
              paddingLeft: "0px",
              paddingRight: "24px",
              cursor: "default",
              display: "none",
            }}
          >
            <Carousel
              autoplay
              dots={false}
              speed={5000}
              style={{
                width: "225px",
                fontSize: "0.85rem",
                fontWeight: "600",

                userSelect: "none",
                height: AppLayout.tickerBarHeight,
              }}
            >
              <div>
                <div
                  style={{
                    float: "right",
                    height: AppLayout.tickerBarHeight,
                    lineHeight: AppLayout.tickerBarHeight,
                    color: theme.green,
                  }}
                >
                  <span style={{ color: theme.green }}>
                    <FontAwesomeIcon icon={faDotCircle} />{" "}
                    <I s="Market Available" />
                  </span>
                </div>
              </div>
            </Carousel>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { ticker, currentMarket, cmcPrice, exchange } = state;
  return {
    ticker,
    currentMarket,
    cmcPrice,
    exchange,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    restTicker: () => dispatch(restTicker()),
    fetchTicker: (market, tokens) => dispatch(fetchTicker(market, tokens)),
  };
};

export default withUserPreferences(
  withTheme(connect(mapStateToProps, mapDispatchToProps)(TickerBar))
);
