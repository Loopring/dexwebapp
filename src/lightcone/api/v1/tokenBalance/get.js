import { request } from '../../../common';
import config from '../../../config';

export async function getTokenBalance(owner, symbols, tokens) {
  let tokenAddress = symbols
    .map((symbol) => config.getTokenBySymbol(symbol, tokens).address)
    .join();
  const params = {
    owner,
    token: tokenAddress,
  };

  const response = await request({
    method: 'GET',
    url: '/api/v2/tokenBalances',
    params,
  });

  return response['data'];
}
