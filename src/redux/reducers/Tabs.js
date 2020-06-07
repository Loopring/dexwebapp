import {
  UPDATE_TYPE_1,
  UPDATE_TYPE_2,
  UPDATE_TYPE_3,
} from "redux/actions/Tabs";

const initialState = {
  type1: "orderBook",
  type2: "open-orders",
  type3: "open-orders",
};

export const TabsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TYPE_1:
      if (
        action.payload.type === "orderBook" ||
        action.payload.type === "tradeHistory"
      ) {
        return {
          ...state,
          type1: action.payload.type,
        };
      }
      return state;
    case UPDATE_TYPE_2:
      if (
        action.payload.type === "open-orders" ||
        action.payload.type === "history-orders"
      ) {
        return {
          ...state,
          type2: action.payload.type,
        };
      }
      return state;
    case UPDATE_TYPE_3:
      if (
        action.payload.type === "open-orders" ||
        action.payload.type === "order-history" ||
        action.payload.type === "trade-history"
      ) {
        return {
          ...state,
          type3: action.payload.type,
        };
      }
      return state;
    default:
      return state;
  }
};
