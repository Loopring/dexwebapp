import { connect } from 'react-redux';
import {
  fetchDeposits,
  fetchTransfers,
  fetchWithdrawals,
} from 'redux/actions/MyAccountPage';
import React from 'react';

import { compareDexAccounts } from 'components/services/utils';
import { debounce } from 'lodash';
import {
  getDistributeInfo,
  updateDistributeHash,
} from 'lightcone/api/v1/onchainwithdrawal';
import { notifyError, notifySuccess } from 'redux/actions/Notification';
import { withTheme } from 'styled-components';
import DepositBaseTable from 'pages/account/components/DepositWithdrawal/DepositTable';
import DepositWithdrawalHeader from 'pages/account/components/DepositWithdrawalHeader';
import I from 'components/I';
import TransferTable from 'pages/account/components/DepositWithdrawal/TransferTable';
import WithdrawalTable from 'pages/account/components/DepositWithdrawal/WithdrawalTable';

class DepositWithdrawalTable extends React.Component {
  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.exchange.isInitialized !== this.props.exchange.isInitialized
    ) {
      console.log('trigger by exchange.isInitialized');
      this.loadDataWithDebounce();
    }

    if (
      this.props.dexAccount &&
      this.props.dexAccount.account &&
      this.props.dexAccount.account.accountId &&
      (compareDexAccounts(prevProps.dexAccount, this.props.dexAccount) ===
        false ||
        (prevProps.dexAccount.account &&
          prevProps.dexAccount.account.apiKey !==
            this.props.dexAccount.account.apiKey))
    ) {
      console.log('trigger by account');
      this.loadDataWithDebounce();
    }

    if (prevProps.tabs.type4 !== this.props.tabs.type4) {
      this.loadDataWithDebounce();
    }

    if (prevProps.balances.tokenFilter !== this.props.balances.tokenFilter) {
      this.loadDataWithDebounce();
    }

    // Load data if needed
    if (
      this.props.type === 'deposit' &&
      this.props.balances.deposits.find(
        (deposit) =>
          deposit.status === 'received' || deposit.status === 'processing'
      )
    ) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => this.loadData(), 30000);
    }

    if (
      this.props.type === 'withdrawals' &&
      this.props.balances.withdrawals.find(
        (w) => w.status === 'received' || w.status === 'processing'
      )
    ) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => this.loadData(), 30000);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  loadData = (offset = -1) => {
    try {
      const {
        dexAccount,
        exchange,
        balances,
        fetchDeposits,
        fetchWithdrawals,
        fetchTransfers,
      } = this.props;
      if (
        !!dexAccount.account.accountId &&
        !!dexAccount.account.accountKey &&
        dexAccount.account.apiKey
      ) {
        // If All, tokenSymbol is undefined.
        let tokenSymbol;
        if (balances.tokenFilter !== 'All') {
          tokenSymbol = balances.tokenFilter;
        }

        if (this.props.type === 'transfer') {
          fetchTransfers(
            balances.transferLimit,
            offset !== -1 ? offset : balances.transferOffset,
            dexAccount.account.accountId,
            tokenSymbol,
            dexAccount.account.apiKey,
            exchange.tokens
          );
        } else if (this.props.type === 'deposit') {
          fetchDeposits(
            balances.depositLimit,
            offset !== -1 ? offset : balances.depositOffset,
            dexAccount.account.accountId,
            tokenSymbol,
            dexAccount.account.apiKey,
            exchange.tokens
          );
        } else if (this.props.type === 'withdrawals') {
          fetchWithdrawals(
            balances.withdrawalLimit,
            offset !== -1 ? offset : balances.withdrawalOffset,
            dexAccount.account.accountId,
            tokenSymbol,
            dexAccount.account.apiKey,
            exchange.tokens
          );
        }
      } else {
        // console.log('no key...');
      }
    } catch (err) {}
  };

  loadDataWithDebounce = debounce((offset = -1) => {
    this.loadData(offset);
  }, 1000);

  onChange = (page) => {
    let offset = 0;
    if (this.props.type === 'transfer') {
      offset = this.props.balances.transferLimit * (page - 1);
    } else if (this.props.type === 'deposit') {
      offset = this.props.balances.depositLimit * (page - 1);
    } else if (this.props.type === 'withdrawals') {
      offset = this.props.balances.withdrawalLimit * (page - 1);
    }

    this.loadData(offset);

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  };

  claim = (id) => {
    const { exchangeAddress, nonce, account, gasPrice, chainId } = this.props;
    (async () => {
      try {
        const info = await getDistributeInfo(id, account.apiKey);
        const result = await window.wallet.claimWithdrawal(
          exchangeAddress,
          chainId,
          nonce,
          gasPrice,
          info.blockIndex,
          info.slotIndex,
          true
        );
        const signed = window.wallet.signUpdateDistributeHash({
          requestId: id,
          txHash: result,
        });
        await updateDistributeHash(
          id,
          result,
          account.publicKeyX,
          account.publicKeyY,
          signed
        );

        notifySuccess(
          <I s="ClaimInstructionNotification" />,
          this.props.theme,
          15
        );
      } catch (e) {
        console.error(e);
        notifyError(
          <I s="ClaimInstructionNotificationFailed" />,
          this.props.theme
        );
      }
    })();
  };

  render() {
    const { type, balances, exchange } = this.props;
    let data;
    let total;
    let limit;
    let current;
    let loading;

    if (type === 'transfer') {
      data = balances.transfers;
      total = balances.transferTotalNum;
      limit = balances.transferLimit;
      current = Math.floor(balances.transferOffset / limit) + 1;
      loading = balances.isTransfersLoading;
      return (
        <div>
          <DepositWithdrawalHeader type={type} />
          <TransferTable
            placeHolder="NoTransfers"
            data={data}
            total={total}
            limit={limit}
            current={current}
            onChange={this.onChange}
            loading={!exchange.isInitialized || loading}
          />
        </div>
      );
    } else if (type === 'deposit') {
      data = balances.deposits;
      total = balances.depositTotalNum;
      limit = balances.depositLimit;
      current = Math.floor(balances.depositOffset / limit) + 1;
      loading = balances.isDepositsLoading;
      return (
        <div>
          <DepositWithdrawalHeader type={type} />
          <DepositBaseTable
            placeHolder="NoDeposits"
            data={data}
            total={total}
            limit={limit}
            current={current}
            onChange={this.onChange}
            loading={!exchange.isInitialized || loading}
          />
        </div>
      );
    } else if (this.props.type === 'withdrawals') {
      data = balances.withdrawals;
      total = balances.withdrawalTotalNum;
      limit = balances.withdrawalLimit;
      current = Math.floor(balances.withdrawalOffset / limit) + 1;
      loading = balances.isWithdrawalsLoading;
      return (
        <div>
          <DepositWithdrawalHeader type={type} />
          <WithdrawalTable
            placeHolder="NoWithdrawals"
            data={data}
            total={total}
            limit={limit}
            current={current}
            onChange={this.onChange}
            loading={!exchange.isInitialized || loading}
            claim={this.claim}
          />
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, balances, tabs, exchange, nonce, gasPrice } = state;
  return {
    dexAccount,
    balances,
    tabs,
    chainId: exchange.chainId,
    exchange,
    exchangeAddress: exchange.exchangeAddress,
    account: dexAccount.account,
    nonce: nonce.nonce,
    gasPrice: gasPrice.gasPrice,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchDeposits: (limit, offset, accountId, tokenSymbol, apiKey, tokens) =>
      dispatch(
        fetchDeposits(limit, offset, accountId, tokenSymbol, apiKey, tokens)
      ),
    fetchWithdrawals: (limit, offset, accountId, tokenSymbol, apiKey, tokens) =>
      dispatch(
        fetchWithdrawals(limit, offset, accountId, tokenSymbol, apiKey, tokens)
      ),
    fetchTransfers: (limit, offset, accountId, tokenSymbol, apiKey, tokens) =>
      dispatch(
        fetchTransfers(limit, offset, accountId, tokenSymbol, apiKey, tokens)
      ),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(DepositWithdrawalTable)
);
