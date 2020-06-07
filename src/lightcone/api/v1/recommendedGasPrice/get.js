import { request } from "../../../common";

export async function getRecommendedGasPrice() {
  const response = await request({
    method: "GET",
    url: "/api/v2/recommendedGasPrice",
  });

  return response["data"];
}
