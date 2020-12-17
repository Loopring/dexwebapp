import { getDepth } from 'lightcone/api/v1/depth';

export const UPDATE_ORDER_BOOKS = 'UPDATE_ORDER_BOOKS';
export const UPDATE_ORDER_BOOKS_LEVEL = 'UPDATE_ORDER_BOOKS_LEVEL';
export const UPDATE_SOCKET_ORDER_BOOKS = 'UPDATE_SOCKET_ORDER_BOOKS';
export const EMPTY_ORDER_BOOKS = 'EMPTY_ORDER_BOOKS';

export function updateSocketOrderBooks(
  sells,
  buys,
  startVersion,
  endVersion,
  market,
  configTokens
) {
  const asks = sells.map((slot) => ({
    ...slot,
    side: 'SELL',
  }));
  const bids = buys.map((slot) => ({
    ...slot,
    side: 'BUY',
  }));

  return {
    type: UPDATE_SOCKET_ORDER_BOOKS,
    payload: {
      sells: asks,
      buys: bids,
      startVersion,
      endVersion,
      market,
      configTokens,
    },
  };
}

export function emptyOrderBooks(level) {
  return {
    type: EMPTY_ORDER_BOOKS,
    payload: {
      level,
    },
  };
}

export function updateOrderBooks(sells, buys, version, market) {
  return {
    type: UPDATE_ORDER_BOOKS,
    payload: {
      sells,
      buys,
      version,
      market,
    },
  };
}

export function fetchOrderBooks(market, level, tokens) {
  return (dispatch) => {
    (async () => {
      try {
        const depth = await getDepth(market, level, 30, tokens);
        const asks = depth.asks.map((obj) => ({
          ...obj,
          side: 'SELL',
        }));
        const bids = depth.bids.map((obj) => ({
          ...obj,
          side: 'BUY',
        }));
        dispatch(updateOrderBooks(asks.reverse(), bids, depth.version, market));
      } catch (error) {
        console.log(error);
      }
    })();
  };
}

function internalUpdateOrderBooksLevel(level) {
  return {
    type: UPDATE_ORDER_BOOKS_LEVEL,
    payload: {
      level,
    },
  };
}

export function updateOrderBooksLevel(market, level) {
  return (dispatch) => {
    (async () => {
      try {
        dispatch(internalUpdateOrderBooksLevel(level));
      } catch (error) {
        console.log(error);
      }
    })();
  };
}
