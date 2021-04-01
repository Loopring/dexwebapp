// TODO: move this two dependencies out of localStorgeAPI
import { getAutoThemeName } from 'redux/reducers/UserPreferenceManager';
import { notifyInfo } from 'redux/actions/Notification';
import I from 'components/I';
import React from 'react';

function getAccounts() {
  const accountStr = localStorage.getItem('accounts');
  return accountStr ? new Map(JSON.parse(accountStr)) : new Map();
}

const SESSION_TIMEOUT_MINUTES = 60;

export function getAccountFromLocal(address) {
  const now = Date.now();
  const accounts = getAccounts();
  const account = accounts.get(address.toLowerCase());

  // If it's unknown wallet type, remove
  const unknownWalletType = !(
    account &&
    account.walletType &&
    (account.walletType === 'MetaMask' ||
      account.walletType === 'WalletConnect')
  );
  if (
    !account ||
    !account.time ||
    now >= account.time + SESSION_TIMEOUT_MINUTES * 60 * 1000 ||
    unknownWalletType
  ) {
    removeAccountFromLocal(address);
    removeAccountKeyFromSession(address);
    return null;
  } else {
    delete account.time;
    account.accountKey = getAccountKeyFromSession(address);
    account.keyNonce = account.keyNonce ? account.keyNonce : 0;
    delete account.accountKeyCipher;
    return account;
  }
}

export function saveAccountToLocal(account) {
  try {
    const localAccount = { ...account };
    const accounts = getAccounts();
    saveAccountKeyToSession(localAccount.address, localAccount.accountKey);
    delete localAccount.accountKey;
    delete localAccount.accountKeyCipher;

    accounts.set(localAccount.address.toLowerCase(), {
      ...localAccount,
      time: Date.now(),
    });
    localStorage.setItem('accounts', JSON.stringify([...accounts]));
  } catch (e) {}
}

export function removeAccountFromLocal(address) {
  if (address) {
    const accounts = getAccounts();
    // Convert address to lower case
    accounts.delete(address.toLowerCase());
    localStorage.setItem('accounts', JSON.stringify([...accounts]));
    removeAccountKeyFromSession(address);
  }
}

export function getAccountKeys() {
  const keyStr = sessionStorage.getItem('accountKeys');
  return keyStr ? new Map(JSON.parse(keyStr)) : new Map();
}

export function saveAccountKeyToSession(address, accountKey) {
  try {
    const keys = getAccountKeys();
    keys.set(address.toLowerCase(), {
      accountKey,
      time: Date.now(),
    });
    sessionStorage.setItem('accountKeys', JSON.stringify([...keys]));
  } catch (e) {}
}

export function removeAccountKeyFromSession(address) {
  if (address) {
    const keys = getAccountKeys();
    keys.delete(address.toLowerCase());
    sessionStorage.setItem('accountKeys', JSON.stringify([...keys]));
  }
}

export function getAccountKeyFromSession(address) {
  const now = Date.now();
  const keys = getAccountKeys();
  const key = keys.get(address.toLowerCase());

  if (
    !key ||
    !key.time ||
    now >= key.time + SESSION_TIMEOUT_MINUTES * 60 * 1000
  ) {
    removeAccountKeyFromSession(address);
    return null;
  } else {
    return key.accountKey;
  }
}

export function saveShowAllOpenOrders() {
  localStorage.setItem('showAllOpenOrders', 'true');
}

export function getShowAllOpenOrders() {
  return localStorage.getItem('showAllOpenOrders');
}

export function removeShowAllOpenOrders() {
  localStorage.removeItem('showAllOpenOrders');
}

export function saveHideLowBalanceAssets() {
  localStorage.setItem('hideLowBalanceAssets', 'true');
}

export function getHideLowBalanceAssets() {
  const hideLowBalanceAssets = localStorage.getItem('hideLowBalanceAssets');
  if (hideLowBalanceAssets && hideLowBalanceAssets === 'false') {
    return false;
  }
  return true;
}

export function removeHideLowBalanceAssets() {
  localStorage.setItem('hideLowBalanceAssets', 'false');
}

