import { getOrders } from "lightcone/api/v1/orders";
import { getUserTrades } from "lightcone/api/v1/userTrades";

export const UPDATE_ALL_OPEN_ORDERS = "UPDATE_ALL_OPEN_ORDERS";
export const UPDATE_ALL_HISTORY_ORDERS = "UPDATE_ALL_HISTORY_ORDERS";
export const EMPTY_ALL_OPEN_ORDERS = "EMPTY_ALL_OPEN_ORDERS";
export const EMPTY_ALL_HISTORY_ORDERS = "EMPTY_ALL_HISTORY_ORDERS";

// Trades
export const UPDATE_USER_TRANSACTIONS = "UPDATE_USER_TRANSACTIONS";
export const EMPTY_USER_TRANSACTIONS = "EMPTY_USER_TRANSACTIONS";

//Socket
export const UPDATE_SOCKET_ALL_ORDER = "UPDATE_SOCKET_ALL_ORDER";

export const UPDATE_MARKET_FILTER = "UPDATE_MARKET_FILTER";

export function updateSocketAllOrder(order) {
  return {
    type: UPDATE_SOCKET_ALL_ORDER,
    payload: {
      order,
    },
  };
}

export function updateAllOpenOrders(payload) {
  return {
    type: UPDATE_ALL_OPEN_ORDERS,
    payload,
  };
}

export function fetchMyOpenOrders(
  accountId,
  market,
  limit,
  offset,
  apiKey,
  tokens
) {
  return (dispatch) => {
    (async () => {
      try {
        const response = await getOrders({
          accountId,
          market,
          limit,
          offset,
          statuses: ["waiting", "processing"],
          apiKey,
          tokens,
        });
        dispatch(updateAllOpenOrders(response));
      } catch (error) {}
    })();
  };
}

export function updateAllHistoryOrders(payload) {
  return {
    type: UPDATE_ALL_HISTORY_ORDERS,
    payload,
  };
}

export function fetchMyHistoryOrders(
  accountId,
  market,
  limit,
  offset,
  apiKey,
  tokens
) {
  return (dispatch) => {
    (async () => {
      try {
        const response = await getOrders({
          accountId,
          market,
          limit,
          offset,
          statuses: ["processed", "failed", "cancelled", "expired"],
          apiKey,
          tokens,
        });
        dispatch(updateAllHistoryOrders(response));
      } catch (error) {}
    })();
  };
}

export function emptyAllOpenOrders() {
  return {
    type: EMPTY_ALL_OPEN_ORDERS,
    payload: {},
  };
}

export function emptyAllHistoryOrders() {
  return {
    type: EMPTY_ALL_HISTORY_ORDERS,
    payload: {},
  };
}

export function updateUserTransactions(response) {
  return {
    type: UPDATE_USER_TRANSACTIONS,
    payload: response,
  };
}

export function fetchUserTransactions(
  accountId,
  market,
  limit,
  offset,
  apiKey,
  tokens
) {
  return (dispatch) => {
    (async () => {
      try {
        const response = await getUserTrades({
          accountId,
          market,
          limit,
          offset,
          apiKey,
          tokens,
        });
        dispatch(updateUserTransactions(response));
      } catch (error) {
        console.log(error);
      }
    })();
  };
}

export function emptyUserTransactions() {
  return {
    type: EMPTY_USER_TRANSACTIONS,
    payload: {},
  };
}

export function updateMarketFilter(marketFilter) {
  return {
    type: UPDATE_MARKET_FILTER,
    payload: {
      marketFilter,
    },
  };
}
