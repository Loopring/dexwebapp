import { getOrders } from 'lightcone/api/v1/orders';

// Open orders
export const UPDATE_MY_OPEN_ORDERS = 'UPDATE_MY_OPEN_ORDERS';
export const FETCH_MY_OPEN_ORDERS = 'FETCH_MY_OPEN_ORDERS';
export const UPDATE_SHOW_ALL_OPEN_ORDERS = 'UPDATE_SHOW_ALL_OPEN_ORDERS';
export const UPDATE_OPEN_ORDERS_OFFSET = 'UPDATE_OPEN_ORDERS_OFFSET';
export const EMPTY_MY_OPEN_ORDERS = 'EMPTY_MY_OPEN_ORDERS';

// History orders
export const UPDATE_MY_HISTORY_ORDERS = 'UPDATE_MY_HISTORY_ORDERS';
export const FETCH_MY_HISTORY_ORDERS = 'FETCH_MY_HISTORY_ORDERS';
export const UPDATE_HISTORY_ORDERS_OFFSET = 'UPDATE_HISTORY_ORDERS_OFFSET';
export const EMPTY_MY_HISTORY_ORDERS = 'EMPTY_MY_HISTORY_ORDERS';

//Socket
export const UPDATE_SOCKET_ORDER = 'UPDATE_SOCKET_ORDER';

export function updateSocketOrder(order) {
  return {
    type: UPDATE_SOCKET_ORDER,
    payload: {
      order,
    },
  };
}

export function updateMyOpenOrders(response) {
  return {
    type: UPDATE_MY_OPEN_ORDERS,
    payload: {
      response,
    },
  };
}

export function updateShowAllOpenOrders(value) {
  return {
    type: UPDATE_SHOW_ALL_OPEN_ORDERS,
    payload: {
      value,
    },
  };
}

export function updateOpenOrderOffset(offset) {
  return {
    type: UPDATE_OPEN_ORDERS_OFFSET,
    payload: {
      offset,
    },
  };
}

export function fetchMyOpenOrders(
  accountId,
  limit,
  offset,
  market,
  apiKey,
  tokens
) {
  return (dispatch) => {
    (async () => {
      try {
        const response = await getOrders({
          accountId,
          limit,
          offset,
          market,
          statuses: ['waiting', 'processing'],
          apiKey,
          tokens,
        });
        dispatch(updateMyOpenOrders(response));
      } catch (error) {}
    })();
  };
}

export function emptyMyOpenOrders() {
  return {
    type: EMPTY_MY_OPEN_ORDERS,
    payload: {},
  };
}

export function updateMyHistoryOrders(response) {
  return {
    type: UPDATE_MY_HISTORY_ORDERS,
    payload: {
      response,
    },
  };
}

export function updateHistoryOrderOffset(offset) {
  return {
    type: UPDATE_HISTORY_ORDERS_OFFSET,
    payload: {
      offset,
    },
  };
}

export function fetchMyHistoryOrders(
  accountId,
  limit,
  offset,
  market,
  apiKey,
  tokens
) {
  return (dispatch) => {
    (async () => {
      try {
        const response = await getOrders({
          accountId,
          limit,
          offset,
          market,
          statuses: ['processed', 'failed', 'cancelled', 'expired'],
          apiKey,
          tokens,
        });
        dispatch(updateMyHistoryOrders(response));
      } catch (error) {}
    })();
  };
}

export function emptyMyHistoryOrders() {
  return {
    type: EMPTY_MY_HISTORY_ORDERS,
    payload: {},
  };
}
