export const CONNECT_TO_WALLET_CONNECT = "CONNECT_TO_WALLET_CONNECT";
export const CONNECT_TO_WALLET_CONNECT_COMPLETE =
  "CONNECT_TO_WALLET_CONNECT_COMPLETE";

export function connectToWalletConnect(startConnecting) {
  return {
    type: CONNECT_TO_WALLET_CONNECT,
    payload: {
      startConnecting,
    },
  };
}

export function connectToWalletConnectComplete() {
  return {
    type: CONNECT_TO_WALLET_CONNECT_COMPLETE,
    payload: {},
  };
}
