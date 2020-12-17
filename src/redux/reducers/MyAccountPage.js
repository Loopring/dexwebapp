import {
  EMPTY_BALANCES,
  EMPTY_DEPOSITS,
  EMPTY_TRANSFERS,
  EMPTY_WITHDRAWALS,
  HIDE_LOW_BALANCE_ASSETS,
  UPDATE_BALANCE,
  UPDATE_DEPOSITS,
  UPDATE_MY_BALANCES,
  UPDATE_TOKEN_FILTER,
  UPDATE_TRANSFERS,
  UPDATE_WITHDRAWALS,
} from 'redux/actions/MyAccountPage';

import {
  getHideLowBalanceAssets,
  removeHideLowBalanceAssets,
  saveHideLowBalanceAssets,
} from 'lightcone/api/localStorgeAPI';

const initialState = {
  balances: [],
  hideLowBalanceAssets: getHideLowBalanceAssets() ? true : false,

  tokenFilter: 'All',

  depositOffset: 0,
  depositLimit: 20,
  depositTotalNum: 0,
  deposits: [],
  isDepositsLoading: true,

  withdrawalOffset: 0,
  withdrawalLimit: 20,
  withdrawalTotalNum: 0,
  withdrawals: [],
  isWithdrawalsLoading: true,

  transferOffset: 0,
  transferLimit: 20,
  transferTotalNum: 0,
  transfers: [],
  isTransfersLoading: true,
};

export const MyAccountPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BALANCE: {
      // Update a single balance
      const balance = action.payload.balance;
      const previousBalances = [...state.balances];
      const index = previousBalances.findIndex(
        (ba) => ba.tokenId === balance.tokenId
      );
      if (index !== -1) {
        previousBalances.splice(index, 1);
      }

      previousBalances.push(balance);
      return {
        ...state,
        balances: previousBalances.sort((a, b) => a.tokenId - b.tokenId),
      };
    }

    case UPDATE_MY_BALANCES: {
      // Update all balances
      const newBalances = action.payload.balances;
      return {
        ...state,
        balances: newBalances,
      };
    }

    case EMPTY_BALANCES: {
      return {
        ...state,
        balances: [],
      };
    }

    case UPDATE_DEPOSITS: {
      return {
        ...state,
        depositOffset: action.payload.offset,
        depositLimit: action.payload.limit,
        depositTotalNum: action.payload.totalNum,
        deposits: action.payload.transactions,
        isDepositsLoading: false,
      };
    }

    case EMPTY_DEPOSITS: {
      return {
        ...state,
        depositOffset: 0,
        depositLimit: 20,
        depositTotalNum: 0,
        deposits: [],
        isDepositsLoading: false,
      };
    }

    case UPDATE_WITHDRAWALS: {
      return {
        ...state,
        withdrawalOffset: action.payload.offset,
        withdrawalLimit: action.payload.limit,
        withdrawalTotalNum: action.payload.totalNum,
        withdrawals: action.payload.transactions,
        isWithdrawalsLoading: false,
      };
    }

    case EMPTY_WITHDRAWALS: {
      return {
        ...state,
        withdrawalOffset: 0,
        withdrawalLimit: 20,
        withdrawalTotalNum: 0,
        withdrawals: [],
        isWithdrawalsLoading: false,
      };
    }

    case UPDATE_TRANSFERS: {
      return {
        ...state,
        transferOffset: action.payload.offset,
        transferLimit: action.payload.limit,
        transferTotalNum: action.payload.totalNum,
        transfers: action.payload.transactions,
        isTransfersLoading: false,
      };
    }

    case EMPTY_TRANSFERS: {
      return {
        ...state,
        transferOffset: 0,
        transferLimit: 20,
        transferTotalNum: 0,
        transfers: [],
        isTransfersLoading: false,
      };
    }

    case UPDATE_TOKEN_FILTER: {
      return {
        ...state,
        tokenFilter: action.payload.tokenFilter,
        depositOffset: 0,
        withdrawalOffset: 0,
      };
    }

    case HIDE_LOW_BALANCE_ASSETS: {
      if (action.payload.hideLowBalanceAssets) {
        saveHideLowBalanceAssets();
      } else {
        removeHideLowBalanceAssets();
      }
      return {
        ...state,
        hideLowBalanceAssets: action.payload.hideLowBalanceAssets,
      };
    }
    default:
      return state;
  }
};
