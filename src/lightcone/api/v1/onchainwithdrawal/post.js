import { request } from '../../../common';

export async function sendWithdrawTransaction(signedEthereumTx) {
  const data = {
    data: signedEthereumTx,
  };
  return await request({
    method: 'POST',
    url: '/api/v2/sendEthTx',
    data,
  });
}

export async function updateDistributeHash(
  requestId,
  hash,
  publicKeyX,
  publicKeyY,
  signed
) {
  const signature = signed.Rx + ',' + signed.Ry + ',' + signed.s;
  const headers = {
    'X-API-SIG': signature,
  };
  const data = {
    requestId,
    txHash: hash,
    publicKeyX,
    publicKeyY,
  };

  return await request({
    method: 'POST',
    url: '/api/v2/updateDistributeHash',
    headers,
    data,
  });
}
