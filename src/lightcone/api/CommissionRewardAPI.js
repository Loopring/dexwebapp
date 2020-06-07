import config from "../config";
import request from "../common/request";

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
    method: "GET",
    url: "/api/v2/sidecar/commissionRewardRank",
    headers: headers,
    params,
  });

  const rewards = response["data"];

  let updatedRewards = [];
  for (let i = 0; i < rewards.length; i = i + 1) {
    const reward = rewards[i];
    let updatedReward = { ...reward };
    updatedReward["rank"] = Number(reward["rank"]) + 1;
    updatedReward["reward"] = config.fromWEI(
      token.symbol,
      reward["reward"],
      tokens
    );
    updatedRewards.push(updatedReward);
  }

  return updatedRewards;
}
