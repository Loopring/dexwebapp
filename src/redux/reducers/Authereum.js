import {
  CONNECT_TO_AUTHEREUM,
  CONNECT_TO_AUTHEREUM_COMPLETE,
} from 'redux/actions/Authereum';

const initialState = {
  startConnecting: false,
  referenceCount: 0, // used startConnecting and referenceCount together
  isDesiredNetwork: true,
  installed: false,
};

export const AuthereumReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONNECT_TO_AUTHEREUM: {
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
    case CONNECT_TO_AUTHEREUM_COMPLETE: {
      return {
        ...state,
        startConnecting: false,
      };
    }
    default:
      return state;
  }
};
