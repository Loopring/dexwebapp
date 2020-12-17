import {
  EMPTY_MY_HISTORY_ORDERS,
  EMPTY_MY_OPEN_ORDERS,
  UPDATE_HISTORY_ORDERS_OFFSET,
  UPDATE_MY_HISTORY_ORDERS,
  UPDATE_MY_OPEN_ORDERS,
  UPDATE_OPEN_ORDERS_OFFSET,
  UPDATE_SHOW_ALL_OPEN_ORDERS,
  UPDATE_SOCKET_ORDER,
} from 'redux/actions/MyOrders';
import {
  getShowAllOpenOrders,
  removeShowAllOpenOrders,
  saveShowAllOpenOrders,
} from 'lightcone/api/localStorgeAPI';

const initialState = {
  // 'waiting', 'processing'
  isOpenOrdersLoading: true,
  openOrders: [],
  openOrdersTotalNum: null,
  openOrdersLimit: 20,
  openOrdersOffset: 0,
  showAllOpenOrders: getShowAllOpenOrders() ? true : false,

  // 'processed', 'failed', 'cancelled', 'expired'
  isHistoryOrdersLoading: true,
  historyOrders: [],
  historyOrdersTotalNum: null,
  historyOrdersLimit: 20,
  historyOrdersOffset: 0,
};

export const MyOrdersReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MY_OPEN_ORDERS: {
      const response = action.payload.response;
      const orders = response['orders'];
      orders.sort((a, b) => b.createdAt - a.createdAt);
      return {
        ...state,
        isOpenOrdersLoading: false,
        openOrders: orders,
        openOrdersTotalNum: response['totalNum'],
      };
    }
    case UPDATE_SHOW_ALL_OPEN_ORDERS: {
      if (action.payload.value) {
        saveShowAllOpenOrders();
      } else {
        removeShowAllOpenOrders();
      }
      return {
        ...state,
        showAllOpenOrders: action.payload.value,
      };
    }
    case UPDATE_OPEN_ORDERS_OFFSET: {
      return {
        ...state,
        openOrdersOffset: action.payload.offset,
      };
    }
    case EMPTY_MY_OPEN_ORDERS: {
      return {
        ...state,
        isOpenOrdersLoading: false,
        openOrders: [],
        openOrdersTotalNum: null,
        openOrdersLimit: 20,
        openOrdersOffset: 0,
      };
    }
    case UPDATE_MY_HISTORY_ORDERS: {
      const response = action.payload.response;
      return {
        ...state,
        isHistoryOrdersLoading: false,
        historyOrders: response['orders'],
        historyOrdersTotalNum: response['totalNum'],
      };
    }
    case UPDATE_HISTORY_ORDERS_OFFSET: {
      return {
        ...state,
        historyOrdersOffset: action.payload.offset,
      };
    }
    case EMPTY_MY_HISTORY_ORDERS: {
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
    case UPDATE_SOCKET_ORDER:
      const order = action.payload.order;
      if (order.status === 'waiting' || order.status === 'processing') {
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

    default:
      return state;
  }
};
