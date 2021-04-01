import * as fm from 'lightcone/common/formatter';
import { dropTrailingZeroes } from 'pages/trade/components/defaults/util';
import { signSetReferrer } from '../sign/exchange';
import config from '../config';
import request from '../common/request';

export function getApiDocsURL() {
  return `${config.getServer()}/docs/`;
}

export async function getApiKey(data, signed) {
  const headers = {
    'X-API-SIG': signed,
  };

  const response = await request({
    method: 'GET',
    url: '/api/v2/apiKey',
    headers: headers,
    params: data,
  });
  return response['data'];
}

export async function getWsApiKey() {
  const headers = {};

  const response = await request({
    method: 'GET',
    url: '/v2/ws/key',
    headers: headers,
  });
  return response['data'];
}

export async function accountUpdate(data, ecdsaSig) {
  console.log('accountUpdate(data, signed)', ecdsaSig);

  const headers = {
    'X-API-SIG': ecdsaSig,
  };
  data['ecdsaSig'] = ecdsaSig;

  console.log('accountUpdate data', data);

  const response = await request({
    method: 'POST',
    url: '/api/v2/account',
    headers: headers,
    data,
  });

  return response['data'];
}

export async function getDexNonce(data) {
  return await request({
    method: 'GET',
    url: '/api/v2/dexNonce',
    param: data,
  });
}

// 3.6 has different API
// https://docs3.loopring.io/zh-hans/dex_apis/submitOrderV3.html
export async function submitOrderToLightcone(data, accountId, apiKey) {
  const headers = {
    'X-API-KEY': apiKey,
  };

  let response0 = await request({
    method: 'POST',
    url: '/api/v2/order',
    headers: headers,
    data,
  });

  let orderHash = response0['data']['orderHash'];
  let params = {
    accountId,
    orderHash,
  };

  let response1 = null;
  let i = 0;
  while (i < 3) {
    response1 = await request({
      method: 'GET',
      url: '/api/v2/order',
      headers: headers,
      params,
    });
    if (response1['data']['status'] !== 'processing') {
      break;
    }
    i = i + 1;
  }

  return response1;
}

// TODO: do we have /api/v2/orderId in 3.6?
// Return order id
/*
export async function getOrderId(accountId, tokenSId, apiKey) {
  const params = {
    accountId: accountId,
    tokenSId: tokenSId,
  };
  const headers = {
    'X-API-KEY': apiKey,
  };
  const response = await request({
    method: 'GET',
    url: '/api/v2/orderId',
    headers: headers,
    params,
  });

  return response['data'];
}
*/

export async function lightconeGetAccount(owner) {
  const params = {
    owner,
  };

  // /api/v2/account doesn't return publicKeyX and publicKeyY
  const response = await request({
    method: 'GET',
    url: '/api/v2/account',
    params,
  });

  let data = response['data'];
  let publicKeyX = data['publicKeyX'];
  if (publicKeyX !== '') {
    data['publicKeyX'] = fm.formatEddsaKey(publicKeyX);
  }

  let publicKeyY = data['publicKeyY'];
  if (publicKeyY !== '') {
    data['publicKeyY'] = fm.formatEddsaKey(publicKeyY);
  }

  return data;
}

export async function getTimestamp() {
  return await request({
    method: 'POST',
    url: '/api/v2/timestamp',
  });
}

export async function getTrade(market, limit) {
  const params = {
    market,
    limit,
  };
  const response = await request({
    method: 'GET',
    url: '/api/v2/trade',
    params,
  });

  return response['data']['trades'];
}

export function arrToTrade(arr) {
  return {
    timestamp: Number(arr[0]),
    tradeId: Number(arr[1]),
    side: arr[2],
    size: arr[3],
    price: arr[4],
    market: arr[5],
    fee: arr[6],
  };
}

