import { connect } from 'react-redux';
import { withTheme } from 'styled-components';
import I from 'components/I';

import React, { Component } from 'react';

import {
  WALLET_UNCONNECTED,
  getDataFromLocalStorage,
  updateAccount,
} from 'redux/actions/DexAccount';
import {
  connectToAuthereum,
  connectToAuthereumComplete,
} from 'redux/actions/Authereum';

import { fetchGasPrice } from 'redux/actions/GasPrice';
import { fetchNonce } from 'redux/actions/Nonce';

import { showConnectToWalletModal } from 'redux/actions/ModalManager';

import { notifyError } from 'redux/actions/Notification';
import Wallet from 'lightcone/wallet';

import { saveWalletType } from 'lightcone/api/localStorgeAPI';
import Authereum from 'authereum';
import Web3 from 'web3';

class AuthereumService extends Component {
  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.authereum.startConnecting === true &&
      prevProps.authereum.startConnecting !==
        this.props.authereum.startConnecting &&
      prevProps.authereum.referenceCount !== this.props.authereum.referenceCount
    ) {
      this.createAuthereum();
    }
  }

  createAuthereum = () => {
    (async () => {
      // Create Authereum Provider
      const authereum = new Authereum();
      const provider = authereum.getProvider();
      let accounts;
      let connecting = false;
      provider.on('disconnected', (error, payload) => {
        // disconnect can be also triggered from other places.
        if (connecting) {
          console.log('disconnect', error, payload);
          this.props.connectToAuthereumComplete();
          notifyError(
            <I s="Failed to connect to Authereum!" />,
            this.props.theme
          );
          this.props.showConnectToWalletModal(true);
        }
      });

      //  Enable session (triggers QR Code modal)
      connecting = true;
      accounts = await provider.enable();
      connecting = false;

      //  Create Web3
      const web3 = new Web3(provider);
      window.web3 = web3;

      // Assign use window.ethereum
      window.ethereum = provider;

      window.wallet = new Wallet('Authereum', window.web3, accounts[0]);

      this.props.updateAccount({
        ...this.props.dexAccount.account,
        state: WALLET_UNCONNECTED,
      });

      this.setupSubscribe();

      saveWalletType('Authereum');

      // Set state
      this.props.getDataFromLocalStorage(window.wallet.address);

      this.props.connectToAuthereumComplete();

      // Get related info
      this.props.fetchNonce(window.wallet.address);
      this.props.fetchGasPrice();
    })();
  };

  setupSubscribe() {
    // Subscribe to accounts change
    window.ethereum.on('accountsChanged', (accounts) => {
      this.props.connectToAuthereum(true);
    });

    // Subscribe to chainId change
    window.ethereum.on('chainChanged', (chainId) => {
      this.props.connectToAuthereum(true);
    });

    // Subscribe to networkId change
    window.ethereum.on('networkChanged', (networkId) => {
      this.props.connectToAuthereum(true);
    });

    // Subscribe to session connection/open
    window.ethereum.on('open', () => {
      console.log('open');
    });

    // Subscribe to session disconnection/close
    window.ethereum.on('close', (code, reason) => {
      console.log('Authereum', code, reason);
    });
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, authereum, exchange } = state;
  return { dexAccount, authereum, exchange };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectToAuthereum: (startConnecting) =>
      dispatch(connectToAuthereum(startConnecting)),
    connectToAuthereumComplete: () => dispatch(connectToAuthereumComplete()),
    showConnectToWalletModal: (show) =>
      dispatch(showConnectToWalletModal(show)),
    updateAccount: (account) => dispatch(updateAccount(account)),
    getDataFromLocalStorage: (address) =>
      dispatch(getDataFromLocalStorage(address)),
    fetchNonce: (address) => dispatch(fetchNonce(address)),
    fetchGasPrice: () => dispatch(fetchGasPrice()),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(AuthereumService)
);
