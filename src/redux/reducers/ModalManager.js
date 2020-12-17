import {
  SHOW_CONNECT_TO_WALLET_MODAL,
  SHOW_DEPOSIT,
  SHOW_ENTER_PASSWORD,
  SHOW_EXPORT_ACCOUNT,
  SHOW_LOGIN_MODAL,
  SHOW_LOGOUT_MODAL,
  SHOW_REFERRAL_MODAL,
  SHOW_REGISTER_ACCOUNT,
  SHOW_RESET_API_KEY_MODAL,
  SHOW_RESET_PASSWORD_MODAL,
  SHOW_SIDEBAR,
  SHOW_TRANSFER,
  SHOW_WECHAT_MODAL,
  SHOW_WITHDRAW,
} from 'redux/actions/ModalManager';

const initialState = {
  isRegisterAccountModalVisible: false,
  isResetPasswordModalVisible: false,
  isResetApiKeyModalVisible: false,
  isWechatModalVisible: false,
  isReferralModalVisible: false,
  isLoginModalVisible: false,
  isTransferModalVisible: false,
  transferToken: 'ETH',
  isDepositModalVisible: false,
  depositToken: 'ETH',
  isWithdrawModalVisible: false,
  withdrawalToken: 'ETH',
  isLogoutModalVisible: false,
  isExportAccountModalVisible: false,
  isEnterPasswordModalVisible: false,
  isSideBarVisible: false,
  isConnectToWalletModalVisiable: false,
};

export const ModalManagerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_REGISTER_ACCOUNT:
      return {
        ...state,
        isRegisterAccountModalVisible: action.payload.show,
      };
    case SHOW_LOGIN_MODAL:
      return {
        ...state,
        isLoginModalVisible: action.payload.show,
      };
    case SHOW_RESET_PASSWORD_MODAL:
      return {
        ...state,
        isResetPasswordModalVisible: action.payload.show,
      };
    case SHOW_RESET_API_KEY_MODAL:
      return {
        ...state,
        isResetApiKeyModalVisible: action.payload.show,
      };
    case SHOW_WECHAT_MODAL:
      return {
        ...state,
        isWechatModalVisible: action.payload.show,
      };
    case SHOW_REFERRAL_MODAL:
      return {
        ...state,
        isReferralModalVisible: action.payload.show,
      };
    case SHOW_TRANSFER: {
      if (action.payload.show) {
        return {
          ...state,
          isTransferModalVisible: action.payload.show,
          transferToken: action.payload.token || 'ETH',
        };
      } else {
        return {
          ...state,
          isTransferModalVisible: action.payload.show,
          transferToken: 'ETH',
        };
      }
    }
    case SHOW_DEPOSIT:
      if (action.payload.show) {
        return {
          ...state,
          isDepositModalVisible: action.payload.show,
          depositToken: action.payload.token || 'ETH',
        };
      } else {
        return {
          ...state,
          isDepositModalVisible: action.payload.show,
          depositToken: 'ETH',
        };
      }
    case SHOW_WITHDRAW:
      if (action.payload.show) {
        return {
          ...state,
          isWithdrawModalVisible: action.payload.show,
          withdrawalToken: action.payload.token || 'ETH',
        };
      } else {
        return {
          ...state,
          isWithdrawModalVisible: action.payload.show,
          withdrawalToken: 'ETH',
        };
      }
    case SHOW_LOGOUT_MODAL:
      return {
        ...state,
        isLogoutModalVisible: action.payload.show,
      };
    case SHOW_EXPORT_ACCOUNT:
      return {
        ...state,
        isExportAccountModalVisible: action.payload.show,
      };
    case SHOW_ENTER_PASSWORD:
      return {
        ...state,
        isEnterPasswordModalVisible: action.payload.show,
      };
    case SHOW_SIDEBAR:
      return {
        ...state,
        isSideBarVisible: action.payload.show,
      };
    case SHOW_CONNECT_TO_WALLET_MODAL:
      return {
        ...state,
        isConnectToWalletModalVisiable: action.payload.show,
      };
    default:
      return state;
  }
};
