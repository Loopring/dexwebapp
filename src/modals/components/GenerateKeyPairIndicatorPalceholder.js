import React from "react";

import { getWalletType } from "lightcone/api/localStorgeAPI";
import WalletConnectIndicatorPlaceholder from "modals/components/WalletConnectIndicatorPlaceholder";

const GenerateKeyPairIndicatorPlaceholder = () => {
  if (getWalletType() === "MetaMask") {
    return (
      <div
        style={{
          height: "460px",
          display: "block",
        }}
      />
    );
  } else {
    return <WalletConnectIndicatorPlaceholder isWalletConnectLoading={true} />;
  }
};

export default GenerateKeyPairIndicatorPlaceholder;
