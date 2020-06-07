import { INITIALIZE_INFO, UPDATE_INFO } from "../actions/ExchangeInfo";

const initialState = {
  isInitialized: false,
  chainId: 0,
  exchangeId: 0,
  exchangeAddress: "",
  onchainFees: [],
  markets: [
    {
      market: "LRC-USDT",
      baseTokenId: 2,
      quoteTokenId: 3,
      precisionForPrice: 4,
      orderbookAggLevels: 5,
      enabled: true,
    },
  ],
  marketNames: ["LRC-USDT"],
  tokens: [
    {
      type: "ETH",
      tokenId: 0,
      symbol: "ETH",
      name: "Ethereum",
      address: "0x0000000000000000000000000000000000000000",
      unit: "",
      decimals: 18,
      precision: 4,
      minOrderAmount: "50000000000000000",
      maxOrderAmount: "50000000000000000000",
      dustOrderAmount: "500000000000000",
    },
    {
      type: "ERC20",
      tokenId: 2,
      symbol: "LRC",
      name: "Loopring",
      address: "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
      unit: "",
      decimals: 18,
      precision: 2,
      minOrderAmount: "100000000000000000000",
      maxOrderAmount: "500000000000000000000000",
      dustOrderAmount: "5000000000000000000",
    },
    {
      type: "ERC20",
      tokenId: 3,
      symbol: "USDT",
      name: "Tether USD",
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      unit: "",
      decimals: 6,
      precision: 2,
      minOrderAmount: "5000000",
      maxOrderAmount: "5000000000",
      dustOrderAmount: "250000",
    },
  ],
};

export const ExchangeInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_INFO:
      return {
        ...action.payload,
        isInitialized: true,
      };
    case UPDATE_INFO:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
