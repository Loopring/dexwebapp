import {
  EMPTY_TRADES,
  EXTEND_TRADES,
  UPDATE_TRADES,
} from 'redux/actions/market/TradeHistory';

const initialState = {
  trades: [],
  latestTrade: null,
};

export const TradeHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TRADES: {
      const trades = action.payload.trades;
      const latestTrade = trades && trades.length > 0 ? trades[0] : null;
      return {
        ...state,
        trades,
        latestTrade,
      };
    }
    case EXTEND_TRADES: {
      const newTrades = action.payload.newTrades;
      const previousTrades = state.trades;
      let trades = newTrades.concat(previousTrades);
      if (trades.length > 100) {
        trades = trades.slice(0, 100);
      }
      const latestTrade = trades && trades.length > 0 ? trades[0] : null;
      return {
        ...state,
        trades,
        latestTrade,
      };
    }

    case EMPTY_TRADES:
      return {
        trades: [],
        latestTrade: null,
      };

    default:
      return state;
  }
};
