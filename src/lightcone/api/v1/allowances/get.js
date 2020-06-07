import { request } from "../../../common";
import config from "../../../config";

export async function getAllowance(owner, symbol, tokens) {
  let token = config.getTokenBySymbol(symbol, tokens);
  let tokenAddress = token.address;
  const params = {
    owner,
    token: tokenAddress,
  };

  const response = await request({
    method: "GET",
    url: "/api/v2/allowances",
    params,
  });

  return response["data"];
}
