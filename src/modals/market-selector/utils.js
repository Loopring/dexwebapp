export function sortAndCheckNewMarkets(markets) {
  let weightedMarkets = [];
  for (let i = 0; i < markets.length; i = i + 1) {
    // Update market list configurations here.
    let market = markets[i];
    market.isNew = false;
    switch (market.market) {
      case "LRC-USDT":
        market.sortWeight = 5000;
        break;
      case "LRC-ETH":
        market.sortWeight = 5000;
        break;
      case "ETH-USDT":
        market.sortWeight = 900;
        break;
      case "ETH-DAI":
        market.sortWeight = 800;
        break;
      case "USDT-DAI":
        market.sortWeight = 700;
        break;
      case "LINK-ETH":
        market.sortWeight = 600;
        break;
      default:
        market.isNew = true;
        market.sortWeight = 1500;
        break;
    }
    weightedMarkets.push(market);
  }
  weightedMarkets.sort((a, b) => b.sortWeight - a.sortWeight);
  return weightedMarkets;
}
