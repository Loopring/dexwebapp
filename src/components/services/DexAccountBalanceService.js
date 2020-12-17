import { connect } from 'react-redux';
import React from 'react';

import { compareDexAccounts } from './utils';
import { fetchMyAccountPage } from 'redux/actions/MyAccountPage';

import { LOGGED_IN } from 'redux/actions/DexAccount';

class DexAccountBalanceService extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.dexAccount &&
      prevProps.dexAccount.account &&
      this.props.dexAccount &&
      this.props.dexAccount.account &&
      this.props.dexAccount.account.accountId &&
      compareDexAccounts(prevProps.dexAccount, this.props.dexAccount) ===
        false &&
      this.props.dexAccount.account.apiKey &&
      this.props.dexAccount.account.state === LOGGED_IN
    ) {
      this.props.fetchMyAccountPage(
        this.props.dexAccount.account.accountId,
        this.props.dexAccount.account.apiKey,
        this.props.tokens
      );
    }
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, exchange } = state;
  return { dexAccount, tokens: exchange.tokens };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMyAccountPage: (accountId, apiKey, tokens) =>
      dispatch(fetchMyAccountPage(accountId, apiKey, tokens)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DexAccountBalanceService);
