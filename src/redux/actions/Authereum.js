export const CONNECT_TO_AUTHEREUM = "CONNECT_TO_AUTHEREUM";
export const CONNECT_TO_AUTHEREUM_COMPLETE =
  "CONNECT_TO_AUTHEREUM_COMPLETE";

export function connectToAuthereum(startConnecting) {
  return {
    type: CONNECT_TO_AUTHEREUM,
    payload: {
      startConnecting,
    },
  };
}

export function connectToAuthereumComplete() {
  return {
    type: CONNECT_TO_AUTHEREUM_COMPLETE,
    payload: {},
  };
}
