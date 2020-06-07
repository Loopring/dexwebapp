import { request } from "../../../common";

export async function sendWithdrawTransaction(signedEthereumTx) {
  const data = {
    data: signedEthereumTx,
  };
  return await request({
    method: "POST",
    url: "/api/v2/sendEthTx",
    data,
  });
}