export async function getDepositHistory(
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
    allType: true,
    start: 0,
    end: Date.now(),
  };

  if (typeof tokenSymbol !== 'undefined') {
    params.tokenSymbol = tokenSymbol;
  }

  const headers = {
    'X-API-KEY': apiKey,
  };

  const response = await request({
    method: 'GET',
    url: '/api/v2/user/deposits',
    headers: headers,
    params,
  });

  const data = response['data'];
  const totalNum = data['totalNum'];
  const transactions = data['transactions'];
  const updatedTransactions = mapTransactions(transactions, tokens);
  return {
    totalNum,
    transactions: updatedTransactions,
    limit,
    offset,
  };
}

export function mapAmountInUI(baseToken, amount, tokens) {
  let amountInUI = config.fromWEI(baseToken.symbol, amount, tokens);
  if (parseFloat(amountInUI) === 0) {
    let amountInDecimals = config.fromWEI(baseToken.symbol, amount, tokens, {
      precision: baseToken.decimals,
    });
    amountInDecimals = dropTrailingZeroes(amountInDecimals);
    if (parseFloat(amountInDecimals) !== 0) {
      return amountInDecimals;
    }
    return amountInUI;
  }

  return fm.numberWithCommas(amountInUI);
}

function mapTransactions(transactions, tokens) {
  let updatedTransactions = [];
  for (let i = 0; i < transactions.length; i = i + 1) {
    let transaction = transactions[i];

    const baseToken = config.getTokenBySymbol(transaction.symbol, tokens);
    let amountInUI = mapAmountInUI(baseToken, transaction.amount, tokens);
    let realAmountInUI = transaction.realAmount
      ? mapAmountInUI(baseToken, transaction.realAmount, tokens)
      : '';
    // Why this is feeAmount?
    // No feeAmount in 3.6
    const feeInUI =
      transaction.feeAmount === ''
        ? '--'
        : config.fromWEI(transaction.symbol, transaction.feeAmount, tokens);

    const txHashInUI =
      transaction.txHash.substring(0, 7) + '...' + transaction.txHash.slice(-7);

    const distributeHashInUI = transaction.distributeHash
      ? transaction.distributeHash.substring(0, 7) +
        '...' +
        transaction.distributeHash.slice(-7)
      : '';

    const updatedTransaction = {
      ...transaction,
      tokenName: baseToken.name,
      amountInUI,
      realAmountInUI,
      feeInUI,
      txHashInUI,
      distributeHashInUI,
    };
    updatedTransactions.push(updatedTransaction);
  }
  return updatedTransactions;
}

export async function getWithdrawalHistory(
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
    end: Date.now(),
  };

  if (typeof tokenSymbol !== 'undefined') {
    params.tokenSymbol = tokenSymbol;
  }

  const headers = {
    'X-API-KEY': apiKey,
  };

  const response = await request({
    method: 'GET',
    url: '/api/v2/user/withdrawals',
    headers: headers,
    params,
  });

  const data = response['data'];
  const totalNum = data['totalNum'];
  const transactions = data['transactions'];
  const updatedTransactions = mapTransactions(transactions, tokens);
  return {
    totalNum,
    transactions: updatedTransactions,
    limit,
    offset,
  };
}

export async function submitWithdraw(data, ecdsaSig, apiKey) {
  const headers = {
    'X-API-KEY': apiKey,
    'X-API-SIG': ecdsaSig,
  };

  const response = await request({
    method: 'POST',
    url: '/api/v2/user/withdrawals',
    headers: headers,
    data: data,
  });

  return response['data'];
}

export async function getTicker(markets, tokens) {
  const params = {
    market: markets.reduce((acc, cur) => acc + ',' + cur),
  };

  const response = await request({
    method: 'GET',
    url: '/api/v2/ticker',
    params,
  });
  return mapTicker(
    response['data'].map((arr) => arrToTicker(arr)),
    tokens
  );
}

