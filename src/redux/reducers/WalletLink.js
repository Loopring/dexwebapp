import {
  CONNECT_TO_WALLET_LINK,
  CONNECT_TO_WALLET_LINK_COMPLETE,
} from 'redux/actions/WalletLink';

const initialState = {
  startConnecting: false,
  referenceCount: 0, // used startConnecting and referenceCount together
  isDesiredNetwork: true,
  installed: false,
};

export const WalletLinkReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONNECT_TO_WALLET_LINK: {
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
    case CONNECT_TO_WALLET_LINK_COMPLETE: {
      return {
        ...state,
        startConnecting: false,
      };
    }
    default:
      return state;
  }
};
