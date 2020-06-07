export function compareDexAccounts(dexAccount1, dexAccount2) {
  const account1 = dexAccount1.account;
  const account2 = dexAccount2.account;

  // The order in JSON-style objects comparison matters.
  // We compare properties one by one here.
  if (
    account1 &&
    account2 &&
    account1.address === account2.address &&
    account1.state === account2.state &&
    account1.accountId === account2.accountId &&
    account1.isFreeze === account2.isFreeze &&
    account1.publicKeyX === account2.publicKeyX &&
    account1.publicKeyY === account2.publicKeyY &&
    account1.accountKey === account2.accountKey &&
    account1.apiKey === account2.apiKey
  ) {
    return true;
  } else {
    return false;
  }
}

export function canShowLoginModal() {
  const href = window.location.href;
  if (
    href.includes("trade") ||
    href.includes("orders") ||
    href.includes("account")
  ) {
    return true;
  } else {
    return false;
  }
}
