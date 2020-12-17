import { getCommissionRewardRank } from 'lightcone/api/CommissionRewardAPI';

export const UPDATE_COMMISSION_REWARD_RANK = 'UPDATE_COMMISSION_REWARD_RANK';
export const FETCH_COMMISSION_REWARD_RANK = 'FETCH_COMMISSION_REWARD_RANK';

export const UPDATE_MY_COMMISSION_REWARD = 'UPDATE_MY_COMMISSION_REWARD';
export const UPDATE_COMMISSION_REWARD_MY_REWARD_TABLE_PAGINATION =
  'UPDATE_COMMISSION_REWARD_MY_REWARD_TABLE_PAGINATION';

export function updateCommissionRewardRank(market, rewards) {
  return {
    type: UPDATE_COMMISSION_REWARD_RANK,
    payload: {
      market,
      rewards,
    },
  };
}

export function fetchCommissionRewardRank(market, top, tokens) {
  return (dispatch) => {
    (async () => {
      try {
        const rewards = await getCommissionRewardRank(market, top, tokens);
        dispatch(updateCommissionRewardRank(market, rewards));
      } catch (error) {
        console.log(error);
      }
    })();
  };
}

export function updateMyCommissionReward(market, rewards) {
  return {
    type: UPDATE_MY_COMMISSION_REWARD,
    payload: {
      market,
      rewards,
    },
  };
}

export function updateCommissionRewardMyRewardTablePagination(
  market,
  pagination
) {
  return {
    type: UPDATE_COMMISSION_REWARD_MY_REWARD_TABLE_PAGINATION,
    payload: {
      market,
      pagination,
    },
  };
}
