import { mapAmountInUI } from "../../LightconeAPI";
import { request } from "../../../common";
import config from "../../../config";
const BigNumber = require("bignumber.js");

// tokenIds is skip to get all tokens
export async function getBalances(accountId, apiKey, tokens, skip, limit) {
  const params = {
    accountId,
    skip,
    limit,
  };
  const headers = {
    "X-API-KEY": apiKey,
  };
  const response = await request({
    method: "GET",
    url: "/api/v2/user/balances",
    headers: headers,
    params,
  });

  const balances = response["data"];
  return map(balances, tokens);
}

// Map API modal to UI modal
export function map(balances, configTokens) {
  let updatedBalances = [];

  for (let i = 0; i < balances.length; i = i + 1) {
    const balance = balances[i];
    let updatedBalance = { ...balance };
    const tokenId = updatedBalance["tokenId"];
    let token = config.getTokenByTokenId(tokenId, configTokens);

    updatedBalance["token"] = token;

    const totalAmount = balance["totalAmount"];

    // const totalAmountInString = mapAmountInUI(token, totalAmount, configTokens);
    const totalAmountInString = config.fromWEI(
      token.symbol,
      totalAmount,
      configTokens
    );
    updatedBalance["totalAmountInString"] = totalAmountInString;

    const frozenAmount = balance["amountLocked"];
    // const frozenAmountInString = mapAmountInUI(
    const frozenAmountInString = config.fromWEI(
      token.symbol,
      frozenAmount,
      configTokens
    );
    updatedBalance["frozenAmountInString"] = frozenAmountInString;
    updatedBalance["frozenAmount"] = frozenAmount;

    if (totalAmount !== "0") {
      let percentage =
        1 -
        BigNumber(frozenAmount).dividedBy(BigNumber(totalAmount)).toNumber();
      percentage = Math.floor(percentage * 100);

      const availableInBigNumber = BigNumber(totalAmount).minus(frozenAmount);
      const available = mapAmountInUI(
        token,
        availableInBigNumber,
        configTokens
      );
      const availableInAssetPanel = config.fromWEI(
        token.symbol,
        availableInBigNumber,
        configTokens
      );
      updatedBalance["percentage"] = percentage;
      updatedBalance["available"] = available;
      updatedBalance["availableInAssetPanel"] = availableInAssetPanel;
    } else {
      updatedBalance["percentage"] = 0;
      updatedBalance["available"] = Number(0).toFixed(token.precision);
      updatedBalance["availableInAssetPanel"] = Number(0).toFixed(
        token.precision
      );
    }

    updatedBalances.push(updatedBalance);
  }
  return updatedBalances;
}
