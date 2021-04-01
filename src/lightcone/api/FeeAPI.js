import request from '../common/request';

export async function getOrderFee(accountId, market, tokenB, apiKey) {
  const params = {
    accountId,
    market,
    tokenB,
    amountB: '10000000000000000',
  };
  const headers = {
    'X-API-KEY': apiKey,
  };
  const response = await request({
    method: 'GET',
    url: '/api/v2/user/orderFee',
    headers: headers,
    params,
  });

  return response['data'];
}

export async function getOrderAmount(tokenSymbol) {
  const params = {
    tokenSymbol,
  };
  const headers = {};
  const response = await request({
    method: 'GET',
    url: '/api/v2/user/orderAmount',
    headers: headers,
    params,
  });

  return response['data'];
}

export async function getOrderUserRateAmount(accountId, market, apiKey) {
  const params = {
    accountId,
    market,
  };
  const headers = {
    'X-API-KEY': apiKey,
  };
  const response = await request({
    method: 'GET',
    url: '/api/v2/user/orderUserRateAmount',
    headers: headers,
    params,
  });

  return response['data'];
}

export async function getOffchainFee(
  accountId,
  requestType,
  tokenSymbol,
  amount,
  apiKey
) {
  const params = {
    accountId,
    requestType,
    tokenSymbol,
    amount,
  };
  const headers = {
    'X-API-KEY': apiKey,
  };
  const response = await request({
    method: 'GET',
    url: '/api/v2/user/offchainFee',
    headers: headers,
    params,
  });

  return response['data'];
}
