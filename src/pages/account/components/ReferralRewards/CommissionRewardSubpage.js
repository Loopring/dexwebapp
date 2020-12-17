import { connect } from 'react-redux';
import I from 'components/I';
import React from 'react';
import styled, { withTheme } from 'styled-components';

import CommisionRewardMyRewardTable from './CommisionRewardMyRewardTable';

import { compareDexAccounts } from 'components/services/utils';
import { getCommissionRewardRank } from 'lightcone/api/CommissionRewardAPI';
import { updateCommissionRewardRank } from 'redux/actions/CommissionReward';

const MarketLabel = styled.div`
  color: ${(props) => props.theme.textBright};
  font-size: 0.9rem;
  font-weight: 600;
  padding-bottom: 10px;
`;

// Disabled
// No way to show ranking.
class CommissionRewardSubpage extends React.Component {
  state = {
    rewards: [],
  };

  componentDidMount() {
    if (
      this.props.commissionReward &&
      this.props.commissionReward.rewardCollection &&
      this.props.market in this.props.commissionReward.rewardCollection
    ) {
      let rewards = this.props.commissionReward.rewardCollection[
        this.props.market
      ];
      this.setState({
        rewards,
      });
    }
    if (
      this.props.exchange.isInitialized &&
      this.props.dexAccount.account.apiKey
    ) {
      this.loadData();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (this.props.exchange.isInitialized !== prevProps.exchange.isInitialized ||
        !compareDexAccounts(prevProps.dexAccount, this.props.dexAccount)) &&
      this.props.dexAccount.account.apiKey
    ) {
      this.loadData();
    }
  }

  loadData() {
    (async () => {
      try {
        let rewards = await getCommissionRewardRank(
          0,
          'ETH',
          20,
          this.props.exchange.tokens
        );
        this.props.updateCommissionRewardRank(this.props.market, rewards);
        this.setState({
          rewards,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }

  render() {
    return (
      <div>
        <MarketLabel>
          <I s="Total Ranking" />
        </MarketLabel>
        <CommisionRewardMyRewardTable
          market={this.props.market}
          data={this.state.rewards}
          length={this.state.rewards.length}
          placeHolder={'NoRankingData'}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, exchange, commissionReward } = state;
  return { dexAccount, exchange, commissionReward };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCommissionRewardRank: (market, rewards) =>
      dispatch(updateCommissionRewardRank(market, rewards)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(CommissionRewardSubpage)
);
