import {
  UPDATE_LIQUIDITY_MINING_MY_REWARD_TABLE_PAGINATION,
  UPDATE_LIQUIDITY_MINING_RANK,
  UPDATE_MY_LIQUIDITY_MINING,
} from 'redux/actions/LiquidityMining';

const initialState = {
  myRewardTablePaginations: {},
  myRewardCollection: {},

  rewardCollection: {},
};

export const LiquidityMiningReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LIQUIDITY_MINING_RANK: {
      const market = action.payload.market;
      const rewards = action.payload.rewards;
      const rewardCollection = { ...state.rewardCollection };
      rewardCollection[market] = rewards;
      return {
        ...state,
        rewardCollection,
      };
    }

    case UPDATE_MY_LIQUIDITY_MINING: {
      const market = action.payload.market;
      const rewards = action.payload.rewards;
      const myRewardCollection = { ...state.myRewardCollection };
      myRewardCollection[market] = rewards;
      return {
        ...state,
        myRewardCollection,
      };
    }

    case UPDATE_LIQUIDITY_MINING_MY_REWARD_TABLE_PAGINATION: {
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
