import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  showDepositModal,
  showTransferModal,
  showWithdrawModal,
} from 'redux/actions/ModalManager';
import { withTheme } from 'styled-components';
import React from 'react';

import * as fm from 'lightcone/common/formatter';
import {
  DepositOutlineButton,
  TransferOutlineButton,
  WithdrawOutlineButton,
} from 'styles/Styles';
import { debounce } from 'lodash';
import { fetchWalletBalance } from 'modals/components/utils';
import BalanceHeader from 'pages/account/components/Balance/BalanceHeader';
import BalanceHeaderNavBar from 'pages/account/components/Balance/BalanceHeaderNavBar';
import I from 'components/I';
import SimpleTableWidget from 'components/SimpleTableWidget';

class BalanceTable extends React.PureComponent {
  state = {
    balanceOnEthereumDict: {},
    isBalancesLoading: true,
    searchInput: '',
  };

  componentDidMount() {
    this.mounted = true;
    this.loadBalanceOnEthereum();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.balances.balances.length !==
        this.props.balances.balances.length ||
      (prevProps.exchange.isInitialized !== this.props.exchange.isInitialized &&
        this.props.exchange.isInitialized) ||
      (this.props.dexAccount.account &&
        this.props.dexAccount.account.address &&
        prevProps.dexAccount.account.address !==
          this.props.dexAccount.account.address)
    ) {
      this.loadBalanceOnEthereum();
    }
  }

  // Have to use other API endpoints to get data
  loadBalanceOnEthereum = debounce(() => {
    const { dexAccount } = this.props;
    if (
      dexAccount.account.address &&
      !!dexAccount.account.accountId &&
      !!dexAccount.account.accountKey &&
      dexAccount.account.apiKey
    ) {
      (async () => {
        try {
          this.setState({
            isBalancesLoading: true,
          });
          const tokens = this.props.tokens.filter((token) => token.enabled);
          const balanceOnEthereumDict = {};
          const walletBalances = await fetchWalletBalance(
            this.props.dexAccount.account.address,
            tokens.map((token) => token.symbol),
            tokens
          );

          walletBalances.forEach((ba) => {
            balanceOnEthereumDict[ba.symbol] = ba.balance;
          });

          if (this.mounted) {
            this.setState({
              balanceOnEthereumDict,
            });
          }
        } catch (error) {
        } finally {
          this.setState({
            isBalancesLoading: false,
          });
        }
      })();
    }
  }, 1000);

  columnBuilders = [
    {
      label: 'Asset',
      align: 'left',
      width: 240,
      getColValue: (balance) => {
        return (
          <span>
            {balance.token.name.split('-').length - 1 >= 2 ? (
              <div>{balance.token.symbol}</div>
            ) : (
              <div>
                {balance.token.symbol} - <I s={balance.token.name} />{' '}
              </div>
            )}
            {balance.token.memo ? '(' : ''}{' '}
            {balance.token.memo ? <I s={balance.token.memo} /> : ''}{' '}
            {balance.token.memo ? ')' : ''}
          </span>
        );
      },
      sortedValue: (balance) => {
        return balance.token.symbol;
      },
      sorter: (a, b) => {
        return a.col_0.props.sortedValue.localeCompare(
          b.col_0.props.sortedValue
        );
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      label: 'Layer-1 Balance',
      align: 'right',
      width: 200,
      sortedValue: (balance) => {
        if (this.state.balanceOnEthereumDict[balance.token.symbol]) {
          return Number(
            this.state.balanceOnEthereumDict[balance.token.symbol]
              .toString()
              .replace(/,/g, '')
          );
        } else {
          return 0;
        }
      },
      sorter: (a, b) => {
        return a.col_1.props.sortedValue !== b.col_1.props.sortedValue
          ? a.col_1.props.sortedValue - b.col_1.props.sortedValue
          : a.col_0.props.sortedValue.localeCompare(b.col_0.props.sortedValue);
      },
      sortDirections: ['ascend', 'descend'],
      getColValue: (balance) => {
        if (this.state.balanceOnEthereumDict[balance.token.symbol]) {
          return fm.numberWithCommas(
            this.state.balanceOnEthereumDict[balance.token.symbol]
          );
        } else {
          return 0;
        }
      },
    },
    {
      label: 'Layer-2 Balance',
      align: 'right',
      width: 220,
      sortedValue: (balance) => {
        return parseFloat(balance.totalAmountInString);
      },
      sorter: (a, b) => {
        return a.col_2.props.sortedValue !== b.col_2.props.sortedValue
          ? a.col_2.props.sortedValue - b.col_2.props.sortedValue
          : a.col_0.props.sortedValue.localeCompare(b.col_0.props.sortedValue);
      },
      sortDirections: ['descend', 'ascend'],
      getColValue: (balance) => {
        return fm.numberWithCommas(balance.totalAmountInString);
      },
    },
    {
      label: 'Available Balance',
      align: 'right',
      width: 200,
      sortedValue: (balance) => {
        return parseFloat(balance.available);
      },
      sorter: (a, b) => {
        return a.col_3.props.sortedValue !== b.col_3.props.sortedValue
          ? a.col_3.props.sortedValue - b.col_3.props.sortedValue
          : a.col_0.props.sortedValue.localeCompare(b.col_0.props.sortedValue);
      },
      sortDirections: ['descend', 'ascend'],
      getColValue: (balance) => {
        return <div>{fm.numberWithCommas(balance.availableInAssetPanel)}</div>;
      },
    },
    {
      label: 'Operations',
      align: 'center',
      sortedValue: (balance) => {
        return balance.token.symbol;
      },
      getColValue: (balance) => {
        return (
          <div>
            <TransferOutlineButton
              style={{
                marginRight: '8px',
              }}
              onClick={() => {
                this.props.showTransferModal(true, balance.token.symbol);
              }}
              disabled={balance.token.transferEnabled !== true}
            >
              <I s="Transfer" />
            </TransferOutlineButton>
            <DepositOutlineButton
              style={{
                marginRight: '8px',
              }}
              onClick={() => {
                this.props.showDepositModal(true, balance.token.symbol);
              }}
              disabled={balance.token.depositEnabled !== true}
            >
              <I s="Deposit" />
            </DepositOutlineButton>
            <WithdrawOutlineButton
              onClick={() => {
                this.props.showWithdrawModal(true, balance.token.symbol);
              }}
            >
              <I s="Withdraw" />
            </WithdrawOutlineButton>
          </div>
        );
      },
    },
  ];

  onSearchInputChange = (value) => {
    this.setState({
      searchInput: value.toLowerCase(),
    });
  };

  render() {
    let { balances } = this.props.balances;
    const tokens = this.props.tokens.filter((token) => token.enabled);
    balances = balances || [];
    balances = tokens.map((token) => {
      const balance = balances.find((ba) => ba.token.tokenId === token.tokenId);
      if (balance) {
        return balance;
      } else {
        return {
          token,
          totalAmountInString: Number(0).toFixed(token.precision),
          available: Number(0).toFixed(token.precision),
          availableInAssetPanel: Number(0).toFixed(token.precision),
        };
      }
    });

    let filteredBalances = [];
    if (
      !this.state.isBalancesLoading &&
      this.props.balances.hideLowBalanceAssets
    ) {
      filteredBalances = balances.filter((balance) => {
        const totalAmount = parseFloat(balance.totalAmountInString);
        if (totalAmount > 0) return true;

        let balanceOnEthereum = this.state.balanceOnEthereumDict[
          balance.token.symbol
        ];
        if (
          balanceOnEthereum &&
          Number(balanceOnEthereum.toString().replace(/,/g, '')) > 0
        ) {
          return true;
        }
        return false;
      });
    } else {
      filteredBalances = balances;
    }

    let filteredSearchInputBalances = [];
    if (this.state.searchInput !== '') {
      filteredSearchInputBalances = filteredBalances.filter((balance) => {
        if (
          balance.token.symbol.toLowerCase().indexOf(this.state.searchInput) ===
          -1
        ) {
          return false;
        } else {
          return true;
        }
      });
    } else {
      filteredSearchInputBalances = filteredBalances;
    }

    return (
      <div>
        <BalanceHeader
          isBalancesLoading={this.state.isBalancesLoading}
          balanceOnEthereumDict={this.state.balanceOnEthereumDict}
          balances={balances}
          tokens={tokens}
        />
        <BalanceHeaderNavBar
          onSearchInputChange={this.onSearchInputChange}
          loading={
            !this.props.exchange.isInitialized || this.state.isBalancesLoading
          }
        />
        <SimpleTableWidget
          margin={20}
          emptyText="NoBalance"
          columnBuilders={this.columnBuilders}
          rowData={filteredSearchInputBalances}
          loading={
            !this.props.exchange.isInitialized || this.state.isBalancesLoading
          }
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, balances, exchange } = state;
  return {
    dexAccount,
    balances,
    exchange,
    tokens: exchange.tokens,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      showTransferModal,
      showDepositModal,
      showWithdrawModal,
    },
    dispatch
  );
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(BalanceTable)
);
