import { getPrice } from 'lightcone/api/v1/price';
import BandChainClient from 'lightcone/oracle/bandchain';

export const UPDATE_LEGAL = 'UPDATE_LEGAL';
export const UPDATE_LEGAL_PRICE = 'UPDATE_LEGAL_PRICE';
export const FETCH_LEGAL_PRICE = 'FETCH_LEGAL_PRICE';

export function updateLegal(legal, source) {
  return (dispatch) => {
    (async () => {
      try {
        let prices = [];
        let cmcPrices = await getPrice(legal);
        let bandPrices = [];
        if (source === 'BAND') {
          const bandchain = new BandChainClient();
          bandPrices = await bandchain.getOraclePrice(legal);
        }

        let priceDict = {};
        for (const p in cmcPrices) {
          priceDict[cmcPrices[p].symbol] = cmcPrices[p];
        }

        for (const p in bandPrices) {
          priceDict[bandPrices[p].symbol] = bandPrices[p];
        }

        for (const key in priceDict) {
          prices.push(priceDict[key]);
        }

        dispatch(internalUpdateLegal(legal));
        dispatch(updateLegalPrice(prices));
      } catch (error) {
        console.log(error);
      }
    })();
  };
}

function internalUpdateLegal(legal) {
  return {
    type: UPDATE_LEGAL,
    payload: {
      legal,
    },
  };
}

export function updateLegalPrice(prices) {
  return {
    type: UPDATE_LEGAL_PRICE,
    payload: {
      prices,
    },
  };
}

export function fetchLegalPrice(legal, source) {
  return (dispatch) => {
    (async () => {
      try {
        let prices = [];
        let cmcPrices = await getPrice(legal);
        let bandPrices = [];
        if (source === 'BAND') {
          const bandchain = new BandChainClient();
          bandPrices = await bandchain.getOraclePrice(legal);
        }

        let priceDict = {};
        for (const p in cmcPrices) {
          priceDict[cmcPrices[p].symbol] = cmcPrices[p];
        }

        for (const p in bandPrices) {
          priceDict[bandPrices[p].symbol] = bandPrices[p];
        }

        for (const key in priceDict) {
          prices.push(priceDict[key]);
        }

        dispatch(updateLegalPrice(prices));
      } catch (error) {
        console.log(error);
      }
    })();
  };
}
