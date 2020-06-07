import { getAllowance } from "lightcone/api/v1/allowances";
import { getEthBalance } from "lightcone/api/v1/ethBalance";
import { getTokenBalance } from "lightcone/api/v1/tokenBalance";
import { mapAmountInUI } from "lightcone/api/LightconeAPI";
import config from "lightcone/config";

export async function fetchWalletBalance(owner, tokenSymbol, tokens) {
  const tokenBalance = await (tokenSymbol.toUpperCase() === "ETH"
    ? getEthBalance(owner)
    : getTokenBalance(owner, tokenSymbol, tokens));
  const token = config.getTokenBySymbol(tokenSymbol, tokens);
  return mapAmountInUI(token, tokenBalance, tokens);
}

export async function fetchAllowance(owner, tokenSymbol, tokens) {
  if (tokenSymbol.toUpperCase() === "ETH") {
    return 0;
  } else {
    const allowance = await getAllowance(owner, tokenSymbol, tokens);
    return Number(config.fromWEI(tokenSymbol, allowance, tokens));
  }
}

export function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
