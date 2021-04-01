import { request } from '../../../common';

export async function getPrice(legal) {
  const response = await request({
    method: 'GET',
    url: '/api/wallet/v3/latestTokenPrices',
    params: {
      currency: legal,
    },
  });
  return response['data'];
}
