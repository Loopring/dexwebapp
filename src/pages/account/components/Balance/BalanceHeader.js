import { Col, Row } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LargeTableHeader } from 'styles/Styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { faEquals } from '@fortawesome/free-solid-svg-icons/faEquals';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { withTheme } from 'styled-components';
import BalanceHeaderEstimatedValue from 'pages/account/components/Balance/BalanceHeaderEstimatedValue';
import React from 'react';

class BalanceHeader extends React.PureComponent {
  getEstimatedValues() {
    let isPriceLoading = true;
    let balanceonEthereumSum = null;
    let balanceonEthereumEstimatedValue = null;

    let balanceOnExchangeSum = null;
    let balanceOnExchangeSumEstimatedValue = null;

    // Prices
    const { prices } = this.props.legalPrice;

    // Base units are ETH and USDT prices
    let ethFilteredPrice = prices.filter((price) => price.symbol === 'ETH');
    let usdtFilteredPrice = prices.filter((price) => price.symbol === 'USDT');
    if (ethFilteredPrice.length === 1 && usdtFilteredPrice.length === 1) {
      isPriceLoading = false;
      let ethPrice = parseFloat(ethFilteredPrice[0].price);
      let usdtPrice = parseFloat(usdtFilteredPrice[0].price);

      balanceonEthereumSum = 0;
      balanceonEthereumEstimatedValue = 0;
      balanceOnExchangeSum = 0;
      balanceOnExchangeSumEstimatedValue = 0;

      // Layer-1 Balance
      for (var key in this.props.balanceOnEthereumDict) {
        const balanceOnExchange = this.props.balanceOnEthereumDict[key];
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

          balanceonEthereumEstimatedValue =
            balanceonEthereumEstimatedValue +
            parseFloat(balanceOnExchange) * price;
        }
      }

      if (balanceonEthereumEstimatedValue && ethPrice > 0) {
        balanceonEthereumSum = balanceonEthereumEstimatedValue / ethPrice;
      }

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
            parseFloat(balance.totalAmountInString) * price;
        }
      }

      if (balanceOnExchangeSumEstimatedValue && ethPrice > 0) {
        balanceOnExchangeSum = balanceOnExchangeSumEstimatedValue / ethPrice;
      }
    }

    return {
      isPriceLoading,
      balanceonEthereumSum,
      balanceonEthereumEstimatedValue,
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
      let sumDipslay = `${sum.toFixed(3)} ETH`;
      let legalPrefix = this.props.legalPrice.legalPrefix;
      let estimatedValueDisplay = `${legalPrefix}${estimatedValue.toFixed(2)}`;

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
              estimatedValues.balanceonEthereumSum +
                estimatedValues.balanceOnExchangeSum,
              estimatedValues.balanceonEthereumEstimatedValue +
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
              estimatedValues.balanceonEthereumSum,
              estimatedValues.balanceonEthereumEstimatedValue
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
  const { legalPrice } = state;
  return { legalPrice };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(BalanceHeader)
);
