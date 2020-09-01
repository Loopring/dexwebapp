import { connect } from "react-redux";
import { withTheme } from "styled-components";

import React, { Component } from "react";

import { connectToMetaMask } from "redux/actions/MetaMask";
import { connectToWalletConnect } from "redux/actions/WalletConnect";
import { connectToMewConnect } from "redux/actions/MewConnect";
import { connectToAuthereum } from "redux/actions/Authereum";
import { getWalletType } from "lightcone/api/localStorgeAPI";
import { showConnectToWalletModal } from "redux/actions/ModalManager";

class WalletService extends Component {
  componentDidMount() {
    let walletConnect = getWalletType();
    if (walletConnect === "MetaMask") {
      this.props.connectToMetaMask(true);
    } else if (walletConnect === "WalletConnect") {
      this.props.connectToWalletConnect(true);
    } else if (walletConnect === "MewConnect") {
      this.props.connectToMewConnect(true);
    } else if (walletConnect === "Authereum") {
      this.props.connectToAuthereum(true);
    } else {
      const href = window.location.href;
      if (
        href.includes("trade") ||
        href.includes("orders") ||
        href.includes("account")
      ) {
        this.props.showConnectToWalletModal(true);
      }
    }
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    showConnectToWalletModal: (show) =>
      dispatch(showConnectToWalletModal(show)),
    connectToMetaMask: (startConnecting) =>
      dispatch(connectToMetaMask(startConnecting)),
    connectToWalletConnect: (startConnecting) =>
      dispatch(connectToWalletConnect(startConnecting)),
    connectToMewConnect: (startConnecting) =>
      dispatch(connectToMewConnect(startConnecting)),
    connectToAuthereum: (startConnecting) =>
      dispatch(connectToAuthereum(startConnecting)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(WalletService)
);
