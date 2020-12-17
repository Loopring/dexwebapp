import { connect } from 'react-redux';
import { withTheme } from 'styled-components';

import { debounce } from 'lodash';

import React from 'react';

import { compareDexAccounts } from 'components/services/utils';
import { getLiquidityMining } from 'lightcone/api/LiquidityMiningAPI';
import { updateLiquidityMiningMyRewardTablePagination } from 'redux/actions/LiquidityMining';
import LiquidityMiningMyRewardTable from './LiquidityMiningMyRewardTable';
import config from 'lightcone/config';

class LiquidityMiningMyRewardPage extends React.Component {
  state = {
    rewards: [],
  };

  componentDidMount() {
    if (
      this.props.market in this.props.liquidityMining.myRewardTablePaginations
    ) {
      let pagination = this.props.liquidityMining.myRewardTablePaginations[
        this.props.market
      ];
      this.setState({
        pagination,
      });
    }
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
        let rewards = await getLiquidityMining(
          this.props.market,
          this.props.dexAccount.account.accountId,
          this.props.dexAccount.account.apiKey,
          this.props.exchange.tokens
        );

        this.setState({
          rewards,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, 1000);

  onChange = (page) => {
    const pagination = {
      current: page,
    };
    this.props.updateLiquidityMiningMyRewardTablePagination(
      this.props.market,
      pagination
    );
  };

  render() {
    const limit = 10;

    let current = 1;
    if (
      this.props.market in this.props.liquidityMining.myRewardTablePaginations
    ) {
      let pagination = this.props.liquidityMining.myRewardTablePaginations[
        this.props.market
      ];
      current = pagination.current ? pagination.current : 1;
    }
    const startIndex = (current - 1) * limit;
    const endIndex = current * limit;
    const data = this.state.rewards.slice(startIndex, endIndex);

    const tokens = this.props.exchange.tokens;
    const tokenId = this.props.config.tokenId;
    const token = config.getTokenByTokenId(tokenId, tokens);
    const quoteToken = token ? token.symbol : 'USDT';

    return (
      <div>
        <LiquidityMiningMyRewardTable
          total={this.state.rewards.length}
          limit={limit}
          current={current}
          market={this.props.market}
          quoteToken={quoteToken}
          data={data}
          placeHolder={'No rewards yet'}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, exchange, liquidityMining } = state;
  return { dexAccount, exchange, liquidityMining };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLiquidityMiningMyRewardTablePagination: (market, pagination) =>
      dispatch(
        updateLiquidityMiningMyRewardTablePagination(market, pagination)
      ),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(LiquidityMiningMyRewardPage)
);
