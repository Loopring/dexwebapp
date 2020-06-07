export const CONNECT_TO_META_MASK = "CONNECT_TO_META_MASK";
export const DETECT_IF_META_MASK_INSTALLED = "DETECT_IF_META_MASK_INSTALLED";
export const CONNECT_TO_METAMASK_COMPLETE = "CONNECT_TO_METAMASK_COMPLETE";

export function connectToMetaMask(startConnecting) {
  return {
    type: CONNECT_TO_META_MASK,
    payload: {
      startConnecting,
    },
  };
}

export function detectIfMetaMaskInstalled(installed) {
  return {
    type: DETECT_IF_META_MASK_INSTALLED,
    payload: {
      installed,
    },
  };
}

export function connectToMetaMaskComplete() {
  return {
    type: CONNECT_TO_METAMASK_COMPLETE,
    payload: {},
  };
}
