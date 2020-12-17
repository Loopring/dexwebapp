import { UPDATE_NONCE } from 'redux/actions/Nonce';

const initialState = {
  nonce: [],
};

export const NonceReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_NONCE:
      const nonce = action.payload.nonce;
      return {
        ...state,
        nonce,
      };
    default:
      return state;
  }
};