export function saveWalletType(walletType) {
  localStorage.setItem('walletType', walletType);
}

export function getWalletType() {
  return localStorage.getItem('walletType');
}

export function removeWalletType() {
  localStorage.removeItem('walletType');
}

export function saveLoginRecord() {
  localStorage.setItem('hasRecord', 'true');
}

export function getLoginRecord() {
  return localStorage.getItem('hasRecord');
}

export function removeLoginRecord() {
  localStorage.removeItem('hasRecord');
}

function getUpdateRecords() {
  const recordStr = localStorage.getItem('updateRecords');
  return recordStr ? new Map(JSON.parse(recordStr)) : new Map();
}

export function getUpdateRecordByAddress(address) {
  const records = getUpdateRecords();
  return records.get(address.toLowerCase());
}

export function saveUpdateRecord(record) {
  const records = getUpdateRecords();
  records.set(record.address.toLowerCase(), record);
  localStorage.setItem('updateRecords', JSON.stringify([...records]));
}

export function removeUpdateRecord(address) {
  const records = getUpdateRecords();
  records.delete(address.toLowerCase());
  localStorage.setItem('updateRecords', JSON.stringify([...records]));
}

export function saveHardwareAddress(address) {
  let current = localStorage.getItem('hardwareAddresses');
  if (current) {
    if (current.includes(address.toLowerCase()) !== true) {
      let newValue = current + ',' + address.toLowerCase();
      localStorage.setItem('hardwareAddresses', newValue);
    }
  } else {
    localStorage.setItem('hardwareAddresses', address.toLowerCase());
  }

  // TODO: refactor
  let themeName = getThemeName();
  if (themeName === 'auto') {
    themeName = getAutoThemeName();
  }
  let theme = {};

  if (themeName === 'dark') {
    theme = {
      notificationBackground: '#282a32',
      textDim: '#E0E0E080',
    };
  } else {
    theme = {
      notificationBackground: '#F0F5F9',
      textDim: '#05050590',
    };
  }
  notifyInfo(<I s="HardwareWalletSignAgain" />, theme, 60);
}

export function isHardwareAddress(address) {
  let current = localStorage.getItem('hardwareAddresses');
  if (current) {
    if (current.includes(address.toLowerCase())) {
      return true;
    }
  }
  return false;
}

export function saveLanguage(value) {
  if (value === 'en' || value === 'zh') {
    localStorage.setItem('language', value);
  }
}

export function getLanguage() {
  let language = localStorage.getItem('language') || getLanguageFromBrowser();
  if (language === 'zh') {
    document.title = '路印去中心化交易所';
    language = 'zh';
  } else {
    language = 'en';
    document.title = 'Loopring Exchange (DEX)';
  }
  return language;
}

export function saveCurrency(value) {
  if (value === 'USD' || value === 'CNY') {
    localStorage.setItem('currency', value);
  }
}

export function getCurrency() {
  let currency = localStorage.getItem('currency');
  if (currency === 'USD' || currency === 'CNY') {
    return currency;
  } else {
    return getLanguage() === 'zh' ? 'CNY' : 'USD';
  }
}

export function saveLastTradePage(lastTradePage) {
  localStorage.setItem('lastTradePage', lastTradePage);
}

export function getLastTradePage() {
  /*
  const lastTradePage = localStorage.getItem('lastTradePage');
  if (lastTradePage) {
    return lastTradePage;
  } else {
    return 'DAI-USDT';
  }
  */
  return 'DAI-USDT';
}

export function getLastSwapPair() {
  const lastSwapPair = localStorage.getItem('lastSwapPair');
  if (lastSwapPair) {
    return lastSwapPair;
  } else {
    return 'LRC-ETH';
  }
}

export function saveLastSwapPair(lastSwapPair) {
  localStorage.setItem('lastSwapPair', lastSwapPair);
}

export function getSlippageTolerance() {
  const slippageTolerance = localStorage.getItem('slippageTolerance');
  if (slippageTolerance) {
    const updatedSlippageTolerance = Number(slippageTolerance);
    if (isNaN(updatedSlippageTolerance) === false) {
      return updatedSlippageTolerance;
    }
  }
  return 0.01;
}

