import { connect } from "react-redux";
import I from "components/I";
import React from "react";

import { withTheme } from "styled-components";
import AppLayout from "AppLayout";
import OrderBookTradeHistoryPanel from "pages/trade/orderbook-and-trade-history/OrderBookTradeHistoryPanel";
import TradeHistory from "pages/trade/trade-history/TradeHistory";

import OpenAndHistoricalOrders from "pages/trade/open-orders/OpenAndHistoricalOrders";
import PanelHeader from "./components/PanelHeader";
import TickerBar from "./ticker-bar/TickerBar";

import TradePanel from "pages/trade/trade-panel/TradePanel";

import { Layout } from "antd";

import { toBig } from "lightcone/common/formatter";
import { updateAmount, updatePrice } from "redux/actions/TradePanel";
import { updateColumns } from "redux/actions/LayoutManager";
import { withUserPreferences } from "components/UserPreferenceContext";
import MarketService from "components/services/MarketService";
import PageMobile from "components/MobileIndicator";

import config from "lightcone/config";

import CookieConsent from "react-cookie-consent";

import KlineChart from "pages/trade/kline-chart/KlineChart";

import "./TradePage.less";

const { Sider, Content } = Layout;

class TradePage extends React.Component {
  render() {
    const theme = this.props.theme;
    const { currentMarket, exchange } = this.props;
    const baseTokenSymbol = currentMarket.baseTokenSymbol;
    const baseToken = config.getTokenBySymbol(baseTokenSymbol, exchange.tokens);
    const marketConfig = config.getMarketByPair(
      currentMarket.current,
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

    let priceChart = (
      <div
        key="price-chart"
        style={{
          background: theme.foreground,
        }}
      >
        <div
          style={{
            fontSize: "0.8rem",
            fontWeight: "400",
            color: theme.textDim,
            paddingLeft: "16px",
            lineHeight: "32px",
            background: theme.tableHeaderBackground,
          }}
        >
          {currentMarket.current}
        </div>
        <KlineChart />
      </div>
    );

    let contentComponent;
    if (this.props.layoutManager.numColumns !== 1) {
      contentComponent = (
        <div
          style={{
            width: "100%",
          }}
        >
          <PanelHeader headerText={<I s="Trading View" />} />
          {priceChart}
          <OpenAndHistoricalOrders />
        </div>
      );
    } else {
      contentComponent = (
        <div
          style={{
            display: "block",
            position: "relative",
            height: AppLayout.mainScreenHeight,
          }}
        >
          <TradePanel />
        </div>
      );
    }

    return (
      <div>
        <MarketService {...this.props} />
        <div className="desktop-layout">
          <TickerBar />
          <Layout
            hasSider={true}
            style={{
              height: AppLayout.mainScreenHeight,
              backgroundColor: theme.background,
            }}
          >
            <Sider
              width={AppLayout.tradePanelWidth}
              style={{
                paddingTop: "0px",
                backgroundColor: theme.sidePanelBackground,
                borderStyle: "none",
                height: AppLayout.mainScreenHeight,
              }}
              trigger={null}
              breakpoint="sm"
              collapsedWidth="0"
              onBreakpoint={(broken) => {}}
              onCollapse={(collapsed, type) => {
                this.props.updateColumns();
              }}
            >
              <div
                style={{
                  display: "block",
                  position: "relative",
                  height: AppLayout.mainScreenHeight,
                }}
              >
                <TradePanel />
              </div>
            </Sider>
            <Sider
              className="orderbook-and-trade-history-sider"
              width={AppLayout.orderBookWidth}
              style={{
                marginLeft: AppLayout.sidePadding,
                marginRight: AppLayout.sidePadding,
              }}
              trigger={null}
              breakpoint="lg"
              collapsedWidth="0"
              onBreakpoint={(broken) => {}}
              onCollapse={(collapsed, type) => {
                this.props.updateColumns();
              }}
            >
              <OrderBookTradeHistoryPanel />
            </Sider>
            <Content
              width="100%"
              style={{
                paddingTop: "0px",
              }}
            >
              {contentComponent}
            </Content>
            <Sider
              className="trade-history-sider"
              width={AppLayout.tradeHistoryWidth}
              trigger={null}
              onBreakpoint={(broken) => {}}
              onCollapse={(collapsed, type) => {
                this.props.updateColumns();
              }}
            >
              <TradeHistory
                getTimeStamp={(order) => order.timestamp}
                onClickTrade={(order, side) => {
                  this.props.updatePrice(toBig(order.price).toFixed(), true);
                }}
                sizeFormat={sizeFormat}
                priceFormat={priceFormat}
              />
            </Sider>
          </Layout>
        </div>
        <div className="mobile-layout">
          <PageMobile />
        </div>

        <CookieConsent
          location="bottom"
          cookieName="cookie-consent-1.0"
          style={{
            textAlign: "center",
            fontSize: "0.9rem",
            height: "64px",
            boxShadow: "0 0 0 5000px rgba(0, 0, 0, 0.45)",
            background: theme.foreground,
            color: theme.textBright,
          }}
          buttonText={<I s="I Agree" />}
          buttonStyle={{
            color: theme.textBigButton,
            borderRadius: "4px",
            minWidth: "100px",
            fontWeight: "600",
            background: theme.primary,
            fontSize: "0.9rem",
          }}
          expires={365}
        >
          <I s="CookieConsentMessage" />
          <a href="/legal/terms" target="_blank">
            <I s="Terms of Use" />
          </a>
          <I s=", " />
          <a href="/legal/privacy-policy" target="_blank">
            <I s="Privacy Policy" />
          </a>
          <I s=", " />
          <a href="/legal/cookie-policy" target="_blank">
            <I s="Cookie Policy" />
          </a>
          <I s=", and " />
          <a href="/legal/disclaimer" target="_blank">
            <I s="Disclaimer" />
          </a>
          <I s="." />
        </CookieConsent>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { layoutManager, currentMarket, exchange } = state;
  return {
    layoutManager,
    currentMarket,
    exchange,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAmount: (amount, shouldUpdateOrderTotal) =>
      dispatch(updateAmount(amount, shouldUpdateOrderTotal)),
    updatePrice: (price, shouldUpdateOrderTotal) =>
      dispatch(updatePrice(price, shouldUpdateOrderTotal)),
    updateColumns: () => dispatch(updateColumns()),
  };
};

export default withUserPreferences(
  withTheme(connect(mapStateToProps, mapDispatchToProps)(TradePage))
);
