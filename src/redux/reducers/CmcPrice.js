import { UPDATE_CMC_LEGAL, UPDATE_CMC_PRICE } from "redux/actions/CmcPrice";
import { getCurrency } from "lightcone/api/localStorgeAPI";

const enInitialState = {
  legal: "USD",
  legalPrefix: "$",
  prices: [],
};

const zhInitialState = {
  legal: "CNY",
  legalPrefix: "¥",
  prices: [],
};

const initialState = getCurrency() === "CNY" ? zhInitialState : enInitialState;

export const CmcPriceReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CMC_LEGAL:
      const legal = action.payload.legal;
      const legalPrefix = getLegalPrefix(legal);
      return {
        ...state,
        legal,
        legalPrefix,
      };
    case UPDATE_CMC_PRICE:
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
  if (legal === "CNY") {
    return "¥";
  } else {
    return "$";
  }
}
