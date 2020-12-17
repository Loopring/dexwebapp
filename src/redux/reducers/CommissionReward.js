import {
  UPDATE_COMMISSION_REWARD_MY_REWARD_TABLE_PAGINATION,
  UPDATE_COMMISSION_REWARD_RANK,
  UPDATE_MY_COMMISSION_REWARD,
} from 'redux/actions/CommissionReward';

const initialState = {
  myRewardTablePaginations: {},
  myRewardCollection: {},

  rewardCollection: {},
};

export const CommissionRewardReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_COMMISSION_REWARD_RANK: {
      const market = action.payload.market;
      const rewards = action.payload.rewards;
      const rewardCollection = { ...state.rewardCollection };
      rewardCollection[market] = rewards;
      return {
        ...state,
        rewardCollection,
      };
    }

    case UPDATE_MY_COMMISSION_REWARD: {
      const market = action.payload.market;
      const rewards = action.payload.rewards;
      const myRewardCollection = { ...state.myRewardCollection };
      myRewardCollection[market] = rewards;
      return {
        ...state,
        myRewardCollection,
      };
    }

    case UPDATE_COMMISSION_REWARD_MY_REWARD_TABLE_PAGINATION: {
      const market = action.payload.market;
      const pagination = action.payload.pagination;
      const myRewardTablePaginations = { ...state.myRewardTablePaginations };
      myRewardTablePaginations[market] = pagination;
      return {
        myRewardTablePaginations,
      };
    }

    default:
      return state;
  }
};
