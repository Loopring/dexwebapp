import { request } from "../../../common";

export async function getEthBalance(address) {
  const params = {
    owner: address,
  };

  const response = await request({
    method: "GET",
    url: "/api/v2/ethBalances",
    params,
  });

  return response["data"];
}
