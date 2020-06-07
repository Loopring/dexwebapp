import {
  EMPTY_TRADE_FORM,
  UPDATE_PRICE,
  UPDATE_TRADE_TYPE,
} from "redux/actions/TradePanel";
import { UPDATE_AMOUNT } from "../actions/TradePanel";

const initialState = {
  tradeType: "buy",
  amount: "",
  price: "",
  updateOrderTotalReferenceCount: 0,
};

export const TradePanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TRADE_TYPE:
      const tradeType = action.payload.tradeType;
      if (tradeType === "buy" || tradeType === "sell") {
        return {
          ...state,
          tradeType,
        };
      }
      return state;
    case UPDATE_AMOUNT: {
      let amount = String(action.payload.amount);
      let newUpdateOrderTotalReferenceCount =
        state.updateOrderTotalReferenceCount;
      if (action.payload.shouldUpdateOrderTotal === true) {
        newUpdateOrderTotalReferenceCount =
          state.updateOrderTotalReferenceCount + 1;
      }
      return {
        ...state,
        amount,
        updateOrderTotalReferenceCount: newUpdateOrderTotalReferenceCount,
      };
    }

    case UPDATE_PRICE: {
      let price = String(action.payload.price);
      let newUpdateOrderTotalReferenceCount =
        state.updateOrderTotalReferenceCount;
      if (action.payload.shouldUpdateOrderTotal === true) {
        newUpdateOrderTotalReferenceCount =
          state.updateOrderTotalReferenceCount + 1;
      }
      return {
        ...state,
        price,
        updateOrderTotalReferenceCount: newUpdateOrderTotalReferenceCount,
      };
    }
    case EMPTY_TRADE_FORM:
      return {
        ...state,
        amount: "",
        price: "",
      };
    default:
      return state;
  }
};
