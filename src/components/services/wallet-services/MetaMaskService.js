import { connect } from "react-redux";
import { withTheme } from "styled-components";
import I from "components/I";
import React, { Component } from "react";

import {
  WALLET_UNCONNECTED,
  getDataFromLocalStorage,
  updateAccount,
} from "redux/actions/DexAccount";
import {
  connectToMetaMask,
  connectToMetaMaskComplete,
  detectIfMetaMaskInstalled,
} from "redux/actions/MetaMask";
import {
  emptyBalances,
  emptyDeposits,
  emptyWithdrawals,
} from "redux/actions/MyAccountPage";
import {
  emptyMyHistoryOrders,
  emptyMyOpenOrders,
} from "redux/actions/MyOrders";

import {
  emptyAllHistoryOrders,
  emptyAllOpenOrders,
  emptyUserTransactions,
} from "redux/actions/MyOrderPage";

import { fetchGasPrice } from "redux/actions/GasPrice";
import { fetchNonce } from "redux/actions/Nonce";

import { notifyError } from "redux/actions/Notification";
import Wallet from "lightcone/wallet";
import Web3 from "web3";

import { loginModal, registerAccountModal } from "redux/actions/ModalManager";
import { saveWalletType } from "lightcone/api/localStorgeAPI";
import { updateBlockNum } from "redux/actions/NotifyCenter";

class MetaMaskService extends Component {
  componentDidUpdate(prevProps, prevState) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (
      this.props.metaMask.startConnecting === true &&
      prevProps.metaMask.startConnecting !==
        this.props.metaMask.startConnecting &&
      prevProps.metaMask.referenceCount !== this.props.metaMask.referenceCount
    ) {
      this.createMetaMaskConnection();
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe(function (error, success) {});
    }
  }

  createMetaMaskConnection() {
    (async () => {
      try {
        // Web3 is from MetaMask
        // https://web3js.readthedocs.io/en/v1.2.6/web3.html
        // console.log('Web3.givenProvider', Web3.givenProvider);

        const web3 = new Web3(Web3.givenProvider);
        window.web3 = web3;
        // Need to reset etheruem manually.
        // In the implementation, if windown.ethereum is not null,\
        // it will be reset by MetaMask.
        window.ethereum = Web3.givenProvider;

        // console.log('window.web3', window.web3);
        // console.log('window.ethereum', window.ethereum);

        // Enable session
        // The window.ethereum.enable() line actually makes the popup UI request
        // to connect your dApp to MetaMask, and window.web3 becomes the updated version.
        await window.ethereum.enable();
        window.ethereum.autoRefreshOnNetworkChange = false;

        const accounts = await web3.eth.getAccounts();
        window.ethereum.accounts = accounts;

        window.wallet = new Wallet("MetaMask", window.web3, accounts[0]);

        this.props.updateAccount({
          ...this.props.dexAccount.account,
          state: WALLET_UNCONNECTED,
        });

        this.setupSubscribe();

        saveWalletType('MetaMask');

        // Set state
        this.props.getDataFromLocalStorage(accounts[0]);

        this.props.connectToMetaMaskComplete();

        // Get related info
        this.props.fetchNonce(window.wallet.address);
        this.props.fetchGasPrice();
      } catch (err) {
        console.log(err);
        this.props.updateAccount({
          ...this.props.dexAccount.account,
          state: WALLET_UNCONNECTED,
        });
        notifyError(<I s="Failed to connect to MetaMask!" />, this.props.theme);
      }
      // Reset even failed to connect MetaMask
      this.props.connectToMetaMask(false);
    })();
  }

  setupSubscribe() {
    this.subscription = new Web3(window.ethereum).eth
      .subscribe("newBlockHeaders", function (error, result) {})
      .on(
        "data",
        function (blockHeader) {
          if (this.props.metaMask.isDesiredNetwork) {
            this.props.updateBlockNum(blockHeader.number);
          }
        }.bind(this)
      );

    window.ethereum.on("accountsChanged", (accounts) => {
      if (
        !!window.wallet &&
        window.wallet.address &&
        accounts.length > 0 &&
        window.wallet.address.toLowerCase() !== accounts[0].toLowerCase()
      ) {
        this.props.emptyBalances();
        this.props.emptyMyOpenOrders();
        this.props.emptyMyHistoryOrders();
        this.props.emptyUserTransactions();
        this.props.emptyAllOpenOrders();
        this.props.emptyAllHistoryOrders();
        this.props.emptyDeposits();
        this.props.emptyWithdrawals();
        this.props.registerAccountModal(false);
        this.props.showLoginModal(false);
        this.accountChange(accounts[0].toLowerCase());
      }
    });

    window.ethereum.on("networkChanged", (networkVersion) => {
      this.props.connectToMetaMask(true);
    });
  }

  accountChange(address) {
    try {
      window.wallet = new Wallet("MetaMask", window.web3, address);
      this.props.getDataFromLocalStorage(address);

      // Need to re-connect to MetaMask
      this.props.connectToMetaMask(true);

      // Get related info
      this.props.fetchNonce(window.wallet.address);
      this.props.fetchGasPrice();
    } catch (e) {}
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, metaMask, exchange } = state;
  return { dexAccount, metaMask, exchange };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectToMetaMask: (startConnecting) =>
      dispatch(connectToMetaMask(startConnecting)),
    connectToMetaMaskComplete: () => dispatch(connectToMetaMaskComplete()),
    detectIfMetaMaskInstalled: (installed) =>
      dispatch(detectIfMetaMaskInstalled(installed)),
    updateAccount: (account) => dispatch(updateAccount(account)),
    getDataFromLocalStorage: (address) =>
      dispatch(getDataFromLocalStorage(address)),
    fetchNonce: (address) => dispatch(fetchNonce(address)),
    fetchGasPrice: () => dispatch(fetchGasPrice()),
    emptyBalances: () => dispatch(emptyBalances()),
    emptyMyOpenOrders: () => dispatch(emptyMyOpenOrders()),
    emptyMyHistoryOrders: () => dispatch(emptyMyHistoryOrders()),
    emptyUserTransactions: () => dispatch(emptyUserTransactions()),
    registerAccountModal: (show) => dispatch(registerAccountModal(show)),
    showLoginModal: (show) => dispatch(loginModal(show)),
    emptyWithdrawals: () => dispatch(emptyWithdrawals()),
    emptyDeposits: () => dispatch(emptyDeposits()),
    emptyAllOpenOrders: () => dispatch(emptyAllOpenOrders()),
    emptyAllHistoryOrders: () => dispatch(emptyAllHistoryOrders()),
    updateBlockNum: (blockNum) => dispatch(updateBlockNum(blockNum)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(MetaMaskService)
);
