import { getAllowance } from 'lightcone/api/v1/allowances';
import { getEthBalance } from 'lightcone/api/v1/ethBalance';
import { getTokenBalance } from 'lightcone/api/v1/tokenBalance';
import { mapAmountInUI } from 'lightcone/api/LightconeAPI';
import config from 'lightcone/config';

export async function fetchWalletBalance(owner, symbols, tokens) {
  const tokenSymbols = symbols.filter((sym) => sym.toUpperCase() !== 'ETH');
  const tokenBalances =
    tokenSymbols.length > 0
      ? await getTokenBalance(owner, tokenSymbols, tokens)
      : [];
  const balances = tokenBalances.map(function (ba, index) {
    const token = config.getTokenBySymbol(tokenSymbols[index], tokens);
    // If the token is not enabled, set balance to 0.
    return {
      balance: token.enabled ? mapAmountInUI(token, ba, tokens) : 0,
      symbol: token.symbol,
    };
  });

  if (tokenSymbols.length < symbols.length) {
    const ethBalance = await getEthBalance(owner);
    const balance2 = mapAmountInUI(
      config.getTokenBySymbol('ETH', tokens),
      ethBalance,
      tokens
    );
    balances.push({
      symbol: 'ETH',
      balance: balance2,
    });
  }

  return balances;
}

export async function fetchAllowance(owner, tokenSymbol, tokens) {
  if (tokenSymbol.toUpperCase() === 'ETH') {
    return 0;
  } else {
    const allowance = await getAllowance(owner, tokenSymbol, tokens);
    return Number(config.fromWEI(tokenSymbol, allowance[0], tokens));
  }
}

export function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
