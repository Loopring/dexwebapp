import { SET_MARKET } from "redux/actions/market/CurrentMarket";
import {
  getLastTradePage,
  saveLastTradePage,
} from "lightcone/api/localStorgeAPI";

function getCurrentMarketInitState() {
  // Get init market from url
  const { pathname } = window.location;
  if (pathname && pathname.includes("/trade/")) {
    let current = pathname.replace("/trade/", "");
    if (current.includes("-") && current.split("-").length === 2) {
      return {
        current,
        baseTokenSymbol: current.split("-")[0],
        quoteTokenSymbol: current.split("-")[1],
      };
    }
  }

  // Get init market from localStorage
  let lastTradePage = getLastTradePage();
  if (lastTradePage === null) {
    lastTradePage = "LRC-USDT";
  }

  // Return default init market
  return {
    current: lastTradePage,
    baseTokenSymbol: "LRC",
    quoteTokenSymbol: "USDT",
  };
}

const initialState = getCurrentMarketInitState();

export const CurrentMarketReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MARKET:
      const marketName = action.payload.marketName;
      const tokens = marketName.split("-");
      const baseTokenSymbol = tokens[0];
      const quoteTokenSymbol = tokens[1];
      saveLastTradePage(marketName);
      return {
        ...state,
        current: marketName,
        baseTokenSymbol,
        quoteTokenSymbol,
      };
    default:
      return state;
  }
};
