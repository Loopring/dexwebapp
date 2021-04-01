import { request } from '../../../common';

export async function getSwapRankByAddress(market, address) {
  const params = {
    ammPoolMarket: market,
    owner: address,
  };
  let rankInfo = { rank: 'N/A', volume: '0.00' };
  try {
    const response = await request({
      method: 'GET',
      url: '/api/v2/game/user/rank',
      params,
    });
    if (response['data']) rankInfo = response['data'];
  } catch (error) {}
  return { rankInfo };
}

export async function getSwapTopK(market) {
  const params = {
    ammPoolMarket: market,
  };
  let topk = [];

  try {
    const response = await request({
      method: 'GET',
      url: '/api/v2/game/rank',
      params,
    });
    if (response['data'] && response['data']['userRankList'])
      topk = response['data']['userRankList'];
  } catch (error) {}

  return { topk };
}