function mapTicker(tickers, configTokens) {
  let updatedTickers = [];
  for (let i = 0; i < tickers.length; i = i + 1) {
    const ticker = tickers[i];

    const tokens = ticker.market.split('-');
    const baseToken = tokens[0];
    const quoteToken = tokens[1];
    const open = parseFloat(ticker['open']);
    const close = parseFloat(ticker['close']);
    let percentChange24h = (((close - open) / open) * 100).toFixed(2);
    percentChange24h = percentChange24h !== 'NaN' ? percentChange24h : '0.00';
    if (close - open > 0) {
      percentChange24h = `+${percentChange24h}`;
    }

    const updatedTicker = {
      ...ticker,
      percentChange24h,
      size: config.fromWEI(baseToken, ticker.size, configTokens),
      volume: config.fromWEI(quoteToken, ticker.volume, configTokens, {
        precision: 2,
      }),
    };
    updatedTickers.push(updatedTicker);
  }
  return updatedTickers;
}

export function arrToTicker(arr) {
  return {
    market: arr[0],
    timestamp: Number(arr[1]),
    size: arr[2],
    volume: arr[3],
    open: arr[4],
    high: arr[5],
    low: arr[6],
    close: arr[7],
    count: Number(arr[8]),
    bid: arr[9],
    ask: arr[10],
  };
}

export async function getExchangeInfo() {
  const data = {};

  const response = await request({
    method: 'GET',
    url: '/api/v2/exchange/info',
    data,
  });

  return response['data'];
}

export async function setRefer(info, keyPair) {
  const signed = signSetReferrer(info, keyPair);
  const signature =
    fm.formatEddsaKey(fm.toHex(fm.toBig(signed.Rx))) +
    fm.clearHexPrefix(fm.formatEddsaKey(fm.toHex(fm.toBig(signed.Ry)))) +
    fm.clearHexPrefix(fm.formatEddsaKey(fm.toHex(fm.toBig(signed.s))));
  let data;
  if (info.referrer) {
    data = {
      address: info.address,
      referrer: info.referrer,
      publicKeyX: keyPair.publicKeyX,
      publicKeyY: keyPair.publicKeyY,
    };
  } else {
    data = {
      address: info.address,
      promotionCode: info.promotionCode,
      publicKeyX: keyPair.publicKeyX,
      publicKeyY: keyPair.publicKeyY,
    };
  }

  const headers = {
    'X-API-SIG': signature,
  };

  const response = await request({
    method: 'POST',
    url: '/api/v2/refer',
    headers: headers,
    data,
  });

  return response['data'];
}

// amm
export async function getUserUpdateInfo(accountId, apiKey) {
  const params = {
    accountId,
  };
  const headers = {
    'X-API-KEY': apiKey,
  };
  const response = await request({
    method: 'GET',
    url: '/api/v2/user/updateInfo',
    headers: headers,
    params,
  });

  return response['data'];
}

export async function getStorageId(accountId, tokenSId, apiKey) {
  const params = {
    accountId,
    tokenSId,
  };
  const headers = {
    'X-API-KEY': apiKey,
  };
  const response = await request({
    method: 'GET',
    url: '/api/v2/storageId',
    headers: headers,
    params,
  });

  return response['data'];
}

export async function checkWithdrawAgent(tokenId, amount) {
  const params = {
    tokenId,
    amount,
  };
  const headers = {};
  const response = await request({
    method: 'GET',
    url: '/api/v2/exchange/withdrawalAgents',
    headers: headers,
    params,
  });

  return response['data'];
}

export async function getEstimatedBlockTime() {
  const params = {};
  const headers = {};
  const response = await request({
    method: 'GET',
    url: '/api/v3/estimatedBlockTime',
    headers: headers,
    params,
  });

  let estimatedNextBlockTime = response['estimatedNextBlockTime'];
  if (estimatedNextBlockTime < 60) {
    return 1;
  } else {
    console.log('estimatedNextBlockTime', estimatedNextBlockTime);
    console.log(
      'parseInt(Number(estimatedNextBlockTime)/3600.0)',
      parseInt(Number(estimatedNextBlockTime) / 3600.0)
    );
    return parseInt(Number(estimatedNextBlockTime) / 60.0);
  }
}
