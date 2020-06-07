export const SET_MARKET = "SET_MARKET";

export function setMarket(marketName) {
  return {
    type: SET_MARKET,
    payload: {
      marketName,
    },
  };
}
