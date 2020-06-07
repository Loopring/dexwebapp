import { connect } from "react-redux";

import { withTheme } from "styled-components";
import React from "react";

class ReferralRewardsPage extends React.Component {
  state = {
    rewards: null,
  };

  render() {
    return <div></div>;
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, exchange } = state;
  return { dexAccount, exchange };
};

export default withTheme(connect(mapStateToProps, null)(ReferralRewardsPage));
