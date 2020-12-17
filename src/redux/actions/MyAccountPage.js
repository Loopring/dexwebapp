import { getBalances } from 'lightcone/api/v1/balances';

import {
  getDepositHistory,
  getWithdrawalHistory,
} from 'lightcone/api/LightconeAPI';

import { getTransferHistory } from 'lightcone/api/v1/transfer';

import { getAmmUserTransactions } from 'lightcone/api/AmmAPI';

export const UPDATE_MY_BALANCES = 'UPDATE_MY_BALANCES';

export const UPDATE_BALANCE = 'UPDATE_BALANCE';

export const EMPTY_BALANCES = 'EMPTY_BALANCES';

export const UPDATE_DEPOSITS = 'UPDATE_DEPOSITS';
export const EMPTY_DEPOSITS = 'EMPTY_DEPOSITS';

export const UPDATE_WITHDRAWALS = 'UPDATE_WITHDRAWALS';
export const EMPTY_WITHDRAWALS = 'EMPTY_WITHDRAWALS';

export const UPDATE_TOKEN_FILTER = 'UPDATE_TOKEN_FILTER';
export const HIDE_LOW_BALANCE_ASSETS = 'HIDE_LOW_BALANCE_ASSETS';

export const UPDATE_TRANSFERS = 'UPDATE_TRANSFERS';
export const EMPTY_TRANSFERS = 'EMPTY_TRANSFERS';

export const UPDATE_AMM_TRANSACTIONS = 'UPDATE_AMM_TRANSACTIONS';
export const EMPTY_AMM_TRANSACTIONS = 'EMPTY_AMM_TRANSACTIONS';

export function emptyBalances() {
  return {
    type: EMPTY_BALANCES,
    payload: {},
  };
}

export function updateBalance(balance) {
  return {
    type: UPDATE_BALANCE,
    payload: {
      balance,
    },
  };
}

export function updateMyAccountPage(balances) {
  return {
    type: UPDATE_MY_BALANCES,
    payload: {
      balances,
    },
  };
}

export function fetchMyAccountPage(accountId, apiKey, tokens, skip, limit) {
  return (dispatch) => {
    (async () => {
      try {
        const balances = await getBalances(
          accountId,
          apiKey,
          tokens,
          skip,
          limit
        );
        dispatch(updateMyAccountPage(balances));
      } catch (error) {
        // console.log(error);
      }
    })();
  };
}

export function updateDeposits(payload) {
  return {
    type: UPDATE_DEPOSITS,
    payload,
  };
}

export function fetchDeposits(
  limit,
  offset,
  accountId,
  tokenSymbol,
  apiKey,
  tokens
) {
  return (dispatch) => {
    (async () => {
      try {
        const response = await getDepositHistory(
          accountId,
          tokenSymbol,
          limit,
          offset,
          apiKey,
          tokens
        );
        dispatch(updateDeposits(response));
      } catch (error) {
        console.log(error);
      }
    })();
  };
}

export function emptyDeposits() {
  return {
    type: EMPTY_DEPOSITS,
    payload: {},
  };
}

export function updateWithdrawals(payload) {
  return {
    type: UPDATE_WITHDRAWALS,
    payload,
  };
}

export function fetchWithdrawals(
  limit,
  offset,
  accountId,
  tokenSymbol,
  apiKey,
  tokens
) {
  return (dispatch) => {
    (async () => {
      try {
        const response = await getWithdrawalHistory(
          accountId,
          tokenSymbol,
          limit,
          offset,
          apiKey,
          tokens
        );
        dispatch(updateWithdrawals(response));
      } catch (error) {}
    })();
  };
}

export function emptyWithdrawals() {
  return {
    type: EMPTY_WITHDRAWALS,
    payload: {},
  };
}

export function updateTokenFilter(tokenFilter) {
  return {
    type: UPDATE_TOKEN_FILTER,
    payload: {
      tokenFilter,
    },
  };
}

export function updateHideLowBalanceAssets(value) {
  return {
    type: HIDE_LOW_BALANCE_ASSETS,
    payload: {
      hideLowBalanceAssets: value,
    },
  };
}

export function updateTransfers(payload) {
  return {
    type: UPDATE_TRANSFERS,
    payload,
  };
}

export function emptyTransfers() {
  return {
    type: EMPTY_TRANSFERS,
    payload: {},
  };
}

export function fetchTransfers(
  limit,
  offset,
  accountId,
  tokenSymbol,
  apiKey,
  tokens
) {
  return (dispatch) => {
    (async () => {
      try {
        const response = await getTransferHistory(
          accountId,
          tokenSymbol,
          limit,
          offset,
          apiKey,
          tokens
        );
        dispatch(updateTransfers(response));
      } catch (error) {}
    })();
  };
}

export function updateAmmTransactions(payload) {
  return {
    type: UPDATE_AMM_TRANSACTIONS,
    payload,
  };
}

export function emptyAmmTransactions() {
  return {
    type: EMPTY_AMM_TRANSACTIONS,
    payload: {},
  };
}

export function fetchAmmTransactions(limit, offset, accountId, apiKey, tokens) {
  return (dispatch) => {
    (async () => {
      try {
        const response = await getAmmUserTransactions(
          accountId,
          limit,
          offset,
          apiKey,
          tokens
        );
        dispatch(updateAmmTransactions(response));
      } catch (error) {
        console.log('error', error);
      }
    })();
  };
}
