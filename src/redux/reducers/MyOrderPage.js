import {
  EMPTY_ALL_HISTORY_ORDERS,
  EMPTY_ALL_OPEN_ORDERS,
  EMPTY_USER_TRANSACTIONS,
  UPDATE_ALL_HISTORY_ORDERS,
  UPDATE_ALL_OPEN_ORDERS,
  UPDATE_MARKET_FILTER,
  UPDATE_SOCKET_ALL_ORDER,
  UPDATE_USER_TRANSACTIONS,
} from "redux/actions/MyOrderPage";

const initialState = {
  marketFilter: "All",

  // 'waiting', 'processing'
  isOpenOrdersLoading: true,
  openOrders: [],
  openOrdersTotalNum: null,
  openOrdersLimit: 20,
  openOrdersOffset: 0,

  // 'processed', 'failed', 'cancelled', 'expired'
  isHistoryOrdersLoading: true,
  historyOrders: [],
  historyOrdersTotalNum: null,
  historyOrdersLimit: 20,
  historyOrdersOffset: 0,

  isTransactionsLoading: true,
  transactions: [],
  transactionsTotalNum: null,
  transactionsLimit: 20,
  transactionsOffset: 0,
};

export const MyOrderPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ALL_OPEN_ORDERS: {
      const payload = action.payload;
      const orders = payload["orders"];
      orders.sort((a, b) => b.createdAt - a.createdAt);
      return {
        ...state,
        isOpenOrdersLoading: false,
        openOrders: orders,
        openOrdersTotalNum: payload["totalNum"],
        openOrdersLimit: payload["limit"],
        openOrdersOffset: payload["offset"],
      };
    }

    case EMPTY_ALL_OPEN_ORDERS: {
      return {
        ...state,
        isOpenOrdersLoading: false,
        openOrders: [],
        openOrdersTotalNum: null,
        openOrdersLimit: 20,
        openOrdersOffset: 0,
      };
    }
    case UPDATE_ALL_HISTORY_ORDERS: {
      const response = action.payload;
      return {
        ...state,
        isHistoryOrdersLoading: false,
        historyOrders: response["orders"],
        historyOrdersTotalNum: response["totalNum"],
        historyOrdersLimit: response["limit"],
        historyOrdersOffset: response["offset"],
      };
    }
    case EMPTY_ALL_HISTORY_ORDERS: {
      return {
        ...state,
        isHistoryOrdersLoading: false,
        historyOrders: [],
        historyOrdersTotalNum: null,
        historyOrdersLimit: 20,
        historyOrdersOffset: 0,
      };
    }
    /**
     * open orders，可能会新增，可能状态变化，可能减少。
     * history 只会增加。
     * 针对socket 推送来的Order更新逻辑如下：
     * 如果 order 是 openOrder，则首先删除openOrders中相同的Order，然后把新的order加入到open order按照created_at 进行从大到小的排序
     * 这样也保证了如果是状态变化，则位置不变，如果是新增则放在头部。
     * 如果 order 是 history order，首先在openOrders中删除该Order。如果historyOrder在第一页，则直接加到头部，如果不在第一页，则不做更新。
     * 在翻页时，通过rest api 接口查询。
     */
    case UPDATE_SOCKET_ALL_ORDER:
      const order = action.payload.order;
      if (order.status === "waiting" || order.status === "processing") {
        const openOrders = state.openOrders.filter(
          (o) => o.hash !== order.hash
        );
        openOrders.push(order);
        openOrders.sort((a, b) => b.createdAt - a.createdAt);
        return {
          ...state,
          openOrders,
        };
      } else {
        const openOrders = state.openOrders.filter(
          (o) => o.hash !== order.hash
        );
        let historyOrders = [];
        /**
         * 如果当前不在第一页，则不展示
         */
        if (state.historyOrdersOffset === 0) {
          historyOrders = state.historyOrders.filter(
            (o) => o.hash !== order.hash
          );
          historyOrders.unshift(order);
        } else historyOrders = state.historyOrders;

        return {
          ...state,
          isOpenOrdersLoading: false,
          openOrders,
          isHistoryOrdersLoading: false,
          historyOrders,
        };
      }

    case UPDATE_USER_TRANSACTIONS: {
      const response = action.payload;
      return {
        ...state,
        isTransactionsLoading: false,
        transactions: response["trades"],
        transactionsTotalNum: response["totalNum"],
        transactionsLimit: response["limit"],
        transactionsOffset: response["offset"],
      };
    }
    case EMPTY_USER_TRANSACTIONS:
      return {
        ...state,
        isTransactionsLoading: false,
        transactions: [],
        transactionsTotalNum: null,
        transactionsLimit: 20,
        transactionsOffset: 0,
      };
    case UPDATE_MARKET_FILTER: {
      return {
        ...state,
        marketFilter: action.payload.marketFilter,
        openOrdersOffset: 0,
        historyOrdersOffset: 0,
        transactionsOffset: 0,
      };
    }
    default:
      return state;
  }
};
