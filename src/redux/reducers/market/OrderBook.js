import BigNumber from "bignumber.js";
import config from "lightcone/config";

import {
  EMPTY_ORDER_BOOKS,
  UPDATE_ORDER_BOOKS,
  UPDATE_ORDER_BOOKS_LEVEL,
  UPDATE_SOCKET_ORDER_BOOKS,
} from "redux/actions/market/OrderBook";

// Hack: initial State can not be empty. Empty
const initialState = {
  market: undefined,
  level: 0,
  version: -1,
  sells: [],
  buys: [],
};

export const OrderBookReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ORDER_BOOKS:
      if (
        state.version < action.payload.version ||
        state.market !== action.payload.market
      ) {
        const sells = action.payload.sells;
        const buys = action.payload.buys;
        return {
          ...state,
          sells,
          buys,
          version: action.payload.version,
          market: action.payload.market,
        };
      } else {
        return {
          ...state,
          market: action.payload.market,
        };
      }

    case UPDATE_ORDER_BOOKS_LEVEL:
      const level = action.payload.level;
      return {
        ...state,
        level,
      };
    case EMPTY_ORDER_BOOKS:
      return {
        market: undefined,
        level: action.payload.level,
        version: -1,
        sells: [],
        buys: [],
      };

    case UPDATE_SOCKET_ORDER_BOOKS:
      const starVersion = action.payload.startVersion;
      const endVersion = action.payload.endVersion;
      const market = action.payload.market;
      const configTokens = action.payload.configTokens;
      const tokens = market.split("-");
      const baseToken = tokens[0];

      if (starVersion <= state.version + 1) {
        const bids = action.payload.buys;
        const asks = action.payload.sells;
        const filteredBuys = bids.filter((slot) => slot.count > 0);
        const filteredSells = asks.filter((slot) => slot.count > 0);

        state.sells.forEach((slot) => {
          if (!asks.find((s) => s.price === slot.price)) {
            filteredSells.push(slot);
          }
        });

        state.buys.forEach((slot) => {
          if (!bids.find((s) => s.price === slot.price)) {
            filteredBuys.push(slot);
          }
        });

        filteredSells.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        filteredBuys.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

        let aggregatedSize = BigNumber(0);
        for (let i = filteredSells.length - 1; i >= 0; i = i - 1) {
          let filteredSell = filteredSells[i];
          aggregatedSize = aggregatedSize.plus(filteredSell.size);
          filteredSell.aggregatedSize = config.fromWEI(
            baseToken,
            aggregatedSize,
            configTokens
          );
        }

        aggregatedSize = BigNumber(0);
        for (let i = 0; i < filteredBuys.length; i = i + 1) {
          let filteredBuy = filteredBuys[i];
          aggregatedSize = aggregatedSize.plus(filteredBuy.size);
          filteredBuy.aggregatedSize = config.fromWEI(
            baseToken,
            aggregatedSize,
            configTokens
          );
        }

        return {
          ...state,
          version: endVersion,
          sells: filteredSells,
          buys: filteredBuys,
        };
      } else return state;

    default:
      return state;
  }
};
