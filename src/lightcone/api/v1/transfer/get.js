import { mapAmountInUI } from "../../LightconeAPI";
import config from "../../../config";
import request from "../../../common/request";

export async function getTransferHistory(
  accountId,
  tokenSymbol,
  limit,
  offset,
  apiKey,
  tokens
) {
  const params = {
    accountId,
    limit,
    offset,
    start: 0,
    end: Date.now() * 1000,
  };

  if (typeof tokenSymbol !== "undefined") {
    params.tokenSymbol = tokenSymbol;
  }

  const headers = {
    "X-API-KEY": apiKey,
  };

  const response = await request({
    method: "GET",
    url: "/api/v2/user/transfers",
    headers: headers,
    params,
  });

  const data = response["data"];
  const totalNum = data["totalNum"];
  const transactions = data["transactions"];

  return {
    totalNum,
    transactions: mapTransactions(transactions, tokens),
    limit,
    offset,
  };
}

function mapTransactions(transactions, tokens) {
  return transactions.map((tran) => {
    const baseToken = config.getTokenBySymbol(tran.symbol, tokens);
    const amountInUI = mapAmountInUI(baseToken, tran.amount, tokens);
    const feeInUI = mapAmountInUI(baseToken, tran.feeAmount, tokens);
    const recipientInUI = tran.receiverAddress
      ? tran.receiverAddress.substring(0, 7) +
        "..." +
        tran.receiverAddress.slice(-7)
      : "";

    const senderInUI = tran.senderAddress
      ? tran.senderAddress.substring(0, 7) +
        "..." +
        tran.senderAddress.slice(-7)
      : "";

    return {
      ...tran,
      amountInUI,
      feeInUI,
      recipientInUI,
      senderInUI,
      tokenName: baseToken.name,
    };
  });
}
