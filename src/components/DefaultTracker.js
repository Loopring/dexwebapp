import { Tracker } from 'react-tracker';

var lastPageView = null;
const trackPageview = ({ url, preUrl }) => {
  if (window._czc) {
    const item = ['_trackPageview', url, preUrl];
    if (
      lastPageView &&
      lastPageView[1] === item[1] &&
      lastPageView[2] === item[2]
    ) {
      return;
    }
    lastPageView = item;
    window._czc.push();
  }
};

var lastEvent = null;
const trackEvent = ({ category, action, label, value, nodeid }) => {
  if (window._czc) {
    const item = ['_trackEvent', category, action, label, value, nodeid];
    if (lastEvent && lastEvent[1] === item[1] && lastEvent[2] === item[2]) {
      return;
    }
    lastEvent = item;
    window._czc.push(item);
  }
};

var lastCustomVar = null;
const setCustomVar = ({ name, value, time }) => {
  if (window._czc) {
    const item = ['_setCustomVar', name, value, time];
    if (
      lastCustomVar &&
      lastCustomVar[1] === item[1] &&
      lastCustomVar[2] === item[2]
    ) {
      return;
    }
    lastCustomVar = item;
    window._czc.push(item);
  }
};

const umengTrack = (event, eventsHistory) => {
  switch (event.type) {
    case 'SHOW_REGISTER_ACCOUNT':
    case 'SHOW_DEPOSIT':
    case 'SHOW_WITHDRAW':
    case 'SHOW_LOGOUT_MODAL':
    case 'SHOW_LOGIN_MODAL':
    case 'SHOW_RESET_PASSWORD_MODAL':
      trackPageview({ url: JSON.stringify(event) });
      break;

    case '@@router/LOCATION_CHANGE':
      trackPageview({ url: JSON.stringify(event.payload.location) });
      break;

    case 'LOCATION_CHANGE':
      trackPageview({ url: JSON.stringify(event.data) });
      break;

    case 'CHANGE_LANGUAGE':
      setCustomVar({ name: 'LANG', value: event.data.lang });
      break;

    case 'CHANGE_CURRENCY':
      setCustomVar({ name: 'CURRENCY', value: event.data.currency });
      break;

    case 'CHANGE_THEME':
      setCustomVar({ name: 'THEME', value: event.data.themeName });
      break;

    case 'USER_NOTIFICATION':
      trackEvent({ category: 'NOTIFICATION', action: event.data.message });
      break;

    // case 'WALLET_UNLOCKED':
    //     setCustomVar({ name: 'ADDRESS', value: event.data.address });
    //     break;

    case 'USER_STATE':
      trackEvent({ category: 'STATE', action: event.data.state });
      break;

    case 'SELECT_WALLET':
      trackEvent({ category: 'SELECT_WALLET', action: event.data.type });
      break;

    case 'CONNECT_TO_META_MASK':
    case 'UPDATE_META_MASK':
    case 'SHOW_EXPORT_ACCOUNT':
    case 'SHOW_ENTER_PASSWORD':
    case 'SHOW_SIDEBAR':
    case 'INITIALIZE_INFO':
    case 'SET_COLOR':
    case 'DETECT_IF_META_MASK_INSTALLED':
    case 'UPDATE_TRADES':
    case 'UPDATE_ORDER_BOOKS':
    case 'UPDATE_TICKER':
    case 'UPDATE_PRICE':
    case 'UPDATE_TRADE_TYPE':
    case 'UPDATE_AMOUNT':
    case 'UPDATE_CANDLE':
    case 'UPDATE_MARKET_LIST':
    case 'UPDATE_LEGAL_PRICE':
    case 'UPDATE_SOCKET_ORDER_BOOKS':
    case 'EXTEND_TRADES':
    case 'FETCH_ACCOUNTS_DATA_SUCCESS':
    case 'UPDATE_MY_OPEN_ORDERS':
    case 'UPDATE_MY_BALANCES':
    case 'UPDATE_MY_HISTORY_ORDERS':
    case 'UPDATE_NONCE':
    case 'UPDATE_GAS_PRICE':
    case 'UPDATE_ACCOUNT':
    case 'GET_DATA_FROM_LOCALSTORAGE':
      break;

    default:
  }
};

const tracker = new Tracker([umengTrack]);

export { umengTrack, tracker };
