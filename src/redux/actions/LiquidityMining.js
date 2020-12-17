import { getLiquidityMiningRank } from 'lightcone/api/LiquidityMiningAPI';

export const UPDATE_LIQUIDITY_MINING_RANK = 'UPDATE_LIQUIDITY_MINING_RANK';
export const FETCH_LIQUIDITY_MINING_RANK = 'FETCH_LIQUIDITY_MINING_RANK';

export const UPDATE_MY_LIQUIDITY_MINING = 'UPDATE_MY_LIQUIDITY_MINING';
export const UPDATE_LIQUIDITY_MINING_MY_REWARD_TABLE_PAGINATION =
  'UPDATE_LIQUIDITY_MINING_MY_REWARD_TABLE_PAGINATION';

export function updateLiquidityMiningRank(market, rewards) {
  return {
    type: UPDATE_LIQUIDITY_MINING_RANK,
    payload: {
      market,
      rewards,
    },
  };
}

export function fetchLiquidityMiningRank(market, top, tokens) {
  return (dispatch) => {
    (async () => {
      try {
        const rewards = await getLiquidityMiningRank(market, top, tokens);
        dispatch(updateLiquidityMiningRank(market, rewards));
      } catch (error) {
        console.log(error);
      }
    })();
  };
}

export function updateMyLiquidityMining(market, rewards) {
  return {
    type: UPDATE_MY_LIQUIDITY_MINING,
    payload: {
      market,
      rewards,
    },
  };
}

export function updateLiquidityMiningMyRewardTablePagination(
  market,
  pagination
) {
  return {
    type: UPDATE_LIQUIDITY_MINING_MY_REWARD_TABLE_PAGINATION,
    payload: {
      market,
      pagination,
    },
  };
}
