import I from "components/I";
import React from "react";

import { connect } from "react-redux";
import { getWalletType } from "lightcone/api/localStorgeAPI";
import { withTheme } from "styled-components";
import ModalIndicator from "modals/components/ModalIndicator";
import WalletConnectIndicator from "modals/components/WalletConnectIndicator";

class GenerateKeyPairIndicator extends React.Component {
  render() {
    if (getWalletType() === "MetaMask") {
      return (
        <ModalIndicator
          title={this.props.title}
          tips={[
            <div key="1">
              <I s={"metaMaskPendingTxTip"} />
            </div>,
          ]}
          imageUrl={`/assets/images/${this.props.theme.imgDir}/metamask_pending.png`}
          marginTop="60px"
          textAlign={"left"}
        />
      );
    } else {
      return <WalletConnectIndicator />;
    }
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(GenerateKeyPairIndicator)
);
