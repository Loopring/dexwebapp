import {
  CONNECT_TO_WALLET_CONNECT,
  CONNECT_TO_WALLET_CONNECT_COMPLETE,
} from "redux/actions/WalletConnect";

const initialState = {
  startConnecting: false,
  referenceCount: 0, // used startConnecting and referenceCount together
  isDesiredNetwork: true,
  installed: false,
};

export const WalletConnectReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONNECT_TO_WALLET_CONNECT: {
      const startConnecting = action.payload.startConnecting;
      let newReferenceCount = state.referenceCount;
      if (startConnecting === true) {
        newReferenceCount = state.referenceCount + 1;
      }
      return {
        ...state,
        startConnecting,
        referenceCount: newReferenceCount,
      };
    }
    case CONNECT_TO_WALLET_CONNECT_COMPLETE: {
      return {
        ...state,
        startConnecting: false,
      };
    }
    default:
      return state;
  }
};
