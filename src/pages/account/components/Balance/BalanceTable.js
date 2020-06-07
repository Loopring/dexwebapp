import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import {
  showDepositModal,
  showTransferModal,
  showWithdrawModal,
} from "redux/actions/ModalManager";
import { withTheme } from "styled-components";
import React from "react";

import {
  DepositOutlineButton,
  TransferOutlineButton,
  WithdrawOutlineButton,
} from "styles/Styles";
import { debounce } from "lodash";
import { fetchWalletBalance } from "modals/components/utils";
import BalanceHeader from "pages/account/components/Balance/BalanceHeader";
import BalanceHeaderNavBar from "pages/account/components/Balance/BalanceHeaderNavBar";
import I from "components/I";
import SimpleTableWidget from "components/SimpleTableWidget";

class BalanceTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      balanceOnEthereumDict: {},
      isBalancesLoading: true,
      searchInput: "",
    };
  }

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
          const { tokens } = this.props;
          const balanceOnEthereumDict = {};
          for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            balanceOnEthereumDict[token.symbol] = await fetchWalletBalance(
              this.props.dexAccount.account.address,
              token.symbol,
              tokens
            );
          }
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
      label: "Asset",
      align: "left",
      width: 240,
      getColValue: (balance) => {
        return (
          <span>
            {balance.token.symbol} - <I s={balance.token.name} />
          </span>
        );
      },
    },
    {
      label: "Balance on Ethereum",
      align: "right",
      getColValue: (balance) => {
        if (this.state.balanceOnEthereumDict[balance.token.symbol]) {
          return this.state.balanceOnEthereumDict[balance.token.symbol];
        } else {
          return (
            <div>
              <FontAwesomeIcon
                style={{
                  width: "14px",
                  height: "14px",
                }}
                color={this.props.theme.textDim}
                icon={faCircleNotch}
                spin={true}
              />
            </div>
          );
        }
      },
    },
    {
      label: "Balance on Loopring",
      align: "right",
      getColValue: (balance) => {
        return balance.totalAmountInString;
      },
    },
    {
      label: "Available Balance",
      align: "right",
      getColValue: (balance) => {
        return <div>{balance.availableInAssetPanel}</div>;
      },
    },
    {
      label: "Operations",
      align: "center",
      getColValue: (balance) => {
        return (
          <div>
            <TransferOutlineButton
              style={{
                marginRight: "8px",
              }}
              onClick={() => {
                this.props.showTransferModal(true, balance.token.symbol);
              }}
            >
              <I s="Transfer" />
            </TransferOutlineButton>
            <DepositOutlineButton
              style={{
                marginRight: "8px",
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
        if (balanceOnEthereum && parseFloat(balanceOnEthereum) > 0) {
          return true;
        }
        return false;
      });
    } else {
      filteredBalances = balances;
    }

    let filteredSearchInputBalances = [];
    if (this.state.searchInput !== "") {
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
