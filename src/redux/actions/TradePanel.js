export const UPDATE_TRADE_TYPE = 'UPDATE_TRADE_TYPE';
export const UPDATE_AMOUNT = 'UPDATE_AMOUNT';
export const UPDATE_PRICE = 'UPDATE_PRICE';
export const EMPTY_TRADE_FORM = 'EMPTY_TRADE_FORM';

export function updateTradeType(tradeType) {
  return {
    type: UPDATE_TRADE_TYPE,
    payload: {
      tradeType,
    },
  };
}

export function updateAmount(amount, shouldUpdateOrderTotal) {
  return {
    type: UPDATE_AMOUNT,
    payload: {
      amount,
      shouldUpdateOrderTotal,
    },
  };
}

export function updatePrice(price, shouldUpdateOrderTotal) {
  return {
    type: UPDATE_PRICE,
    payload: {
      price,
      shouldUpdateOrderTotal,
    },
  };
}

export function emptyTradePanel() {
  return {
    type: EMPTY_TRADE_FORM,
    payload: {},
  };
}
