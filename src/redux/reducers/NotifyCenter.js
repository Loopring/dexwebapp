import { UPDATE_BLOCK_NUM } from '../actions/NotifyCenter';

const initialState = {
  blockNum: 0,
};

export const NotifyCenterReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BLOCK_NUM:
      return {
        ...state,
        blockNum: action.payload.blockNum,
      };
    default:
      return state;
  }
};