export function saveSlippageTolerance(slippageTolerance) {
  localStorage.setItem('slippageTolerance', slippageTolerance);
}

export function getSwapPoolRemoveFormType() {
  const swapPoolRemoveFormType = localStorage.getItem('swapPoolRemoveFormType');
  if (swapPoolRemoveFormType) {
    return swapPoolRemoveFormType;
  } else {
    return 'simple';
  }
}

export function saveSwapPoolRemoveFormType(swapPoolRemoveFormType) {
  localStorage.setItem('swapPoolRemoveFormType', swapPoolRemoveFormType);
}

export function saveLastPoolPage(lastPoolPage) {
  localStorage.setItem('lastPoolPage', lastPoolPage);
}

export function getLastPoolPage() {
  const lastPoolPage = localStorage.getItem('lastPoolPage');
  if (lastPoolPage) {
    // return lastPoolPage;
    // 如果进入增加流动性和移除流动性时
    // 再点击资金池，应该回到这个页面
    return '';
  } else {
    return '';
  }
}

export function saveLastOrderPage(lastOrderPage) {
  localStorage.setItem('lastOrderPage', lastOrderPage);
}

export function getLastOrderPage() {
  const lastOrderPage = localStorage.getItem('lastOrderPage');
  if (lastOrderPage) {
    return lastOrderPage;
  } else {
    return 'open-orders';
  }
}

export function saveLastAccountPage(lastAccountPage) {
  localStorage.setItem('lastAccountPage', lastAccountPage);
}

export function getLastAccountPage() {
  const lastAccountPage = localStorage.getItem('lastAccountPage');
  if (lastAccountPage) {
    return lastAccountPage;
  } else {
    return 'balances';
  }
}

export function saveTradeType(tradeType) {
  localStorage.setItem('tradeType', tradeType);
}

export function getTradeType() {
  const tradeType = localStorage.getItem('tradeType');
  if (tradeType) {
    return tradeType;
  } else {
    return 'buy';
  }
}

export function saveThemeName(themeName) {
  localStorage.setItem('theme', themeName);
}

export function getThemeName() {
  const themeName = localStorage.getItem('theme');
  if (themeName !== 'dark' && themeName !== 'light') {
    return 'auto';
  } else return themeName;
}

export function getReferralId() {
  const str = localStorage.getItem('referral');
  if (str && !Number.isNaN(str)) {
    return str;
  } else return null;
}

export function setReferralId(id) {
  localStorage.setItem('referral', id);
}

export function removeReferralId() {
  localStorage.removeItem('referral');
}

export function saveRiskAlertVisible() {
  // any string value works
  localStorage.setItem('riskAlertVisible', 'yes');
}

export function getRiskAlertVisible() {
  const riskAlertVisible = localStorage.getItem('riskAlertVisible');
  if (riskAlertVisible) {
    return false;
  }
  return true;
}

export function saveNewUserCheck() {
  // any string value works
  localStorage.setItem('newUserCheck', 'yes');
}

export function getNewUserCheck() {
  const newUserCheck = localStorage.getItem('newUserCheck');
  if (newUserCheck) {
    return false;
  }
  return true;
}

function getLanguageFromBrowser() {
  var language =
    (window.navigator.languages && window.navigator.languages[0]) || // Chrome / Firefox
    window.navigator.language || // All browsers
    window.navigator.userLanguage; // IE <= 10
  let shortLang = language;
  if (shortLang.indexOf('-') !== -1) {
    shortLang = shortLang.split('-')[0];
  } else if (shortLang.indexOf('_') !== -1) {
    shortLang = shortLang.split('_')[0];
  }
  return shortLang;
}

export function getEtherscanLink(chainId) {
  const lan = getLanguage();

  switch (chainId) {
    case 1:
      if (lan === 'zh') {
        return 'https://cn.etherscan.com';
      } else {
        return 'https://etherscan.io';
      }
    case 5:
      return 'https://goerli.etherscan.io';
    default:
      return '';
  }
}
