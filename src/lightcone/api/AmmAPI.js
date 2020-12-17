import * as fm from 'lightcone/common/formatter';
import { mapAmountInUI } from './LightconeAPI';
import config from '../config';
import request from '../common/request';

export async function getAmmMarkets() {
  const data = {};

  const response = await request({
    method: 'GET',
    url: '/api/v2/amm/markets',
    data,
  });

  return response['data'];
}

export async function getAmmSnapshots() {
  const data = {};

  const response = await request({
    method: 'GET',
    url: '/api/v2/amm/snapshots',
    data,
  });

  return response['data'];
}

export async function getAmmSnapshot(poolAddress) {
  const params = {
    poolAddress,
  };

  const response = await request({
    method: 'GET',
    url: '/api/v2/amm/snapshot',
    params,
  });

  return response['data'];
}

export async function getAmmMarketUserFeeRates(accountId, market, apiKey) {
  const params = {
    accountId,
    market,
  };

  const headers = {
    'X-API-KEY': apiKey,
  };

  const response = await request({
    method: 'GET',
    url: '/api/v2/user/feeRates',
    headers,
    params,
  });

  // console.log('getAmmMarketUserFeeRates', response);

  return response['data'];
}

// TODO
export async function createAmmOrder() {}

// /api/v2/amm/join
export async function joinAmmPool(data, apiKey) {
  const headers = {
    'X-API-KEY': apiKey
  };

  const response = await request({
    method: 'POST',
    url: '/api/v2/amm/join',
    headers: headers,
    data: data,
  });

  return response['data'];
}

// /api/v2/amm/exit
export async function exitAmmPool(data, apiKey) {
  const headers = {
    'X-API-KEY': apiKey
  };

  const response = await request({
    method: 'POST',
    url: '/api/v2/amm/exit',
    headers: headers,
    data: data,
  });

  return response['data'];
}

export async function getAmmUserTransactions(
  accountId,
  limit,
  offset,
  apiKey,
  tokens
) {
  const params = {
    accountId,
    limit,
    offset,
  };

  const headers = {
    'X-API-KEY': apiKey,
  };

  const response = await request({
    method: 'GET',
    url: '/api/v2/amm/user/transactions',
    headers: headers,
    params,
  });

  const data = response['data'];
  const totalNum = data['totalNum'];
  const transactions = data['transactions'];

  return {
    totalNum,
    transactions: mapAmmTransactions(transactions, tokens),
    limit,
    offset,
  };
}

function mapAmmTransactions(transactions, tokens) {
  return transactions.map((tran) => {
    const baseToken = config.getTokenBySymbol(tran.lpTokenSymbol, tokens);
    const amountInUI = fm.numberWithCommas(
      mapAmountInUI(baseToken, tran.lpTokenAmount, tokens)
    );
    const feeInUI = ''; // mapAmountInUI(baseToken, tran.feeAmount, tokens);

    let updatedTransfers = [];
    let transfers = tran.transfers;
    for (let i = 0; i < transfers.length; i++) {
      const transfer = transfers[i];
      const baseToken = config.getTokenBySymbol(transfer.tokenSymbol, tokens);

      // Use actualAmount?
      const amountInUI = fm.numberWithCommas(
        mapAmountInUI(baseToken, transfer.actualAmount, tokens)
      );
      transfer['amountInUI'] = amountInUI;
      updatedTransfers.push(transfer);
    }

    return {
      ...tran,
      amountInUI,
      feeInUI,
      poolName: baseToken.name,
      transfers: updatedTransfers,
    };
  });
}

export async function getAPY(poolName) {
  const params = {
    market: poolName,
  };

  const response = await request({
    method: 'GET',
    url: '/api/v2/ticker',
    params,
  });

  return {
    tokenFees: [response['data'][0][9], response['data'][0][10]],
  };
}
