import { arrToTrade, getTrade } from "lightcone/api/LightconeAPI";

export const UPDATE_TRADES = "UPDATE_TRADES";
export const EXTEND_TRADES = "EXTEND_TRADES";
export const EMPTY_TRADES = "EMPTY_TRADES";

export function emptyTrades() {
  return {
    type: "EMPTY_TRADES",
    payload: {},
  };
}

export function updateTrades(trades) {
  return {
    type: UPDATE_TRADES,
    payload: {
      trades,
    },
  };
}

export function extendTrades(newTrades) {
  return {
    type: EXTEND_TRADES,
    payload: {
      newTrades,
    },
  };
}

export function fetchTradeHistory(market) {
  return (dispatch) => {
    (async () => {
      const limit = 40;
      let trades = await getTradeFromRelay(market, limit);
      try {
        const data = [];
        for (let i = 0; i < trades.length; i++) {
          const trade = trades[i];
          if (trade.length !== 7) {
            continue;
          }
          data.push(arrToTrade(trade));
        }
        dispatch(updateTrades(data));
      } catch (error) {
        console.log(error);
        fetchTradeHistory(market);
      }
    })();
  };
}

async function getTradeFromRelay(market, limit) {
  try {
    return await getTrade(market, limit);
  } catch (e) {
    console.log(e);
    if (e.message.indexOf("timeout") !== -1) {
      return await getTradeFromRelay(market, limit);
    }
  }
}
