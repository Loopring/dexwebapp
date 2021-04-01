import { request } from '../../../common';

export async function getAmmPools() {
  let ammPools = [];
  try {
    const response = await request({
      method: 'GET',
      url: '/api/v2/amm/poolsStats',
    });
    if (response['data']) ammPools = response['data'];
  } catch (error) {}

  return { ammPools };
}
