import { getPrice } from "lightcone/api/v1/price";

export const UPDATE_CMC_LEGAL = "UPDATE_CMC_LEGAL";
export const UPDATE_CMC_PRICE = "UPDATE_CMC_PRICE";
export const FETCH_CMC_PRICE = "FETCH_CMC_PRICE";

export function updateCmcLegal(legal) {
  return (dispatch) => {
    (async () => {
      try {
        const prices = await getPrice(legal);
        dispatch(internalUpdateCmcLegal(legal));
        dispatch(updateCmcPrice(prices));
      } catch (error) {
        console.log(error);
      }
    })();
  };
}

function internalUpdateCmcLegal(legal) {
  return {
    type: UPDATE_CMC_LEGAL,
    payload: {
      legal,
    },
  };
}

export function updateCmcPrice(prices) {
  return {
    type: UPDATE_CMC_PRICE,
    payload: {
      prices,
    },
  };
}

export function fetchCmcPrice(legal) {
  return (dispatch) => {
    (async () => {
      try {
        const prices = await getPrice(legal);
        dispatch(updateCmcPrice(prices));
      } catch (error) {
        console.log(error);
      }
    })();
  };
}
