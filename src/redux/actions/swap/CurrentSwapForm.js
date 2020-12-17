export const SET_SWAP_PAIR = 'SET_SWAP_PAIR';
export const SET_SWAP_SPLIPPAGE_TOLERANCE = 'SET_SWAP_SPLIPPAGE_TOLERANCE';

export function setSwapPair(token0, token1) {
  const swapPair = `${token0}-${token1}`;
  return {
    type: SET_SWAP_PAIR,
    payload: {
      swapPair,
    },
  };
}

export function setSwapSlippageTolerance(slippageTolerance) {
  return {
    type: SET_SWAP_SPLIPPAGE_TOLERANCE,
    payload: {
      slippageTolerance,
    },
  };
}
