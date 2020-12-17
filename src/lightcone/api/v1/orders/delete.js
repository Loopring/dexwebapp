import * as fm from '../../../common/formatter';
import { request } from '../../../common';

export async function cancelOrders(
  accountId,
  orderHash,
  clientOrderId,
  signed,
  apiKey
) {
  const params = {
    accountId: accountId,
    orderHash: orderHash,
    clientOrderId: clientOrderId,
  };
  let signatureRx_Hex = fm.clearHexPrefix(
    fm.toHex(fm.toBN(signed.Rx.toString('hex')))
  );
  let signatureRy_Hex = fm.clearHexPrefix(
    fm.toHex(fm.toBN(signed.Ry.toString('hex')))
  );
  let signatureS_Hex = fm.clearHexPrefix(
    fm.toHex(fm.toBN(signed.s.toString('hex')))
  );
  const signature =
    '0x' +
    signatureRx_Hex.padStart(64, '0') +
    signatureRy_Hex.padStart(64, '0') +
    signatureS_Hex.padStart(64, '0');
  const headers = {
    'X-API-KEY': apiKey,
    'X-API-SIG': signature,
  };

  return await request({
    method: 'DELETE',
    url: '/api/v2/orders',
    headers: headers,
    params,
  });
}

export async function cancelAllOrders(accountId, signed, apiKey) {
  const params = {
    accountId: accountId,
  };
  let signatureRx_Hex = fm.clearHexPrefix(
    fm.toHex(fm.toBN(signed.Rx.toString('hex')))
  );
  let signatureRy_Hex = fm.clearHexPrefix(
    fm.toHex(fm.toBN(signed.Ry.toString('hex')))
  );
  let signatureS_Hex = fm.clearHexPrefix(
    fm.toHex(fm.toBN(signed.s.toString('hex')))
  );
  const signature =
    '0x' +
    signatureRx_Hex.padStart(64, '0') +
    signatureRy_Hex.padStart(64, '0') +
    signatureS_Hex.padStart(64, '0');
  const headers = {
    'X-API-KEY': apiKey,
    'X-API-SIG': signature,
  };
  return await request({
    method: 'DELETE',
    url: '/api/v2/orders',
    headers: headers,
    params,
  });
}
