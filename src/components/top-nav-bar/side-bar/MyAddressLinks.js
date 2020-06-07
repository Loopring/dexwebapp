import { connect } from "react-redux";
import { faExternalLinkSquareAlt } from "@fortawesome/free-solid-svg-icons/faExternalLinkSquareAlt";
import { faRedo } from "@fortawesome/free-solid-svg-icons/faRedo";
import { withTheme } from "styled-components";
import I from "components/I";
import React from "react";

import { connectToWalletConnect } from "redux/actions/WalletConnect";
import { getEtherscanLink, getWalletType } from "lightcone/api/localStorgeAPI";
import { showSideBar } from "redux/actions/ModalManager";

import {
  MenuFontAwesomeIcon,
  SideBarButton,
  SideBarGroupLabel,
  SideBarGroupSeperator,
} from "../../SideBarDrawer";

class MyAddressLinks extends React.Component {
  pressedReconnectWalletConnectButton = () => {
    (async () => {
      console.log("pressedReconnectWalletConnectButton");
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

        {getWalletType() !== "WalletConnect" ? (
          <div />
        ) : (
          <SideBarButton
            key="reconnect"
            onClick={() => {
              this.pressedReconnectWalletConnectButton();
            }}
          >
            <MenuFontAwesomeIcon icon={faRedo} />
            <I s="Retry WalletConnect" />
          </SideBarButton>
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
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(MyAddressLinks)
);
