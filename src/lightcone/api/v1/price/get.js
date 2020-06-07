import { request } from "../../../common";

export async function getPrice(legal) {
  const response = await request({
    method: "GET",
    url: "/api/v2/price",
    params: {
      legal,
    },
  });
  return response["data"];
}
