import { getTicker } from "lightcone/api/LightconeAPI";

export const UPDATE_TICKER = "UPDATE_TICKER";
export const REST_TICKER = "REST_TICKER";

export function restTicker() {
  return {
    type: REST_TICKER,
    payload: {},
  };
}

export function updateTicker(ticker) {
  return {
    type: UPDATE_TICKER,
    payload: {
      ticker,
    },
  };
}

export function fetchTicker(market, tokens) {
  return (dispatch) => {
    (async () => {
      try {
        const tickers = await getTicker([market], tokens);
        const ticker = tickers[0];
        dispatch(updateTicker(ticker));
      } catch (error) {}
    })();
  };
}
