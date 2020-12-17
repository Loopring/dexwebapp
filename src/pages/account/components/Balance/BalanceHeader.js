import { Col, Row } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LargeTableHeader } from 'styles/Styles';

import * as fm from 'lightcone/common/formatter';
import { connect } from 'react-redux';
import { faEquals } from '@fortawesome/free-solid-svg-icons/faEquals';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { getLpTokenPrice } from 'pages/swap/components/utils';
import { withTheme } from 'styled-components';
import BalanceHeaderEstimatedValue from 'pages/account/components/Balance/BalanceHeaderEstimatedValue';
import React from 'react';
import config from 'lightcone/config';

class BalanceHeader extends React.PureComponent {
  getEstimatedValues() {
    let isPriceLoading = true;
    let balanceOnEthereumSum = null;
    let balanceOnEthereumEstimatedValue = null;

    let balanceOnExchangeSum = null;
    let balanceOnExchangeSumEstimatedValue = null;

    // Prices
    const { prices } = this.props.legalPrice;
    const { tokens } = this.props;

    // Base units are ETH and USDT prices
    let ethFilteredPrice = prices.filter((price) => price.symbol === 'ETH');
    let usdtFilteredPrice = prices.filter((price) => price.symbol === 'USDT');

    if (ethFilteredPrice.length === 1 && usdtFilteredPrice.length === 1) {
      isPriceLoading = false;
      let ethPrice = parseFloat(ethFilteredPrice[0].price);
      let usdtPrice = parseFloat(usdtFilteredPrice[0].price);

      balanceOnEthereumSum = 0;
      balanceOnEthereumEstimatedValue = 0;
      balanceOnExchangeSum = 0;
      balanceOnExchangeSumEstimatedValue = 0;

      // Layer-1 Balance
      for (var key in this.props.balanceOnEthereumDict) {
        const balanceOnExchange = Number(
          this.props.balanceOnEthereumDict[key].toString().replace(/,/g, '')
        );
        const filteredPrice = prices.filter((price) => price.symbol === key);
        // If price is not found, set values to null
        if (filteredPrice.length === 1 || key === 'DAI') {
          let price = 0;
          // https://api.loopring.io/api/v1/price doesn't return DAI price
          if (key === 'DAI') {
            price = usdtPrice;
          } else {
            price = parseFloat(filteredPrice[0].price);
          }

          balanceOnEthereumEstimatedValue =
            balanceOnEthereumEstimatedValue + balanceOnExchange * price;
        }

        if (key.includes('-') && this.props.ammMarkets) {
          const ammMarket = this.props.ammMarkets.find((ammMarket) => {
            const poolTokenConf1 = config.getTokenByTokenId(
              ammMarket.poolTokenId,
              tokens
            );
            return poolTokenConf1.symbol === key;
          });
          if (ammMarket) {
            const lpTokenPrice = getLpTokenPrice(
              ammMarket,
              ammMarket.snapshot,
              tokens,
              prices
            );
            balanceOnEthereumEstimatedValue =
              balanceOnEthereumEstimatedValue +
              balanceOnExchange * lpTokenPrice;
          }
        }
      }

      if (balanceOnEthereumEstimatedValue && ethPrice > 0) {
        balanceOnEthereumSum = balanceOnEthereumEstimatedValue / ethPrice;
      }

      // Layer-2 Balance
      for (let i = 0; i < this.props.balances.length; i++) {
        const balance = this.props.balances[i];
        const filteredPrice = prices.filter(
          (price) => price.symbol === balance.token.symbol
        );

        // If price is not found, set values to null
        if (filteredPrice.length === 1 || balance.token.symbol === 'DAI') {
          let price = 0;
          // https://api.loopring.io/api/v1/price doesn't return DAI price
          if (balance.token.symbol === 'DAI') {
            price = usdtPrice;
          } else {
            price = parseFloat(filteredPrice[0].price);
          }

          balanceOnExchangeSumEstimatedValue =
            balanceOnExchangeSumEstimatedValue +
            Number(balance.totalAmountInString.toString().replace(/,/g, '')) *
              price;
        }

        if (balance.token.symbol.includes('-') && this.props.ammMarkets) {
          const ammMarket = this.props.ammMarkets.find(
            (ammMarket) => ammMarket.poolTokenId === balance.tokenId
          );
          if (ammMarket) {
            const lpTokenPrice = getLpTokenPrice(
              ammMarket,
              ammMarket.snapshot,
              tokens,
              prices
            );
            balanceOnExchangeSumEstimatedValue =
              balanceOnExchangeSumEstimatedValue +
              Number(balance.totalAmountInString.toString().replace(/,/g, '')) *
                lpTokenPrice;
          }
        }
      }

      if (balanceOnExchangeSumEstimatedValue && ethPrice > 0) {
        balanceOnExchangeSum = balanceOnExchangeSumEstimatedValue / ethPrice;
      }
    }

    return {
      isPriceLoading,
      balanceOnEthereumSum,
      balanceOnEthereumEstimatedValue,
      balanceOnExchangeSum,
      balanceOnExchangeSumEstimatedValue,
    };
  }

