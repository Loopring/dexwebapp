import {
  CONNECT_TO_METAMASK_COMPLETE,
  CONNECT_TO_META_MASK,
  DETECT_IF_META_MASK_INSTALLED,
} from 'redux/actions/MetaMask';

const initialState = {
  startConnecting: false,
  referenceCount: 0, // used startConnecting and referenceCount together
  isDesiredNetwork: true,
  installed: false,
};

export const MetaMaskReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONNECT_TO_META_MASK: {
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
    case CONNECT_TO_METAMASK_COMPLETE: {
      return {
        ...state,
        startConnecting: false,
      };
    }
    case DETECT_IF_META_MASK_INSTALLED: {
      const installed = action.payload.installed;
      return {
        ...state,
        installed,
      };
    }
    default:
      return state;
  }
};
