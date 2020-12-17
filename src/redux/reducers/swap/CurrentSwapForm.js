import {
  SET_SWAP_PAIR,
  SET_SWAP_SPLIPPAGE_TOLERANCE,
} from 'redux/actions/swap/CurrentSwapForm';
import {
  getLastSwapPair,
  getSlippageTolerance,
  saveLastSwapPair,
  saveSlippageTolerance,
} from 'lightcone/api/localStorgeAPI';

function getCurrentSwapPairInitState() {
  let slippageTolerance = getSlippageTolerance();

  // Get init market from url
  const { pathname } = window.location;
  if (pathname && pathname.includes('/swap/')) {
    let swapPair = pathname.replace('/swap/', '');
    if (swapPair.includes('-') && swapPair.split('-').length === 2) {
      return {
        slippageTolerance,
        swapPair,
        token0: swapPair.split('-')[0],
        token1: swapPair.split('-')[1],
      };
    }
  }

  // Get init swapPair from localStorage
  let lastSwapPair = getLastSwapPair();
  if (lastSwapPair === null) {
    lastSwapPair = 'LRC-ETH';
  }

  // Return default init market
  return {
    slippageTolerance,
    swapPair: lastSwapPair,
    token0: lastSwapPair.split('-')[0],
    token1: lastSwapPair.split('-')[1],
  };
}

const initialState = getCurrentSwapPairInitState();

export const CurrentSwapFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SWAP_PAIR:
      const swapPair = action.payload.swapPair;
      const tokens = swapPair.split('-');
      const token0 = tokens[0];
      const token1 = tokens[1];
      saveLastSwapPair(swapPair);
      return {
        ...state,
        swapPair: swapPair,
        token0,
        token1,
      };
    case SET_SWAP_SPLIPPAGE_TOLERANCE:
      let slippageTolerance = action.payload.slippageTolerance;
      if (slippageTolerance < 0) {
        return {
          ...state,
        };
      }

      if (slippageTolerance > 0) {
        saveSlippageTolerance(slippageTolerance);
      }

      // If it's 0, set it to default value.
      if (slippageTolerance === 0) {
        slippageTolerance = 0.01;
      }

      return {
        ...state,
        slippageTolerance,
      };
    default:
      return state;
  }
};
