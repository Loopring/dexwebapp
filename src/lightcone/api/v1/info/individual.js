import { request } from '../../../common';

export async function getIndividual(accountId) {
  const params = {
    owner: accountId,
  };
  let individual = [];
  try {
    const response = await request({
      method: 'GET',
      url: '/api/v2/amm/user/rewards',
      params,
    });
    if (response['data']) individual = response['data'];
  } catch (error) {}
  return { individual };
}
