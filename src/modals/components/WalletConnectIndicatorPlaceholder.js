import I from 'components/I';
import React from 'react';

const WalletConnectIndicatorPlaceholder = ({ isWalletConnectLoading }) => {
  return (
    <div
      style={{
        display: isWalletConnectLoading ? 'block' : 'none',
        width: '330px',
        paddingTop: '30px',
        paddingBottom: '30px',
      }}
    >
      <I s="walletConnectConfirm" />
      <I s={'walletConnectPendingTxTip'} />
    </div>
  );
};

export default WalletConnectIndicatorPlaceholder;
