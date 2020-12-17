import { Col, Row } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LargeTableHeader } from 'styles/Styles';
import { bindActionCreators } from 'redux';
import { compareDexAccounts } from 'components/services/utils';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { faEquals } from '@fortawesome/free-solid-svg-icons/faEquals';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { getCommissionRewardTotal } from 'lightcone/api/CommissionRewardAPI';
import { getLiquidityMiningTotal } from 'lightcone/api/LiquidityMiningAPI';
import { withTheme } from 'styled-components';
import BalanceHeaderEstimatedValue from 'pages/account/components/Balance/BalanceHeaderEstimatedValue';
import React from 'react';

class Header extends React.PureComponent {
  state = {
    isTotalRewardsLoading: true,
    totalRewards: [],
  };

  componentDidMount() {
    if (
      this.props.exchange.isInitialized &&
      !!this.props.dexAccount.account.accountId &&
      !!this.props.dexAccount.account.accountKey &&
      this.props.dexAccount.account.apiKey
    ) {
      this.loadData();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (this.props.exchange.isInitialized !== prevProps.exchange.isInitialized ||
        !compareDexAccounts(prevProps.dexAccount, this.props.dexAccount)) &&
      !!this.props.dexAccount.account.accountId &&
      !!this.props.dexAccount.account.accountKey &&
      this.props.dexAccount.account.apiKey
    ) {
      this.loadData();
    }
  }

  loadData = debounce(() => {
    (async () => {
      try {
        let totalRewards = [];
        if (this.props.type === 'liquidity-mining') {
          totalRewards = await getLiquidityMiningTotal(
            this.props.dexAccount.account.accountId,
            this.props.dexAccount.account.apiKey,
            this.props.exchange.tokens
          );
        } else if (this.props.type === 'commission-reward') {
          totalRewards = await getCommissionRewardTotal(
            this.props.dexAccount.account.accountId,
            this.props.dexAccount.account.apiKey,
            this.props.exchange.tokens
          );
        }
        this.setState({
          isTotalRewardsLoading: false,
          totalRewards,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, 1000);

  getEstimatedValues(totalRewards) {
    let isPriceLoading = true;
    let rewardIssued = null;
    let rewardIssuedEstimatedValue = null;

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

      rewardIssued = 0;
      rewardIssuedEstimatedValue = 0;
      balanceOnExchangeSum = 0;
      balanceOnExchangeSumEstimatedValue = 0;

      for (let i = 0; i < totalRewards.length; i++) {
        const balance = this.state.totalRewards[i];
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

          rewardIssuedEstimatedValue =
            rewardIssuedEstimatedValue + parseFloat(balance.issued) * price;

          balanceOnExchangeSumEstimatedValue =
            balanceOnExchangeSumEstimatedValue +
            parseFloat(balance.amount) * price;
        }
      }

      if (balanceOnExchangeSumEstimatedValue && ethPrice > 0) {
        rewardIssued = rewardIssuedEstimatedValue / ethPrice;
        balanceOnExchangeSum = balanceOnExchangeSumEstimatedValue / ethPrice;
      }
    }

    return {
      isPriceLoading,
      rewardIssued,
      rewardIssuedEstimatedValue,
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
      let sumDipslay = `${sum.toFixed(6)} ETH`;
      let legalPrefix = this.props.legalPrice.legalPrefix;
      let estimatedValueDisplay = `${legalPrefix}${estimatedValue.toFixed(8)}`;

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
    if (
      !!this.props.dexAccount.account.accountId &&
      !!this.props.dexAccount.account.accountKey &&
      this.props.dexAccount.account.apiKey
    ) {
      const estimatedValues = this.getEstimatedValues(this.state.totalRewards);

      return (
        <LargeTableHeader>
          <Row gutter={8}>
            <Col
              span={5}
              style={{
                minWidth: '200px',
              }}
            >
              {this.toSumDisplay(
                this.state.isTotalRewardsLoading,
                estimatedValues.isPriceLoading,
                'My Total Rewards',
                estimatedValues.balanceOnExchangeSum,
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
            <Col
              span={5}
              style={{
                minWidth: '200px',
              }}
            >
              {this.toSumDisplay(
                this.state.isTotalRewardsLoading,
                estimatedValues.isPriceLoading,
                'My Distributed Rewards',
                estimatedValues.rewardIssued,
                estimatedValues.rewardIssuedEstimatedValue
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
            <Col
              span={5}
              style={{
                minWidth: '200px',
              }}
            >
              {this.toSumDisplay(
                this.state.isTotalRewardsLoading,
                estimatedValues.isPriceLoading,
                'My Pending Rewards',
                estimatedValues.balanceOnExchangeSum -
                  estimatedValues.rewardIssued,
                estimatedValues.balanceOnExchangeSumEstimatedValue -
                  estimatedValues.rewardIssuedEstimatedValue
              )}
            </Col>
          </Row>
        </LargeTableHeader>
      );
    } else {
      return <div />;
    }
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, exchange, legalPrice } = state;
  return { dexAccount, exchange, legalPrice };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(Header));
