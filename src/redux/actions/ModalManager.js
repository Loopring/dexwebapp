export const SHOW_REGISTER_ACCOUNT = 'SHOW_REGISTER_ACCOUNT';
export const SHOW_TRANSFER = 'SHOW_TRANSFER';
export const SHOW_DEPOSIT = 'SHOW_DEPOSIT';
export const SHOW_WITHDRAW = 'SHOW_WITHDRAW';
export const SHOW_LOGOUT_MODAL = 'SHOW_LOGOUT_MODAL';
export const SHOW_EXPORT_ACCOUNT = 'SHOW_EXPORT_ACCOUNT';
export const SHOW_ENTER_PASSWORD = 'SHOW_ENTER_PASSWORD';

export const SHOW_LOGIN_MODAL = 'SHOW_LOGIN_MODAL';
export const SHOW_RESET_PASSWORD_MODAL = 'SHOW_RESET_PASSWORD_MODAL';
export const SHOW_RESET_API_KEY_MODAL = 'SHOW_RESET_API_KEY_MODAL';

export const SHOW_WECHAT_MODAL = 'SHOW_WECHAT_MODAL';
export const SHOW_REFERRAL_MODAL = 'SHOW_REFERRAL_MODAL';

export const SHOW_SIDEBAR = 'SHOW_SIDEBAR';

export const SHOW_CONNECT_TO_WALLET_MODAL = 'SHOW_CONNECT_TO_WALLET_MODAL';

export function registerAccountModal(show) {
  return {
    type: SHOW_REGISTER_ACCOUNT,
    payload: {
      show,
    },
  };
}

export function loginModal(show) {
  return {
    type: SHOW_LOGIN_MODAL,
    payload: {
      show,
    },
  };
}

export function resetPasswordModal(show) {
  return {
    type: SHOW_RESET_PASSWORD_MODAL,
    payload: {
      show,
    },
  };
}

export function showResetApiKeyModal(show) {
  return {
    type: SHOW_RESET_API_KEY_MODAL,
    payload: {
      show,
    },
  };
}

export function showWechatModal(show) {
  return {
    type: SHOW_WECHAT_MODAL,
    payload: {
      show,
    },
  };
}

export function showReferralModal(show) {
  return {
    type: SHOW_REFERRAL_MODAL,
    payload: {
      show,
    },
  };
}

export function showTransferModal(show, token) {
  return {
    type: SHOW_TRANSFER,
    payload: {
      show,
      token,
    },
  };
}

export function showDepositModal(show, token) {
  return {
    type: SHOW_DEPOSIT,
    payload: {
      show,
      token,
    },
  };
}

export function showWithdrawModal(show, token) {
  return {
    type: SHOW_WITHDRAW,
    payload: {
      show,
      token,
    },
  };
}

export function showLogoutModal(show) {
  return {
    type: SHOW_LOGOUT_MODAL,
    payload: {
      show,
    },
  };
}

export function showExportAccountModal(show) {
  return {
    type: SHOW_EXPORT_ACCOUNT,
    payload: {
      show,
    },
  };
}

export function showEnterPasswordModal(show) {
  return {
    type: SHOW_ENTER_PASSWORD,
    payload: {
      show,
    },
  };
}

export function showSideBar(show) {
  return {
    type: SHOW_SIDEBAR,
    payload: {
      show,
    },
  };
}

export function showConnectToWalletModal(show) {
  return {
    type: SHOW_CONNECT_TO_WALLET_MODAL,
    payload: {
      show,
    },
  };
}
