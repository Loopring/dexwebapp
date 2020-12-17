import {
  emptyBalances,
  updateMyAccountPage,
} from 'redux/actions/MyAccountPage';
import {
  emptyMyHistoryOrders,
  emptyMyOpenOrders,
} from 'redux/actions/MyOrders';

export const GET_DATA_FROM_LOCALSTORAGE = 'GET_DATA_FROM_LOCALSTORAGE';
export const GET_DATA_FROM_LOCALSTORAGE_SUCCEEDED =
  'GET_DATA_FROM_LOCALSTORAGE_SUCCEEDED';

export const SHOW_REGISTER_ACCOUNT = 'SHOW_REGISTER_ACCOUNT';
export const SEND_CREATE_REQUEST = 'SEND_CREATE_REQUEST';
export const SEND_CREATE_REQUEST_SUCCEEDED = 'SEND_CREATE_REQUEST_SUCCEEDED';
export const SEND_CREATE_REQUEST_FAILED = 'SEND_CREATE_REQUEST_FAILED';

export const CREATE_ON_CHAIN_PENDING = 'CREATE_ON_CHAIN_PENDING';
export const CREATE_ON_CHAIN_SUCCEEDED = 'CREATE_ON_CHAIN_SUCCEEDED';
export const CREATE_ON_CHAIN_FAILED = 'CREATE_ON_CHAIN_FAILED';

export const ENABLE_TOKENS = 'ENABLE_TOKENS';

export const LOGOUT = 'LOGOUT';

export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';

// UNDEFINED: not connect to MetaMask from web init
export const UNDEFINED = 'UNDEFINED';

export const WALLET_UNCONNECTED = 'WALLET_UNCONNECTED';
export const NOT_REGISTERED = 'NOT_REGISTERED';
export const REGISTERING = 'REGISTERING';
export const REGISTERED = 'REGISTERED';
export const RESETTING = 'RESETTING';
export const LOGGED_IN = 'LOGGED_IN';

export const CLEAR_KEY_PAIR_CIPHER_TEXT = 'CLEAR_KEY_PAIR_CIPHER_TEXT';

export function getAllAccountStates() {
  return [
    UNDEFINED,
    WALLET_UNCONNECTED,
    NOT_REGISTERED,
    REGISTERING,
    REGISTERED,
    RESETTING,
    LOGGED_IN,
  ];
}
export function clearKeyPairCipher() {
  return {
    type: CLEAR_KEY_PAIR_CIPHER_TEXT,
    payload: {},
  };
}

export function updateAccount(account) {
  return {
    type: UPDATE_ACCOUNT,
    payload: { account: account },
  };
}

export function getDataFromLocalStorage(address) {
  return {
    type: GET_DATA_FROM_LOCALSTORAGE,
    payload: { address },
  };
}

export function logout() {
  return {
    type: LOGOUT,
    payload: {},
  };
}

export function logoutAll() {
  return (dispatch) => {
    (async () => {
      try {
        dispatch(logout());
        dispatch(emptyBalances());
        dispatch(emptyMyOpenOrders([]));
        dispatch(emptyMyHistoryOrders([]));
        dispatch(updateMyAccountPage([]));
      } catch (error) {}
    })();
  };
}
