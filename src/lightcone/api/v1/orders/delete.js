import { request } from "../../../common";

export async function cancelOrders(
  accountId,
  orderHash,
  clientOrderId,
  signed,
  apiKey
) {
  const params = {
    accountId: accountId,
    orderHash: orderHash,
    clientOrderId: clientOrderId,
  };
  const signature = signed.Rx + "," + signed.Ry + "," + signed.s;
  const headers = {
    "X-API-KEY": apiKey,
    "X-API-SIG": signature,
  };
  return await request({
    method: "DELETE",
    url: "/api/v2/orders",
    headers: headers,
    params,
  });
}

export async function cancelAllOrders(accountId, signed, apiKey) {
  const params = {
    accountId: accountId,
  };
  const signature = signed.Rx + "," + signed.Ry + "," + signed.s;
  const headers = {
    "X-API-KEY": apiKey,
    "X-API-SIG": signature,
  };
  return await request({
    method: "DELETE",
    url: "/api/v2/orders",
    headers: headers,
    params,
  });
}
