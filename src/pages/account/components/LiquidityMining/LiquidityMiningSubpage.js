import { connect } from 'react-redux';

import { withTheme } from 'styled-components';
import React from 'react';

import LiquidityMiningTable from './LiquidityMiningTable';

import { compareDexAccounts } from 'components/services/utils';
import { getLiquidityMiningRank } from 'lightcone/api/LiquidityMiningAPI';
import { updateLiquidityMiningRank } from 'redux/actions/LiquidityMining';
import config from 'lightcone/config';

class LiquidityMiningSubpage extends React.Component {
  state = {
    rewards: [],
  };

  componentDidMount() {
    if (this.props.exchange.isInitialized) {
      this.loadData();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.exchange.isInitialized !== prevProps.exchange.isInitialized ||
      !compareDexAccounts(prevProps.dexAccount, this.props.dexAccount)
    ) {
      this.loadData();
    }
  }

  loadData() {
    (async () => {
      try {
        let rewards = await getLiquidityMiningRank(
          this.props.market,
          20,
          this.props.exchange.tokens
        );
        this.props.updateLiquidityMiningRank(this.props.market, rewards);
        this.setState({
          rewards,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }

  render() {
    const tokens = this.props.exchange.tokens;
    const tokenId = this.props.config.tokenId;
    const token = config.getTokenByTokenId(tokenId, tokens);
    const quoteToken = token ? token.symbol : 'USDT';

    return (
      <div>
        <LiquidityMiningTable
          market={this.props.market}
          quoteToken={quoteToken}
          data={this.state.rewards}
          length={this.state.rewards.length}
          placeHolder={'NoRankingData'}
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
    updateLiquidityMiningRank: (market, rewards) =>
      dispatch(updateLiquidityMiningRank(market, rewards)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(LiquidityMiningSubpage)
);
