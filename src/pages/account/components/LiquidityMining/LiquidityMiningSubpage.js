import { connect } from "react-redux";
import I from "components/I";
import React from "react";
import styled, { withTheme } from "styled-components";

import LiquidityMiningTable from "./LiquidityMiningTable";

import { compareDexAccounts } from "components/services/utils";
import { getLiquidityMiningRank } from "lightcone/api/LiquidityMiningAPI";
import { updateLiquidityMiningRank } from "redux/actions/LiquidityMining";

const MarketLabel = styled.div`
  color: ${(props) => props.theme.textBright};
  font-size: 0.9rem;
  font-weight: 600;
  padding-bottom: 10px;
`;

class LiquidityMiningSubpage extends React.Component {
  state = {
    rewards: [],
  };

  componentDidMount() {
    if (this.props.market in this.props.liquidityMining.rewardCollection) {
      let rewards = this.props.liquidityMining.rewardCollection[
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
    return (
      <div>
        <MarketLabel>
          <I s="Total Ranking" />: {this.props.market}
        </MarketLabel>
        <LiquidityMiningTable
          market={this.props.market}
          data={this.state.rewards}
          length={this.state.rewards.length}
          placeHolder={"NoRankingData"}
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
