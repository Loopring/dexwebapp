import { formatter, request } from "../../../common";

export async function getTokenInfo() {
  const data = {};
  const response = await request({
    method: "GET",
    url: "/api/v2/exchange/tokens",
    data,
  });

  let tokens = response["data"];
  let updatedTokens = disableDelistedTokens(tokens);
  response["data"] = updatedTokens;

  return response["data"].map((token) => {
    token.address = formatter.formatAddress(token.address);
    return token;
  });
}

function disableDelistedTokens(tokens) {
  let delistedTokens = ["TRB"];

  let updatedTokens = [];
  for (let i = 0; i < tokens.length; i = i + 1) {
    let token = tokens[i];
    token["depositEnabled"] = true;
    for (let j = 0; j < delistedTokens.length; j = j + 1) {
      if (token.symbol.includes(delistedTokens[j])) {
        token["depositEnabled"] = false;
      }
    }
    updatedTokens.push(token);
  }
  return updatedTokens;
}
