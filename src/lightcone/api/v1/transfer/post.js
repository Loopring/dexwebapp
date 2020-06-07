import request from "../../../common/request";

export async function submitTransfer(transfer, ecdsaSig, apiKey) {
  const headers = {
    "X-API-KEY": apiKey,
    "X-API-SIG": ecdsaSig,
  };

  const response = await request({
    method: "POST",
    url: "/api/v2/transfer",
    headers: headers,
    data: transfer,
  });

  return response["data"];
}
