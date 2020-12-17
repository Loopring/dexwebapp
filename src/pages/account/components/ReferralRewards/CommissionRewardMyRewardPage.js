import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import { debounce } from 'lodash';
import I from 'components/I';
import React from 'react';

import { compareDexAccounts } from 'components/services/utils';
import { getCommissionReward } from 'lightcone/api/CommissionRewardAPI';
import { updateCommissionRewardMyRewardTablePagination } from 'redux/actions/CommissionReward';
import CommisionRewardMyRewardTable from './CommisionRewardMyRewardTable';

const MarketLabel = styled.div`
  color: ${(props) => props.theme.textBright};
  font-size: 0.9rem;
  font-weight: 600;
  padding-bottom: 10px;
`;

class CommissionRewardMyRewardPage extends React.Component {
  state = {
    rewards: [],
  };

  componentDidMount() {
    if (
      this.props.market in this.props.commissionReward.myRewardTablePaginations
    ) {
      let pagination = this.props.commissionReward.myRewardTablePaginations[
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
      console.log('start load data');
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
        let rewards = await getCommissionReward(
          this.props.rewardType,
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
    this.props.updateCommissionRewardMyRewardTablePagination(
      this.props.market,
      pagination
    );
  };

  render() {
    const limit = 10;
    let current = 1;
    if (
      this.props.market in this.props.commissionReward.myRewardTablePaginations
    ) {
      let pagination = this.props.commissionReward.myRewardTablePaginations[
        this.props.market
      ];
      current = pagination.current ? pagination.current : 1;
    }
    const startIndex = (current - 1) * limit;
    const endIndex = current * limit;
    const data = this.state.rewards.slice(startIndex, endIndex);

    let rewardTypeDiv = <div></div>;
    if (this.props.rewardType === 1) {
      rewardTypeDiv = <I s="Maker Rewards" />;
    } else if (this.props.rewardType === 2) {
      rewardTypeDiv = <I s="Referral Rewards" />;
    } else if (this.props.rewardType === 3) {
      rewardTypeDiv = <I s="Referee Rewards" />;
    }

    return (
      <div>
        <MarketLabel>{rewardTypeDiv}</MarketLabel>
        <CommisionRewardMyRewardTable
          total={this.state.rewards.length}
          limit={limit}
          current={current}
          market={this.props.market}
          data={data}
          placeHolder={'No rewards yet'}
          onChange={this.onChange}
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
    updateCommissionRewardMyRewardTablePagination: (market, pagination) =>
      dispatch(
        updateCommissionRewardMyRewardTablePagination(market, pagination)
      ),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(CommissionRewardMyRewardPage)
);
