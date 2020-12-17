import request from '../../../common/request';

export async function submitTransfer(data, ecdsaSig, apiKey) {
  const headers = {
    'X-API-KEY': apiKey,
    'X-API-SIG': ecdsaSig,
  };

  const response = await request({
    method: 'POST',
    url: '/api/v2/transfer',
    headers: headers,
    data: data,
  });

  return response['data'];
}
