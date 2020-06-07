import { request } from "../../../common";

export async function getEthNonce(owner) {
  const params = {
    owner,
  };
  const response = await request({
    method: "GET",
    url: "/api/v2/ethNonce",
    params,
  });

  return response["data"];
}
