import { UPDATE_LEGAL, UPDATE_LEGAL_PRICE } from 'redux/actions/LegalPrice';
import { getCurrency } from 'lightcone/api/localStorgeAPI';

const enInitialState = {
  legal: 'USD',
  legalPrefix: '$',
  prices: [],
};

const zhInitialState = {
  legal: 'CNY',
  legalPrefix: '¥',
  prices: [],
};

const initialState = getCurrency() === 'CNY' ? zhInitialState : enInitialState;

export const LegalPriceReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LEGAL:
      const legal = action.payload.legal;
      const legalPrefix = getLegalPrefix(legal);
      return {
        ...state,
        legal,
        legalPrefix,
      };
    case UPDATE_LEGAL_PRICE:
      const prices = action.payload.prices;
      return {
        ...state,
        prices,
      };
    default:
      return state;
  }
};

function getLegalPrefix(legal) {
  if (legal === 'CNY') {
    return '¥';
  } else {
    return '$';
  }
}
