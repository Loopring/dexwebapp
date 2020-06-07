import { toBig, toFixed } from "../common/formatter";
const config = require("./config.json");

function getRelayerHost(restUrl = true) {
  return restUrl ? config.prodServerUrl : config.prodWsUrl;
}

function getServer() {
  return "https://" + getRelayerHost();
}

function getWsServer() {
  return "wss://" + getRelayerHost(false) + "/v2/ws";
}

function getChannelId() {
  return config.defaultChannelId;
}

function getLabel() {
  return config.label;
}

function getMaxFeeBips() {
  return config.maxFeeBips;
}

function getTokenBySymbol(symbol, tokens) {
  if (typeof symbol === "undefined") {
    return {};
  }
  return (
    tokens.find(
      (token) => token.symbol.toLowerCase() === symbol.toLowerCase()
    ) || {}
  );
}

function getTokenByAddress(address, tokens) {
  if (typeof address === "undefined") {
    return {};
  }
  return tokens.find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  );
}

function getTokenByTokenId(tokenId, tokens) {
  if (typeof tokenId === "undefined") {
    return {};
  }
  return tokens.find((token) => token.tokenId === tokenId);
}

function fromWEI(symbol, valueInWEI, tokens, { precision, ceil } = {}) {
  const token = getTokenBySymbol(symbol, tokens);
  const precisionToFixed = precision ? precision : token.precision;
  const value = toBig(valueInWEI).div("1e" + token.decimals);
  return toFixed(value, precisionToFixed, ceil);
}

function toWEI(symbol, value, tokens) {
  const token = getTokenBySymbol(symbol, tokens);
  if (typeof token === "undefined") {
    return 0;
  }
  return toBig(value)
    .times("1e" + token.decimals)
    .toFixed(0);
}

function getMarketByPair(pair, markets) {
  if (pair) {
    return markets.find((m) => m.market === pair);
  }
}

function isSupportedMarket(market, markets) {
  return !!getMarketByPair(market, markets);
}

function getMarketsByTokenR(token, markets) {
  return markets.filter((item) => item.split("-")[1] === token);
}

function getMarketsByTokenL(token, markets) {
  return markets.filter((item) => item.split("-")[0] === token);
}

function getTokenSupportedMarkets(token) {
  const leftMarket = getMarketsByTokenL(token);
  const rightMarket = getMarketsByTokenR(token);
  return [...leftMarket, ...rightMarket];
}

function getGasLimitByType(type) {
  if (type) {
    return config.txs.find((tx) => type === tx.type);
  }
}

function getFeeByType(type, fees) {
  if (type) {
    return fees.find((fee) => type === fee.type);
  }
}

function getMaxAmountInWEI() {
  return config.maxAmount;
}

export default {
  getRelayerHost,
  getServer,
  getWsServer,
  getTokenBySymbol,
  getTokenByAddress,
  getTokenByTokenId,
  getMarketByPair,
  getGasLimitByType,
  getFeeByType,
  getChannelId,
  getLabel,
  isSupportedMarket,
  getMarketsByTokenR,
  getTokenSupportedMarkets,
  getMaxFeeBips,
  getMaxAmountInWEI,
  fromWEI,
  toWEI,
};
