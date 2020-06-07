import config from "../config";
import request from "../common/request";

export async function getLiquidityMiningTotal(accountId, apiKey, tokens) {
  const params = {
    accountId,
  };

  const headers = {
    "X-API-KEY": apiKey,
  };

  const response = await request({
    method: "GET",
    url: "/api/v2/sidecar/liquidityMiningTotal",
    headers: headers,
    params,
  });

  const rewards = response["data"];

  let updatedRewards = [];
  for (let i = 0; i < rewards.length; i = i + 1) {
    const reward = rewards[i];
    let updatedReward = { ...reward };
    const tokenId = updatedReward["tokenId"];
    const token = config.getTokenByTokenId(tokenId, tokens);
    updatedReward["amount"] = config.fromWEI(
      token.symbol,
      reward["amount"],
      tokens
    );
    updatedReward["issued"] = config.fromWEI(
      token.symbol,
      reward["issued"],
      tokens
    );
    updatedReward["token"] = token;
    updatedRewards.push(updatedReward);
  }

  return updatedRewards;
}

export async function getLiquidityMining(market, accountId, apiKey, tokens) {
  const params = {
    market,
    accountId,
    size: 120,
  };

  const headers = {
    "X-API-KEY": apiKey,
  };

  const response = await request({
    method: "GET",
    url: "/api/v2/sidecar/liquidityMining",
    headers: headers,
    params,
  });

  const rewards = response["data"];

  let updatedRewards = [];
  for (let i = 0; i < rewards.length; i = i + 1) {
    try {
      const reward = rewards[i];
      let updatedReward = { ...reward };
      updatedReward["rank"] = 0;
      const tokenId = updatedReward["tokenId"];
      const token = config.getTokenByTokenId(tokenId, tokens);
      updatedReward["amount"] = config.fromWEI(
        token.symbol,
        reward["amount"],
        tokens
      );
      updatedRewards.push(updatedReward);
    } catch (error) {
      continue;
    }
  }

  return updatedRewards;
}

export async function getLiquidityMiningRank(market, top, tokens) {
  const params = {
    market,
    top,
  };

  const headers = {};

  const response = await request({
    method: "GET",
    url: "/api/v2/sidecar/liquidityMiningRank",
    headers: headers,
    params,
  });

  const rewards = response["data"];

  let updatedRewards = [];
  for (let i = 0; i < rewards.length; i = i + 1) {
    const reward = rewards[i];
    let updatedReward = { ...reward };
    updatedReward["rank"] = Number(reward["rank"]) + 1;
    const tokenId = updatedReward["tokenId"];
    const token = config.getTokenByTokenId(tokenId, tokens);
    updatedReward["reward"] = config.fromWEI(
      token.symbol,
      reward["reward"],
      tokens
    );
    updatedRewards.push(updatedReward);
  }

  return updatedRewards;
}
