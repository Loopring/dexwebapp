import { request } from '../../../common';

export async function cancelOrders(
  accountId,
  orderHash,
  clientOrderId,
  signed,
  apiKey
) {
  const params = {
    accountId: accountId,
    orderHash: orderHash,
    clientOrderId: clientOrderId,
  };
  const signature = signed.Rx + ',' + signed.Ry + ',' + signed.s;
  const headers = {
    'X-API-KEY': apiKey,
    'X-API-SIG': signature,
  };
  return await request({
    method: 'DELETE',
    url: '/api/v2/orders',
    headers: headers,
    params,
  });
}

export async function cancelAllOrders(accountId, signed, apiKey) {
  const params = {
    accountId: accountId,
  };
  const signature = signed.Rx + ',' + signed.Ry + ',' + signed.s;
  const headers = {
    'X-API-KEY': apiKey,
    'X-API-SIG': signature,
  };
  return await request({
    method: 'DELETE',
    url: '/api/v2/orders',
    headers: headers,
    params,
  });
}

export async function batchCancelByHash(
  accountId,
  orderHashes,
  signed,
  apiKey
) {
  const params = {
    accountId: accountId,
    orderHash: orderHashes.join(),
  };
  const signature = signed.Rx + ',' + signed.Ry + ',' + signed.s;
  const headers = {
    'X-API-KEY': apiKey,
    'X-API-SIG': signature,
  };

  return await request({
    method: 'DELETE',
    url: '/api/v2/orders/byHash',
    headers: headers,
    params,
  });
}

export async function batchCancelByClientOrderId(
  accountId,
  clientOrderIds,
  signed,
  apiKey
) {
  const params = {
    accountId: accountId,
    clientOrderId: clientOrderIds.join(),
  };
  const signature = signed.Rx + ',' + signed.Ry + ',' + signed.s;
  const headers = {
    'X-API-KEY': apiKey,
    'X-API-SIG': signature,
  };

  return await request({
    method: 'DELETE',
    url: '/api/v2/orders/byClientOrderId',
    headers: headers,
    params,
  });
}
