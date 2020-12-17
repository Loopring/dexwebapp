export const UPDATE_TYPE_1 = 'UPDATE_TYPE_1';
export const UPDATE_TYPE_2 = 'UPDATE_TYPE_2';
export const UPDATE_TYPE_3 = 'UPDATE_TYPE_3';

export function updateOrderBookTradeHistoryPanelType(type) {
  return {
    type: UPDATE_TYPE_1,
    payload: {
      type,
    },
  };
}

export function updateMyOrdersAndMyTradesType(type) {
  return {
    type: UPDATE_TYPE_2,
    payload: {
      type,
    },
  };
}

export function updateOrderType(type) {
  return {
    type: UPDATE_TYPE_3,
    payload: {
      type,
    },
  };
}
