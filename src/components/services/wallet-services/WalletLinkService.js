import { connect } from 'react-redux';
import { withTheme } from 'styled-components';
import { withUserPreferences } from 'components/UserPreferenceContext';

import React, { Component } from 'react';

import {
  WALLET_UNCONNECTED,
  getDataFromLocalStorage,
  updateAccount,
} from 'redux/actions/DexAccount';
import {
  connectToWalletLink,
  connectToWalletLinkComplete,
} from 'redux/actions/WalletLink';

import { fetchGasPrice } from 'redux/actions/GasPrice';
import { fetchNonce } from 'redux/actions/Nonce';

import { showConnectToWalletModal } from 'redux/actions/ModalManager';

import Wallet from 'lightcone/wallet';

import { saveWalletType } from 'lightcone/api/localStorgeAPI';

import WalletLink from 'walletlink';
import Web3 from 'web3';

class WalletLinkService extends Component {
  componentDidUpdate(prevProps, prevState) {
    // Only use referenceCount
    if (
      prevProps.walletLink.referenceCount !==
      this.props.walletLink.referenceCount
    ) {
      this.createConnect();
    }
  }

  createConnect = () => {
    (async () => {
      // Create WalletConnect Provider
      const infuraIds = [
        //ruby
        'fe378e2b7c4a4a19a33b39eadbcb040b',
        'eaaac3c8409a409f994a728b65d81a1e',
        '7e88216fe37e4b378cf1e72ba7e63df2',
        // kongliang
        'a06ed9c6b5424b61beafff27ecc3abf3',
        //yadong
        '3a8799da14724660ab4ca4b62c705b28',
        '833427e71c094c4fa31d42f93fc87ba3',
        'cb6df97bcec24e7dbd67f384e65cf4db',
      ];
      const randomIndex = Math.floor(Math.random() * 7);
      const infuraId = infuraIds[randomIndex];

      const language = this.props.userPreferences.language;

      const walletLink = new WalletLink({
        appName:
          language === 'en' ? 'Loopring Exchange (DEX)' : '路印去中心化交易所',
        appLogoUrl: 'https://www.loopring.io/favicon.png',
        darkMode: false,
      });

      // TODO: WalletLink doesn't support golier testnet
      const ETH_JSONRPC_URL = `https://mainnet.infura.io/v3/${infuraId}`;
      const CHAIN_ID = 1;

      const provider = walletLink.makeWeb3Provider(ETH_JSONRPC_URL, CHAIN_ID);

      let accounts;
      let connecting = false;
      /*
      provider.on('disconnected', (error, payload) => {
        // disconnect can be also triggered from other places.
        if (connecting) {
          console.log('disconnect', error, payload);
          this.props.connectToWalletLinkComplete();
          notifyError(
            <I s="Failed to connect to Coinbase Wallet!" />,
            this.props.theme
          );
          this.props.showConnectToWalletModal(true);
        }
      });
      */

      try {
        connecting = true;
        accounts = await provider.enable();
        connecting = false;
      } catch (e) {
        connecting = false;
        // If user close QR code modal
        this.props.connectToWalletLinkComplete();
        await provider.close();
        return;
      }

      // Create Web3
      const web3 = new Web3(provider);
      window.web3 = web3;

      // Assign use window.provider
      window.provider = provider;

      window.wallet = new Wallet('WalletLink', window.web3, accounts[0]);

      this.props.updateAccount({
        ...this.props.dexAccount.account,
        state: WALLET_UNCONNECTED,
      });

      this.setupSubscribe();

      saveWalletType('WalletLink');

      // Set state
      this.props.getDataFromLocalStorage(window.wallet.address);

      this.props.connectToWalletLinkComplete();

      // Get related info
      this.props.fetchNonce(window.wallet.address);
      this.props.fetchGasPrice();
    })();
  };

  setupSubscribe() {
    /*
    // Subscribe to accounts change
    window.provider.on('accountsChanged', (accounts) => {
      this.props.connectToWalletLink(true);
    });

    // Subscribe to chainId change
    window.provider.on('chainChanged', (chainId) => {
      this.props.connectToWalletLink(true);
    });

    // Subscribe to networkId change
    window.provider.on('networkChanged', (networkId) => {
      this.props.connectToWalletLink(true);
    });

    // Subscribe to session connection/open
    window.provider.on('open', () => {
      console.log('open');
    });

    // Subscribe to session disconnection/close
    window.provider.on('close', (code, reason) => {
      console.log('WalletLink', code, reason);
    });
    */
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, walletLink } = state;
  return { dexAccount, walletLink };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectToWalletLink: (startConnecting) =>
      dispatch(connectToWalletLink(startConnecting)),
    connectToWalletLinkComplete: () => dispatch(connectToWalletLinkComplete()),
    showConnectToWalletModal: (show) =>
      dispatch(showConnectToWalletModal(show)),
    updateAccount: (account) => dispatch(updateAccount(account)),
    getDataFromLocalStorage: (address) =>
      dispatch(getDataFromLocalStorage(address)),
    fetchNonce: (address) => dispatch(fetchNonce(address)),
    fetchGasPrice: () => dispatch(fetchGasPrice()),
  };
};

export default withUserPreferences(
  withTheme(connect(mapStateToProps, mapDispatchToProps)(WalletLinkService))
);
