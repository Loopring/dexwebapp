import {
  UPDATE_AMM_MARKETS,
  UPDATE_AMM_SNAPSHOTS,
  UPDATE_MY_ACTIVE_AMM_MARKETS,
} from 'redux/actions/swap/AmmMarkets';

const initialState = {
  ammMarkets: null,
  myActiveAmmMarkets: null,
  snapshots: null,
  snapshot: null,
};

export const AmmMarketsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_AMM_MARKETS: {
      return {
        ...state,
        ammMarkets: action.payload.ammMarkets,
      };
    }
    case UPDATE_AMM_SNAPSHOTS: {
      return {
        ...state,
        snapshot: action.payload.snapshot,
      };
    }
    case UPDATE_MY_ACTIVE_AMM_MARKETS: {
      return {
        ...state,
        myActiveAmmMarkets: action.payload.myActiveAmmMarkets,
      };
    }
    default:
      return state;
  }
};
