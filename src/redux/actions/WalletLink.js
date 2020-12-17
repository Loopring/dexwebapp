export const CONNECT_TO_WALLET_LINK = 'CONNECT_TO_WALLET_LINK';
export const CONNECT_TO_WALLET_LINK_COMPLETE =
  'CONNECT_TO_WALLET_LINK_COMPLETE';

export function connectToWalletLink(startConnecting) {
  return {
    type: CONNECT_TO_WALLET_LINK,
    payload: {
      startConnecting,
    },
  };
}

export function connectToWalletLinkComplete() {
  return {
    type: CONNECT_TO_WALLET_LINK_COMPLETE,
    payload: {},
  };
}
