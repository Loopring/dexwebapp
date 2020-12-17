import { formatter } from 'lightcone/common';
import { getRecommendedGasPrice } from 'lightcone/api/v1/recommendedGasPrice';

export const UPDATE_GAS_PRICE = 'UPDATE_GAS_PRICE';
export const FETCH_GAS_PRICE = 'FETCH_GAS_PRICE';

export function updateGasPrice(gasPrice) {
  return {
    type: UPDATE_GAS_PRICE,
    payload: {
      gasPrice,
    },
  };
}

export function fetchGasPrice() {
  return (dispatch) => {
    (async () => {
      try {
        const recommendedGasPrice = await getRecommendedGasPrice();
        const gasPrice = formatter.toGWEI(recommendedGasPrice);

        dispatch(updateGasPrice(gasPrice));
      } catch (error) {
        console.log(error);
      }
    })();
  };
}
