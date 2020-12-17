import { getExchangeInfo } from 'lightcone/api/LightconeAPI';
import { getMarketInfo } from 'lightcone/api/v1/marketinfo';
import { getTokenInfo } from 'lightcone/api/v1/tokeninfo';

export const INITIALIZE_INFO = 'INITIALIZE_INFO';
export const UPDATE_INFO = 'UPDATE_INFO';

export function updateInfo(info) {
  return {
    type: UPDATE_INFO,
    payload: {
      ...info,
    },
  };
}

export function updateMarkets(markets) {
  return {
    type: UPDATE_INFO,
    payload: {
      markets,
    },
  };
}

export function updateTokens(tokens) {
  return {
    type: UPDATE_INFO,
    payload: {
      tokens,
    },
  };
}

function initializeInfo(info, markets, marketNames, tokens) {
  return {
    type: INITIALIZE_INFO,
    payload: {
      ...info,
      markets,
      marketNames,
      tokens,
    },
  };
}

export function fetchAllExchangeInfo() {
  return (dispatch) => {
    (async () => {
      const info = await getInfoFromRelay();
      const markets = await getMarketsFromRelay();
      const marketNames = markets.map((val) => {
        return val.market;
      });

      const tokens = await getTokensFromRelay();
      dispatch(initializeInfo(info, markets, marketNames, tokens));
    })();
  };
}

export function fetchInfo() {
  return (dispatch) => {
    (async () => {
      try {
        const info = await getInfoFromRelay();
        dispatch(updateInfo(info));
      } catch (error) {
        console.log(error);
      }
    })();
  };
}

export function fetchMarkets() {
  return (dispatch) => {
    (async () => {
      try {
        const markets = await getMarketsFromRelay();
        dispatch(updateMarkets(markets));
      } catch (error) {
        console.log(error);
      }
    })();
  };
}

export function fetchTokens() {
  return (dispatch) => {
    (async () => {
      try {
        const tokens = await getTokensFromRelay();
        dispatch(updateTokens(tokens));
      } catch (error) {
        console.log(error);
      }
    })();
  };
}

async function getInfoFromRelay() {
  try {
    return await getExchangeInfo();
  } catch (e) {
    console.log(e);
    if (e.message.indexOf('timeout') !== -1) {
      return await getInfoFromRelay();
    } else {
      throw e;
    }
  }
}

async function getMarketsFromRelay() {
  try {
    return await getMarketInfo();
  } catch (e) {
    console.log(e);
    if (e.message.indexOf('timeout') !== -1) {
      return await getMarketsFromRelay();
    }
  }
}

async function getTokensFromRelay() {
  try {
    return await getTokenInfo();
  } catch (e) {
    console.log(e);
    if (e.message.indexOf('timeout') !== -1) {
      return await getTokensFromRelay();
    }
  }
}
