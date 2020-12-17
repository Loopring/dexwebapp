import {
  CONNECT_TO_MEW_CONNECT,
  CONNECT_TO_MEW_CONNECT_COMPLETE,
} from 'redux/actions/MewConnect';

const initialState = {
  startConnecting: false,
  referenceCount: 0, // used startConnecting and referenceCount together
  isDesiredNetwork: true,
  installed: false,
};

export const MewConnectReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONNECT_TO_MEW_CONNECT: {
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
    case CONNECT_TO_MEW_CONNECT_COMPLETE: {
      return {
        ...state,
        startConnecting: false,
      };
    }
    default:
      return state;
  }
};
