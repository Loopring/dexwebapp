import { connect } from 'react-redux';
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkSquareAlt';
import { faRedo } from '@fortawesome/free-solid-svg-icons/faRedo';
import { withTheme } from 'styled-components';
import I from 'components/I';
import React from 'react';

import { connectToAuthereum } from 'redux/actions/Authereum';
import { connectToMewConnect } from 'redux/actions/MewConnect';
import { connectToWalletConnect } from 'redux/actions/WalletConnect';
import { connectToWalletLink } from 'redux/actions/WalletLink';

import { getEtherscanLink, getWalletType } from 'lightcone/api/localStorgeAPI';
import { showSideBar } from 'redux/actions/ModalManager';

import {
  MenuFontAwesomeIcon,
  SideBarButton,
  SideBarGroupLabel,
  SideBarGroupSeperator,
} from '../../SideBarDrawer';

class MyAddressLinks extends React.Component {
  pressedReconnectWalletConnectButton = () => {
    (async () => {
      try {
        await window.ethereum.close();
      } catch (error) {
        console.log(error);
      } finally {
        this.props.connectToWalletConnect(true);
        this.props.showSideBar(false);
      }
    })();
  };

  pressedReconnectMweConnectButton = () => {
    (async () => {
      try {
        await window.ethereum.close();
      } catch (error) {
        console.log(error);
      } finally {
        this.props.connectToMewConnect(true);
        this.props.showSideBar(false);
      }
    })();
  };

  pressedReconnectAuthereumButton = () => {
    (async () => {
      try {
        await window.ethereum.close();
      } catch (error) {
        console.log(error);
      } finally {
        this.props.connectToAuthereum(true);
        this.props.showSideBar(false);
      }
    })();
  };

  pressedReconnectWalletLinkButton = () => {
    (async () => {
      try {
        await window.ethereum.close();
      } catch (error) {
        console.log(error);
      } finally {
        this.props.connectToWalletLink(true);
        this.props.showSideBar(false);
      }
    })();
  };

  render() {
    return (
      <div>
        <SideBarGroupSeperator />
        <SideBarGroupLabel>
          <I s="MenuMyEthAccount" />
        </SideBarGroupLabel>
        <SideBarButton
          key="myaddress"
          onClick={() => {
            window.open(
              `${getEtherscanLink(this.props.chainId)}/address/${
                this.props.dexAccount.account.address
              }`
            );
          }}
        >
          <MenuFontAwesomeIcon icon={faExternalLinkSquareAlt} />
          <I s="Show on Etherscan" />
        </SideBarButton>

        {getWalletType() === 'WalletConnect' ? (
          <SideBarButton
            key="reconnect"
            onClick={() => {
              this.pressedReconnectWalletConnectButton();
            }}
          >
            <MenuFontAwesomeIcon icon={faRedo} />
            <I s="Retry WalletConnect" />
          </SideBarButton>
        ) : (
          <div />
        )}

        {getWalletType() === 'MewConnect' ? (
          <SideBarButton
            key="reconnect"
            onClick={() => {
              this.pressedReconnectMweConnectButton();
            }}
          >
            <MenuFontAwesomeIcon icon={faRedo} />
            <I s="Retry MEW Wallet" />
          </SideBarButton>
        ) : (
          <div />
        )}

        {getWalletType() === 'Authereum' ? (
          <SideBarButton
            key="reconnect"
            onClick={() => {
              this.pressedReconnectAuthereumButton();
            }}
          >
            <MenuFontAwesomeIcon icon={faRedo} />
            <I s="Retry Authereum" />
          </SideBarButton>
        ) : (
          <div />
        )}

        {getWalletType() === 'WalletLink' ? (
          <SideBarButton
            key="reconnect"
            onClick={() => {
              this.pressedReconnectWalletLinkButton();
            }}
          >
            <MenuFontAwesomeIcon icon={faRedo} />
            <I s="Retry WalletLink" />
          </SideBarButton>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { exchange, dexAccount } = state;
  return {
    chainId: exchange.chainId,
    dexAccount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showSideBar: (show) => dispatch(showSideBar(show)),
    connectToWalletConnect: (startConnecting) =>
      dispatch(connectToWalletConnect(startConnecting)),
    connectToMewConnect: (startConnecting) =>
      dispatch(connectToMewConnect(startConnecting)),
    connectToAuthereum: (startConnecting) =>
      dispatch(connectToAuthereum(startConnecting)),
    connectToWalletLink: (startConnecting) =>
      dispatch(connectToWalletLink(startConnecting)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(MyAddressLinks)
);
