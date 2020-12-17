import { connect } from 'react-redux';
import I from 'components/I';
import React from 'react';

import { withTheme } from 'styled-components';
import config from 'lightcone/config';

import { Col, Row } from 'antd';

import AssetPanelButtons from './components/AssetPanelButtons';

class AssetPanel extends React.Component {
  state = {
    baseTokenAvailableAmount: <div>-</div>,
    baseTokenAvailableTotal: <div>&nbsp;</div>,
    quoteTokenAvailableAmount: <div>-</div>,
    quoteTokenxAvailableTotal: <div>&nbsp;</div>,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.balances !== this.props.balances ||
      prevProps.exchange.tokens !== this.props.exchange.tokens ||
      prevProps.currentMarket.current !== this.props.currentMarket.current ||
      (this.props.legalPrice &&
        prevProps.legalPrice.prices !== this.props.legalPrice.prices) ||
      prevProps.dexAccount.account.address !==
        this.props.dexAccount.account.address
    ) {
      this.updateLabels();
    }
  }

  updateLabels = () => {
    const { balances, currentMarket, exchange } = this.props;
    const { prices } = this.props.legalPrice;

    let baseTokenAvailableAmount;
    let baseTokenAvailableTotal;
    let quoteTokenAvailableAmount;
    let quoteTokenxAvailableTotal;

    if (
      balances &&
      balances.length &&
      prices &&
      prices.length &&
      exchange.tokens
    ) {
      const baseToken = config.getTokenBySymbol(
        currentMarket.baseTokenSymbol,
        exchange.tokens
      );
      baseTokenAvailableAmount = this.getAvailableAmount(baseToken, balances);
      baseTokenAvailableTotal = this.getAvailableTotalInFiat(
        baseToken,
        baseTokenAvailableAmount,
        prices,
        exchange.tokens
      );

      const quoteToken = config.getTokenBySymbol(
        currentMarket.quoteTokenSymbol,
        exchange.tokens
      );
      quoteTokenAvailableAmount = this.getAvailableAmount(quoteToken, balances);
      quoteTokenxAvailableTotal = this.getAvailableTotalInFiat(
        quoteToken,
        quoteTokenAvailableAmount,
        prices,
        exchange.tokens
      );
      this.setState({
        baseTokenAvailableAmount,
        baseTokenAvailableTotal,
        quoteTokenAvailableAmount,
        quoteTokenxAvailableTotal,
      });
    } else {
    }
  };

  getAvailableAmount = (token, balances) => {
    const holdBalance = balances.find((ba) => ba.tokenId === token.tokenId);
    return holdBalance
      ? holdBalance.availableInAssetPanel
      : Number(0).toFixed(token.precision);
  };

  getAvailableTotalInFiat = (token, availableAmount, prices, tokens) => {
    if (prices) {
      try {
        const baseTokenPrice = prices.filter(
          (x) => x.symbol === token.symbol
        )[0]['price'];
        let availableTotal = (
          parseFloat(baseTokenPrice) * parseFloat(availableAmount)
        ).toFixed(token.precision);
        return (
          <div>{`${this.props.legalPrice.legalPrefix}${availableTotal}`}</div>
        );
      } catch (error) {}
    }
    return <div>{Number(0).toFixed(token.precision)}</div>;
  };

  render() {
    const theme = this.props.theme;

    const header = (
      <div className="header">
        <Row className="row">
          <Col span={8}>
            <div
              className="columnLeft"
              style={{
                userSelect: 'none',
                color: theme.textDim,

                fontSize: '0.8rem',
                textTransform: 'uppercase',
              }}
            >
              <I s="Asset" />
            </div>
          </Col>
          <Col span={16}>
            <div
              className="columnRight"
              style={{
                userSelect: 'none',
                color: theme.textDim,

                fontSize: '0.8rem',
                textTransform: 'uppercase',
              }}
            >
              <I s="Available Balance" />
            </div>
          </Col>
        </Row>
      </div>
    );

    return (
      <div className="asset-panel">
        {header}
        <div className="body">
          <Row
            className="row"
            gutter={16}
            style={{
              color: theme.textWhite,
              fontSize: '0.9rem',
              paddingTop: '16px',
              paddingBottom: '0px',
            }}
          >
            <Col className="columnLeft" span={12} style={{}}>
              {this.props.currentMarket.baseTokenSymbol}
            </Col>
            <Col
              className="columnRight"
              span={12}
              style={{
                fontWeight: '600',
                fontSize: '0.9rem',
                color: theme.textWhite,
              }}
            >
              {this.state.baseTokenAvailableAmount}
            </Col>
          </Row>
          <Row
            className="row"
            gutter={16}
            style={{
              color: theme.textWhite,
              paddingTop: '0px',
              paddingBottom: '0px',
            }}
          >
            <Col className="columnLeft" span={12}></Col>
            <Col
              className="columnRight"
              span={12}
              style={{
                fontWeight: '600',
                fontSize: '0.9rem',
                color: theme.textDim,
              }}
            >
              {this.state.baseTokenAvailableTotal}
            </Col>
          </Row>
          <Row
            className="row"
            gutter={16}
            style={{
              color: theme.textWhite,
              fontSize: '0.9rem',
              paddingTop: '16px',
              paddingBottom: '0px',
            }}
          >
            <Col className="columnLeft" span={12} style={{}}>
              {this.props.currentMarket.quoteTokenSymbol}
            </Col>
            <Col
              className="columnRight"
              span={12}
              style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: theme.textWhite,
              }}
            >
              {this.state.quoteTokenAvailableAmount}
            </Col>
          </Row>
          <Row
            className="row"
            gutter={16}
            style={{
              color: theme.textWhite,
              fontSize: '0.9rem',
              paddingTop: '0px',
              paddingBottom: '16px',
            }}
          >
            <Col className="columnLeft" span={12}></Col>
            <Col
              className="columnRight"
              span={12}
              style={{
                fontWeight: '600',
                fontSize: '0.9rem',
                color: theme.textDim,
              }}
            >
              {this.state.quoteTokenxAvailableTotal}
            </Col>
          </Row>
          <AssetPanelButtons />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { currentMarket, balances, dexAccount, legalPrice, exchange } = state;
  return {
    currentMarket,
    balances: balances.balances,
    dexAccount,
    legalPrice,
    exchange,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(AssetPanel)
);
