import { request } from "../../../common";
import config from "../../../config";

export async function getOrders({
  accountId,
  limit,
  offset,
  market,
  statuses,
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

  if (typeof statuses !== "undefined") {
    params.status = statuses.reduce((a, c) => a + "," + c);
  }

  const response = await request({
    method: "GET",
    url: "/api/v2/orders",
    headers: headers,
    params,
  });

  const data = response["data"];
  const totalNum = data["totalNum"];
  const orders = data["orders"];
  const updatedOrders = map(orders, tokens);
  return {
    accountId,
    orders: updatedOrders,
    totalNum,
    limit,
    offset,
  };
}

// Map API modal to UI modal
// Used in WebSocketService
export function map(orders, configTokens) {
  let updatedOrders = [];
  for (let i = 0; i < orders.length; i = i + 1) {
    const order = orders[i];
    let updatedOrder = { ...order };
    const market = updatedOrder.market;
    const tokens = market.split("-");
    const baseToken = tokens[0];
    const quoteToken = tokens[1];
    let sizeInBigNumber = "0";
    let filledInBigNumber = "0";

    updatedOrder["baseToken"] = baseToken;
    updatedOrder["quoteToken"] = quoteToken;

    // Used in table directly
    updatedOrder["sizeInString"] = config.fromWEI(
      baseToken,
      order.size,
      configTokens
    );

    updatedOrder["filledSizeInString"] = config.fromWEI(
      baseToken,
      order.filledSize,
      configTokens
    );

    let feeInString = "";
    if (Number(order.filledSize) === 0) {
      feeInString = "-";
    } else {
      const feeToken =
        order.side.toLowerCase() === "buy" ? baseToken : quoteToken;
      feeInString = config.fromWEI(feeToken, order.filledFee, configTokens, {
        precision: 8,
      });
    }
    updatedOrder["feeInString"] = feeInString;

    //因为前端side == sell, buy = false; side = buy, buy = true，因此都按照size计算。
    sizeInBigNumber = order["size"];
    filledInBigNumber = order["filledSize"];
    if (order.status === "processed") {
      updatedOrder["filled"] = `100%`;
    } else {
      const sizeFromWei = config.fromWEI(
        baseToken,
        sizeInBigNumber,
        configTokens
      );
      const filledSize = config.fromWEI(
        baseToken,
        filledInBigNumber,
        configTokens
      );
      const filledInNumber = Math.floor((filledSize / sizeFromWei) * 100);
      updatedOrder["filled"] = `${filledInNumber}%`;
    }

    const token = config.getTokenBySymbol(quoteToken, configTokens);
    const total = Number(
      parseFloat(updatedOrder.sizeInString) * parseFloat(order.price)
    );
    const totalInString = total.toFixed(token.precision);
    updatedOrder["totalInString"] = totalInString;

    updatedOrders.push(updatedOrder);
  }
  return updatedOrders;
}
