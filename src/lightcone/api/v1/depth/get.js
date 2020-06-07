import { request } from "../../../common";
import BigNumber from "bignumber.js";
import config from "../../../config";

export async function getDepth(market, level, limit, configTokens) {
  const params = {
    market,
    level,
    limit,
  };
  const response = await request({
    method: "GET",
    url: "/api/v2/depth",
    params,
  });

  const tokens = market.split("-");
  const baseToken = tokens[0];

  const depth = response["data"];
  const bids = depth["bids"].map((arr) => arrToDepth(arr));
  let updatedBids = [];
  let aggregatedBidSize = BigNumber(0);
  for (let i = 0; i < bids.length; i = i + 1) {
    const bid = bids[i];
    aggregatedBidSize = aggregatedBidSize.plus(bid.size);
    let updatedBid = {
      price: bid.price,
      size: bid.size,
      aggregatedSize: config.fromWEI(
        baseToken,
        aggregatedBidSize,
        configTokens
      ),
      volume: bid.volume,
      count: bid.count,
      sizeInNumber: config.fromWEI(baseToken, bid.size, configTokens),
    };
    updatedBids.push(updatedBid);
  }

  const asks = depth["asks"].map((arr) => arrToDepth(arr));
  let updatedAsks = [];
  let aggregateAskSize = BigNumber(0);
  for (let i = 0; i < asks.length; i = i + 1) {
    const ask = asks[i];
    aggregateAskSize = aggregateAskSize.plus(ask.size);
    let updatedAsk = {
      price: ask.price,
      size: ask.size,
      aggregatedSize: config.fromWEI(baseToken, aggregateAskSize, configTokens),
      volume: ask.volume,
      count: ask.count,
      sizeInNumber: config.fromWEI(baseToken, ask.size, configTokens),
    };
    updatedAsks.push(updatedAsk);
  }

  return {
    bids: updatedBids,
    asks: updatedAsks,
    version: depth["version"],
  };
}

export function arrToDepth(arr) {
  return {
    price: arr[0],
    size: arr[1],
    volume: arr[2],
    count: Number(arr[3]),
  };
}
