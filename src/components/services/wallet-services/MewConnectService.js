import { connect } from "react-redux";
import { withTheme } from "styled-components";
import I from "components/I";

import React, { Component } from "react";

import {
  WALLET_UNCONNECTED,
  getDataFromLocalStorage,
  updateAccount,
} from 'redux/actions/DexAccount';
import {
  connectToMewConnect,
  connectToMewConnectComplete,
} from "redux/actions/MewConnect";
import {
  emptyBalances,
  emptyDeposits,
  emptyWithdrawals,
} from "redux/actions/MyAccountPage";
import {
  emptyMyHistoryOrders,
  emptyMyOpenOrders,
} from 'redux/actions/MyOrders';

import {
  emptyAllHistoryOrders,
  emptyAllOpenOrders,
  emptyUserTransactions,
} from "redux/actions/MyOrderPage";

import { fetchGasPrice } from "redux/actions/GasPrice";
import { fetchNonce } from "redux/actions/Nonce";

import {
  loginModal,
  registerAccountModal,
  showConnectToWalletModal,
} from "redux/actions/ModalManager";
import { updateBlockNum } from "redux/actions/NotifyCenter";

import { notifyError } from "redux/actions/Notification";
import Wallet from "lightcone/wallet";

import { saveWalletType } from "lightcone/api/localStorgeAPI";
import MewConnect from "@myetherwallet/mewconnect-web-client";
// import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import Web3 from "web3";

class MewConnectService extends Component {
  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.mewConnect.startConnecting === true &&
      prevProps.mewConnect.startConnecting !==
        this.props.mewConnect.startConnecting &&
      prevProps.mewConnect.referenceCount !==
        this.props.mewConnect.referenceCount
    ) {
      this.createMewConnect();
    }
  }

  createMewConnect = () => {
    console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'); // todo remove dev item
    (async () => {
      // Create WalletConnect Provider
      const infuraIds = [
        //ruby
        "fe378e2b7c4a4a19a33b39eadbcb040b",
        "eaaac3c8409a409f994a728b65d81a1e",
        "7e88216fe37e4b378cf1e72ba7e63df2",
        // kongliang
        "a06ed9c6b5424b61beafff27ecc3abf3",
        //yadong
        "3a8799da14724660ab4ca4b62c705b28",
        "833427e71c094c4fa31d42f93fc87ba3",
        "cb6df97bcec24e7dbd67f384e65cf4db",
      ];
      const randomIndex = Math.floor(Math.random() * 7);
      const infuraId = infuraIds[randomIndex];
      const mewConnect = new MewConnect.Provider({
        infuraId, // Required
      });
      const provider = mewConnect.makeWeb3Provider();
      let accounts;
      let connecting = false;
      provider.on("disconnected", (error, payload) => {
        // disconnect can be also triggered from other places.
        if (connecting) {
          console.log("disconnect", error, payload);
          this.props.connectToMewConnectComplete();
          notifyError(
            <I s="Failed to connect to MEWconnect!" />,
            this.props.theme
          );
          this.props.showConnectToWalletModal(true);
        }
      });

      //  Enable session (triggers QR Code modal)
      try {
        connecting = true;
        accounts = await provider.enable();
        connecting = false;
      } catch (e) {
        connecting = false;
        // If user close QA code modal
        this.props.connectToMewConnectComplete();
        await provider.close();
        return;
      }

      //  Create Web3
      const web3 = new Web3(provider);
      window.web3 = web3;

      // Assign use window.ethereum
      window.ethereum = provider;

      window.wallet = new Wallet(
        "MewConnect",
        window.web3,
        accounts[0]
      );

      this.props.updateAccount({
        ...this.props.dexAccount.account,
        state: WALLET_UNCONNECTED,
      });

      this.setupSubscribe();

      saveWalletType("MewConnect");

      // Set state
      this.props.getDataFromLocalStorage(window.wallet.address);

      this.props.connectToMewConnectComplete();

      // Get related info
      this.props.fetchNonce(window.wallet.address);
      this.props.fetchGasPrice();
    })();
  };

  setupSubscribe() {
    // Subscribe to accounts change
    window.ethereum.on("accountsChanged", (accounts) => {
      this.props.connectToMewConnect(true);
    });

    // Subscribe to chainId change
    window.ethereum.on("chainChanged", (chainId) => {
      this.props.connectToMewConnect(true);
    });

    // Subscribe to networkId change
    window.ethereum.on("networkChanged", (networkId) => {
      this.props.connectToMewConnect(true);
    });

    // Subscribe to session connection/open
    window.ethereum.on("open", () => {
      console.log("open");
    });

    // Subscribe to session disconnection/close
    window.ethereum.on("close", (code, reason) => {
      console.log("WalletConnect", code, reason);
    });
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, mewConnect, exchange } = state;
  return { dexAccount, mewConnect, exchange };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectToMewConnect: (startConnecting) =>
      dispatch(connectToMewConnect(startConnecting)),
    connectToMewConnectComplete: () =>
      dispatch(connectToMewConnectComplete()),
    showConnectToWalletModal: (show) =>
      dispatch(showConnectToWalletModal(show)),
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
  connect(mapStateToProps, mapDispatchToProps)(MewConnectService)
);
