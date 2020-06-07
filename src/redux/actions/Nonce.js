import { getEthNonce } from "lightcone/api/v1/ethnonce";

export const UPDATE_NONCE = "UPDATE_NONCE";
export const FETCH_NONCE = "FETCH_NONCE";

export function updateNonce(nonce) {
  return {
    type: UPDATE_NONCE,
    payload: {
      nonce,
    },
  };
}

export function fetchNonce(address) {
  return (dispatch) => {
    (async () => {
      try {
        const nonce = await getEthNonce(address);
        dispatch(updateNonce(nonce));
      } catch (error) {
        console.log(error);
      }
    })();
  };
}
