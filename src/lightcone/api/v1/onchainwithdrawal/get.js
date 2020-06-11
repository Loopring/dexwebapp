import { request } from '../../../common';

export async function getDistributeInfo(requestId, apiKey) {
  const headers = {
    'X-API-KEY': apiKey,
  };
  const params = { requestId };

  const response = await request({
    method: 'GET',
    url: '/api/v2/getDistributeInfo',
    headers: headers,
    params,
  });

  return response['data'];
}
