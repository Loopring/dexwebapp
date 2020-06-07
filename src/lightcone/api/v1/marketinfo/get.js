import { request } from "../../../common";
// import config from '../../../config';

export async function getMarketInfo() {
  const response = await request({
    method: "GET",
    url: "/api/v2/exchange/markets",
  });

  let markets = response["data"];
  let updatedMarkets = removeDelistedMarkets(markets);
  response["data"] = updatedMarkets;
  return response["data"];
}

function removeDelistedMarkets(markets) {
  let delistedMarkets = ["TRB-ETH"];
  let updatedMarkets = [];
  for (let i = 0; i < markets.length; i = i + 1) {
    let market = markets[i];
    var isDelisted = false;
    for (let j = 0; j < delistedMarkets.length; j = j + 1) {
      if (market.market.includes(delistedMarkets[j])) {
        isDelisted = true;
      }
    }
    if (!isDelisted) {
      updatedMarkets.push(market);
    }
  }
  return updatedMarkets;
}
