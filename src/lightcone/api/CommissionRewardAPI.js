import config from '../config';
import request from '../common/request';

export async function getCommissionRewardTotal(accountId, apiKey, tokens) {
  const params = {
    accountId,
  };

  const headers = {
    'X-API-KEY': apiKey,
  };

  const response = await request({
    method: 'GET',
    url: '/api/v2/sidecar/commissionRewardTotal',
    headers: headers,
    params,
  });

  const rewards = response['data'];

  let updatedRewards = [];
  for (let i = 0; i < rewards.length; i = i + 1) {
    const reward = rewards[i];
    let updatedReward = { ...reward };
    const tokenId = updatedReward['tokenId'];
    const token = config.getTokenByTokenId(tokenId, tokens);
    updatedReward['amount'] = config.fromWEI(
      token.symbol,
      reward['amount'],
      tokens,
      {
        precision: 8,
      }
    );
    updatedReward['issued'] = config.fromWEI(
      token.symbol,
      reward['issued'],
      tokens,
      {
        precision: 8,
      }
    );
    updatedReward['token'] = token;
    updatedRewards.push(updatedReward);
  }

  return updatedRewards;
}

export async function getCommissionReward(
  rewardType,
  accountId,
  apiKey,
  tokens
) {
  const params = {
    rewardType,
    accountId,
    size: 120,
  };

  const headers = {
    'X-API-KEY': apiKey,
  };

  const response = await request({
    method: 'GET',
    url: '/api/v2/sidecar/commissionReward',
    headers: headers,
    params,
  });

  const rewards = response['data'];

  let updatedRewards = [];
  for (let i = 0; i < rewards.length; i = i + 1) {
    try {
      const reward = rewards[i];
      let updatedReward = { ...reward };
      updatedReward['rank'] = 0;
      const tokenId = updatedReward['tokenId'];
      const token = config.getTokenByTokenId(tokenId, tokens);
      const amount = config.fromWEI(token.symbol, reward['reward'], tokens, {
        precision: 8,
      });
      updatedReward['amount'] = `${amount} ${token.symbol}`;
      updatedRewards.push(updatedReward);
    } catch (error) {
      console.log('error', error);
      continue;
    }
  }

  return updatedRewards;
}

export async function getCommissionRewardRank(
  rewardType,
  tokenSymbol,
  top,
  tokens
) {
  const token = config.getTokenBySymbol(tokenSymbol, tokens);
  const params = {
    tokenId: token.tokenId,
    rewardType,
    top,
  };

  const headers = {};

  const response = await request({
    method: 'GET',
    url: '/api/v2/sidecar/commissionRewardRank',
    headers: headers,
    params,
  });

  const rewards = response['data'];

  let updatedRewards = [];
  for (let i = 0; i < rewards.length; i = i + 1) {
    const reward = rewards[i];
    let updatedReward = { ...reward };
    updatedReward['rank'] = Number(reward['rank']) + 1;
    updatedReward['reward'] = config.fromWEI(
      token.symbol,
      reward['reward'],
      tokens
    );
    updatedRewards.push(updatedReward);
  }

  return updatedRewards;
}
