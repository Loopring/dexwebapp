import { INITIALIZE_INFO, UPDATE_INFO } from '../actions/ExchangeInfo';
import config from 'lightcone/config';

const initialState = {
  isInitialized: false,
  chainId: 0,
  exchangeId: 0,
  exchangeAddress: '',
  onchainFees: [],
  markets: [
    {
      market: 'DAI-USDT',
      baseTokenId: 5,
      quoteTokenId: 3,
      maxNumbersOfOrder: 500,
      precisionForPrice: 4,
      orderbookAggLevels: 2,
      precisionForAmount: 2,
      precisionForTotal: 2,
      enabled: true,
    },
  ],
  marketNames: ['DAI-USDT'],
  tokens: [
    {
      type: 'ETH',
      tokenId: 0,
      symbol: 'ETH',
      name: 'Ethereum',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      precision: 7,
      minOrderAmount: '1000000000000000',
      maxOrderAmount: '10000000000000000000',
      dustOrderAmount: '10000000000000000',
      fastWithdrawLimit: '20000000000000000000',
      enabled: true,
    },
    {
      type: 'ERC20',
      tokenId: 1,
      symbol: 'LRC',
      name: 'Loopring',
      address: '0xfc28028d9b1f6966fe74710653232972f50673be',
      decimals: 18,
      precision: 6,
      minOrderAmount: '1000000000000000000',
      maxOrderAmount: '100000000000000000000000',
      dustOrderAmount: '10000000000000000000',
      fastWithdrawLimit: '20000000000000000000000',
      enabled: true,
    },
    {
      type: 'ERC20',
      tokenId: 5,
      symbol: 'LTLRCETH',
      name: 'LRC-ETH-Pool-2',
      address: '0x9f68cb2f9a112fc207f5776b4c1cd196f53ced8a',
      decimals: 8,
      precision: 6,
      minOrderAmount: '100000000',
      maxOrderAmount: '10000000000000',
      dustOrderAmount: '1000000000',
      fastWithdrawLimit: '20000000000',
      enabled: true,
    },
  ],
  legalPriceSource: 'BAND',
};

export const ExchangeInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_INFO:
      const localTokens = config.getLocalTokens();
      const _tokens = action.payload.tokens
        .filter(
          (token) =>
            !localTokens.find(
              (lt) => lt.address.toLowerCase() === token.address.toLowerCase()
            )
        )
        .map((token) => {
          return {
            ...token,
            transferEnabled: true,
          };
        });

      return {
        ...action.payload,
        tokens: localTokens.concat(_tokens).sort((a, b) => {
          if (a.symbol < b.symbol) {
            return -1;
          } else if (a.symbol > b.symbol) {
            return 1;
          }
          return 0;
        }),
        isInitialized: true,
      };
    case UPDATE_INFO:
      if (action.payload.tokens) {
        const localTokens = config.getLocalTokens();
        const _tokens = action.payload.tokens
          .filter(
            (token) =>
              !localTokens.find(
                (lt) => lt.address.toLowerCase() === token.address.toLowerCase()
              )
          )
          .map((token) => {
            return {
              ...token,
              transferEnabled: true,
            };
          });

        return {
          ...state,
          ...action.payload,
          tokens: localTokens.concat(_tokens).sort((a, b) => {
            if (a.symbol < b.symbol) {
              return -1;
            } else if (a.symbol > b.symbol) {
              return 1;
            } else {
              return 0;
            }
          }),
        };
      } else {
        return {
          ...state,
          ...action.payload,
        };
      }

    default:
      return state;
  }
};
