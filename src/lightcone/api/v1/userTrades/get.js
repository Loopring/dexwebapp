import { arrToTrade } from "../../LightconeAPI";
import { request } from "../../../common";
import config from "../../../config";

export async function getUserTrades({
  accountId,
  limit,
  offset,
  market,
  apiKey,
  tokens,
}) {
  const headers = {
    "X-API-KEY": apiKey,
  };
  const params = {
    accountId,
    limit,
    offset,
    start: 0,
    end: Date.now() * 1000,
  };
  if (typeof market !== "undefined") {
    params.market = market;
  }

  const response = await request({
    method: "GET",
    url: `/api/v2/user/trades`,
    headers: headers,
    params,
  });

  const data = response["data"];
  const totalNum = data["totalNum"];
  const trades = data["trades"].map((arr) => arrToTrade(arr));
  const updatedTrades = map(trades, tokens);
  return {
    accountId,
    trades: updatedTrades,
    totalNum,
    limit,
    offset,
  };
}

// Map API modal to UI modal
function map(trades, configTokens) {
  let updatedTrades = [];
  for (let i = 0; i < trades.length; i = i + 1) {
    const trade = trades[i];
    let updatedTrade = { ...trade };
    const market = updatedTrade.market;
    const tokens = market.split("-");
    const baseToken = tokens[0];
    const quoteToken = tokens[1];

    updatedTrade["baseToken"] = baseToken;
    updatedTrade["quoteToken"] = quoteToken;

    // Used in table directly
    const sizeInString = config.fromWEI(baseToken, trade.size, configTokens);
    updatedTrade["sizeInString"] = sizeInString;

    let feeInString = "";
    if (Number(trade.filledSize) === 0) {
      feeInString = "-";
    } else {
      const feeToken =
        trade.side.toLowerCase() === "buy" ? baseToken : quoteToken;
      feeInString = config.fromWEI(feeToken, trade.fee, configTokens, {
        precision: 8,
      });
    }
    updatedTrade["feeInString"] = feeInString;

    const token = config.getTokenBySymbol(quoteToken, configTokens);
    const total = Number(
      parseFloat(updatedTrade.sizeInString) * parseFloat(trade.price)
    );
    const totalInString = total.toFixed(token.precision);
    updatedTrade["totalInString"] = totalInString;

    updatedTrades.push(updatedTrade);
  }
  return updatedTrades;
}