  toSumDisplay(isBalancesLoading, isPriceLoading, title, sum, estimatedValue) {
    if (
      isBalancesLoading ||
      isPriceLoading ||
      sum === null ||
      estimatedValue === null
    ) {
      return (
        <BalanceHeaderEstimatedValue
          title={title}
          isLoading={true}
          sum={''}
          estimatedValue={''}
        />
      );
    } else {
      let sumDipslay = `${fm.numberWithCommas(sum.toFixed(3))} ETH`;
      let legalPrefix = this.props.legalPrice.legalPrefix;
      let estimatedValueDisplay = `${legalPrefix}${fm.numberWithCommas(
        estimatedValue.toFixed(2)
      )}`;

      return (
        <BalanceHeaderEstimatedValue
          title={title}
          isLoading={false}
          sum={sumDipslay}
          estimatedValue={estimatedValueDisplay}
        />
      );
    }
  }

  render() {
    const estimatedValues = this.getEstimatedValues();

    return (
      <LargeTableHeader>
        <Row gutter={8}>
          <Col span={5}>
            {this.toSumDisplay(
              this.props.isBalancesLoading,
              estimatedValues.isPriceLoading,
              'Estimated Total Value',
              estimatedValues.balanceOnEthereumSum +
                estimatedValues.balanceOnExchangeSum,
              estimatedValues.balanceOnEthereumEstimatedValue +
                estimatedValues.balanceOnExchangeSumEstimatedValue
            )}
          </Col>
          <Col
            style={{
              maxWidth: '20px',
            }}
          >
            <FontAwesomeIcon
              style={{
                color: this.props.theme.textDim,
                minHeight: '100%',
              }}
              icon={faEquals}
            />
          </Col>
          <Col span={5}>
            {this.toSumDisplay(
              this.props.isBalancesLoading,
              estimatedValues.isPriceLoading,
              'Estimated Value on Ethereum',
              estimatedValues.balanceOnEthereumSum,
              estimatedValues.balanceOnEthereumEstimatedValue
            )}
          </Col>
          <Col
            style={{
              maxWidth: '20px',
            }}
          >
            <FontAwesomeIcon
              style={{
                color: this.props.theme.textDim,
                minHeight: '100%',
              }}
              icon={faPlus}
            />
          </Col>
          <Col span={5}>
            {this.toSumDisplay(
              false,
              estimatedValues.isPriceLoading,
              'Estimated Value on Loopring',
              estimatedValues.balanceOnExchangeSum,
              estimatedValues.balanceOnExchangeSumEstimatedValue
            )}
          </Col>
        </Row>
      </LargeTableHeader>
    );
  }
}

const mapStateToProps = (state) => {
  const { legalPrice, ammMarkets, exchange } = state;
  return {
    legalPrice,
    ammMarkets: ammMarkets.ammMarkets,
    tokens: exchange.tokens,
  };
};

export default withTheme(connect(mapStateToProps, null)(BalanceHeader));
