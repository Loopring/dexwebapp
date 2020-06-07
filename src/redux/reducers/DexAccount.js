import {
  CLEAR_KEY_PAIR_CIPHER_TEXT,
  GET_DATA_FROM_LOCALSTORAGE,
  LOGGED_IN,
  LOGOUT,
  NOT_REGISTERED,
  REGISTERED,
  UNDEFINED,
  UPDATE_ACCOUNT,
  WALLET_UNCONNECTED,
  getAllAccountStates,
} from "redux/actions/DexAccount";

import {
  getAccountFromLocal,
  removeAccountFromLocal,
  saveAccountToLocal,
  saveLoginRecord,
} from "lightcone/api/localStorgeAPI";

/**
 * account :
 * {
 * walletType,
 * address
 * apiKey,
 * accountId
 * publicX,
 * publicY
 * }
 * */
const initialState = {
  account: {
    state: UNDEFINED,
  },
};

export const DexAccountReducer = (state = initialState, action) => {
  const { payload } = action;
  switch (action.type) {
    case CLEAR_KEY_PAIR_CIPHER_TEXT: {
      removeAccountFromLocal();
      return {
        account: {
          ...state.account,
          accountKey: "",
        },
      };
    }

    /**
     * 是否需要保留state总account之前的元素需要再考虑
     * **/
    case UPDATE_ACCOUNT: {
      let latestAccount = {
        ...state.account,
        ...payload.account,
      };

      // console.log('window.wallet.walletType', window.wallet.walletType);

      if (window.wallet && window.wallet.walletType) {
        latestAccount["walletType"] = window.wallet.walletType;
      }
      saveAccountToLocal(latestAccount);

      return {
        ...state,
        account: latestAccount,
      };
    }
    /**
     * 当前state中account 还没有,因此payload 必须传address
     * **/
    case GET_DATA_FROM_LOCALSTORAGE: {
      let account = getAccountFromLocal(payload.address);

      account = account ? account : { address: payload.address };

      /**
       * sessionStorage 设定了有效期,在有效期内用户不会做过Reset AccountKey 操作
       */
      if (
        getAllAccountStates().includes(account.state) === false ||
        account.state === WALLET_UNCONNECTED
      ) {
        account.state = NOT_REGISTERED;
      }
      if (account.state === LOGGED_IN) {
        account.state = account.accountKey ? LOGGED_IN : REGISTERED;
      }

      saveLoginRecord();

      return {
        ...state,
        account,
      };
    }

    case LOGOUT: {
      // Reset web3, windows, etheruem in window
      // window.web3 = null;
      // We don't reset ethereum here
      // window.ethereum = null;
      // window.wallet = null;
      removeAccountFromLocal(state.account.address);
      // removeWalletType();

      return {
        account: {
          ...state.account,
          state: REGISTERED,
          accountKey: "",
        },
      };
    }

    default:
      return state;
  }
};
