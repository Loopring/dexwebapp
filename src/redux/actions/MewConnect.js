export const CONNECT_TO_MEW_CONNECT = 'CONNECT_TO_MEW_CONNECT';
export const CONNECT_TO_MEW_CONNECT_COMPLETE =
  'CONNECT_TO_MEW_CONNECT_COMPLETE';

export function connectToMewConnect(startConnecting) {
  return {
    type: CONNECT_TO_MEW_CONNECT,
    payload: {
      startConnecting,
    },
  };
}

export function connectToMewConnectComplete() {
  return {
    type: CONNECT_TO_MEW_CONNECT_COMPLETE,
    payload: {},
  };
}
