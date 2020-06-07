import { connect } from "react-redux";
import styled, { withTheme } from "styled-components";

import { debounce } from "lodash";
import I from "components/I";
import React from "react";

import { compareDexAccounts } from "components/services/utils";
import { getLiquidityMining } from "lightcone/api/LiquidityMiningAPI";
import { updateLiquidityMiningMyRewardTablePagination } from "redux/actions/LiquidityMining";
import LiquidityMiningMyRewardTable from "./LiquidityMiningMyRewardTable";

const MarketLabel = styled.div`
  color: ${(props) => props.theme.textBright};
  font-size: 0.9rem;
  font-weight: 600;
  padding-bottom: 10px;
`;

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

    return (
      <div>
        <MarketLabel>
          <I s="Rewards" />: {this.props.market}
        </MarketLabel>
        <LiquidityMiningMyRewardTable
          total={this.state.rewards.length}
          limit={limit}
          current={current}
          market={this.props.market}
          data={data}
          placeHolder={"No rewards yet"}
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
