import * as Poseidon from "./poseidon";
import * as fm from "../common/formatter";
import ABI from "../ethereum/contracts";
import EdDSA from "./eddsa";
import config from "../config";
import sha256 from "crypto-js/sha256";

const assert = require("assert");

export function generateKeyPair(seed) {
  return EdDSA.generateKeyPair(seed);
}

export function verify(publicKeyX, publicKeyY, seed) {
  const keyPair = generateKeyPair(seed);
  return keyPair.publicKeyX === publicKeyX && keyPair.publicKeyY === publicKeyY;
}

export function signGetApiKey(request, keyPair) {
  if (request.signature !== undefined) {
    return;
  }

  const method = "GET";
  const uri = encodeURIComponent(`${config.getServer()}/api/v2/apiKey`);
  const params = encodeURIComponent(
    `accountId=${request.accountId}&publicKeyX=${keyPair.publicKeyX}&publicKeyY=${keyPair.publicKeyY}`
  );
  const message = `${method}&${uri}&${params}`;
  const hash = fm.addHexPrefix(sha256(message).toString());
  // Create signature
  request.signature = EdDSA.sign(keyPair.secretKey, hash);

  return request;
}

export function signApplyApiKey(request, keyPair) {
  if (request.signature !== undefined) {
    return;
  }

  const method = "POST";
  const uri = encodeURIComponent(`${config.getServer()}/api/v2/apiKey`);
  const params = encodeURIComponent(
    JSON.stringify({
      accountId: request.accountId,
      publicKeyX: keyPair.publicKeyX,
      publicKeyY: keyPair.publicKeyY,
    })
  );
  const message = `${method}&${uri}&${params}`;
  const hash = fm.addHexPrefix(sha256(message).toString());
  // Create signature
  request.signature = EdDSA.sign(keyPair.secretKey, hash);
  return request;
}

export function signSetReferrer(request, keyPair) {
  if (request.signature !== undefined) {
    return;
  }

  const method = "POST";
  const uri = encodeURIComponent(`${config.getServer()}/api/v2/refer`);

  let params;

  if (request.referrer) {
    params = encodeURIComponent(
      JSON.stringify({
        address: request.address,
        referrer: request.referrer,
        publicKeyX: keyPair.publicKeyX,
        publicKeyY: keyPair.publicKeyY,
      })
    );
  } else {
    params = encodeURIComponent(
      JSON.stringify({
        address: request.address,
        promotionCode: request.promotionCode,
        publicKeyX: keyPair.publicKeyX,
        publicKeyY: keyPair.publicKeyY,
      })
    );
  }

  const message = `${method}&${uri}&${params}`;
  const hash = fm.addHexPrefix(sha256(message).toString());
  // Create signature
  return EdDSA.sign(keyPair.secretKey, hash);
}

export function signUpdateDistributeHash(request, keyPair) {
    const method = 'POST';
    const uri = encodeURIComponent(`${config.getServer()}/api/v2/updateDistributeHash`);
    const params = encodeURIComponent(
        JSON.stringify({
            re: request.requestId,
            txHash: request.txHash,
            publicKeyX: keyPair.publicKeyX,
            publicKeyY: keyPair.publicKeyY,
        })
    );
    const message = `${method}&${uri}&${params}`;
    const hash = fm.addHexPrefix(sha256(message).toString());
    // Create signature
    return EdDSA.sign(keyPair.secretKey, hash);
}


export function createAccountAndDeposit({
  from,
  exchangeAddress,
  fee,
  chainId,
  publicX,
  publicY,
  token,
  amount,
  permission,
  nonce,
  gasPrice,
}) {
  try {
    let address, value;
    if (token.symbol.toUpperCase() === "ETH") {
      address = "0x0";
      value = "0";
    } else {
      address = token.address;
      value = fm.toHex(fm.toBig(amount).times("1e" + token.decimals));
    }

    const data = ABI.Contracts.ExchangeContract.encodeInputs(
      "updateAccountAndDeposit",
      {
        pubKeyX: fm.toHex(fm.toBN(publicX)),
        pubKeyY: fm.toHex(fm.toBN(publicY)),
        tokenAddress: address,
        amount: value,
        permission: fm.toBuffer(permission),
      }
    );

    return {
      from: from,
      to: exchangeAddress,
      value: fm.toBig(fee).toFixed(),
      data: data,
      chainId: chainId,
      nonce: nonce.toString(),
      gasPrice: fm.fromGWEI(gasPrice).toFixed(),
      gas: config.getGasLimitByType("create").gas.toString(),
    };
  } catch (err) {
    console.error("Failed in method createOrUpdateAccount. Error: ", err);
    throw err;
  }
}

export function deposit({
  from,
  exchangeAddress,
  chainId,
  token,
  fee,
  amount,
  nonce,
  gasPrice,
}) {
  let value, data;
  try {
    value = fm.toBig(amount).times("1e" + token.decimals);
    if (token.symbol.toUpperCase() === "ETH") {
      data = ABI.Contracts.ExchangeContract.encodeInputs("deposit", {
        tokenAddress: "0x0",
        amount: fm.toHex(value),
      });
      value = value.plus(fee);
    } else {
      data = ABI.Contracts.ExchangeContract.encodeInputs("deposit", {
        tokenAddress: token.address,
        amount: fm.toHex(value),
      });
      value = fm.toBig(fee);
    }

    return {
      from: from,
      to: exchangeAddress,
      value: value.toFixed(),
      data: data,
      chainId: chainId,
      nonce: nonce.toString(),
      gasPrice: fm.fromGWEI(gasPrice).toFixed(),
      gas: config.getGasLimitByType("depositTo").gas.toString(),
    };
  } catch (err) {
    console.error("Failed in method deposit. Error: ", err);
    throw err;
  }
}

export function onChainWithdraw({
  from,
  exchangeAddress,
  chainId,
  token,
  amount,
  nonce,
  gasPrice,
  fee,
}) {
  let to, value, data;
  try {
    value = fm.toBig(amount).times("1e" + token.decimals);
    to = token.symbol.toUpperCase() === "ETH" ? "0x0" : token.address;
    data = ABI.Contracts.ExchangeContract.encodeInputs("withdraw", {
      tokenAddress: to,
      amount: fm.toHex(value),
    });
    value = fm.toBig(fee);

    return {
      from: from,
      to: exchangeAddress,
      value: value.toFixed(),
      data: data,
      chainId: chainId,
      nonce: nonce.toString(),
      gasPrice: fm.fromGWEI(gasPrice).toFixed(),
      gas: config.getGasLimitByType("withdraw").gas.toString(),
    };
  } catch (err) {
    console.error("Failed in method withdraw. Error: ", err);
    throw err;
  }
}

function setupOffChainWithdrawal(withdrawal, tokens) {
  let token, feeToken;
  if (!withdrawal.token.startsWith("0x")) {
    token = config.getTokenBySymbol(withdrawal.token, tokens);
  } else {
    token = config.getTokenByAddress(withdrawal.token, tokens);
  }
  if (!withdrawal.tokenF.startsWith("0x")) {
    feeToken = config.getTokenBySymbol(withdrawal.tokenF, tokens);
  } else {
    feeToken = config.getTokenByAddress(withdrawal.tokenF, tokens);
  }
  withdrawal.tokenId = token.id;
  withdrawal.token = token.address;
  withdrawal.amountInBN = config.toWEI(token.symbol, withdrawal.amount, tokens);
  withdrawal.amount = withdrawal.amountInBN;

  withdrawal.tokenFId = feeToken.id;
  withdrawal.tokenF = feeToken.address;
  withdrawal.amountFInBN = config.toWEI(
    feeToken.symbol,
    withdrawal.amountF,
    tokens
  );
  withdrawal.amountF = withdrawal.amountFInBN;

  withdrawal.label =
    withdrawal.label !== undefined ? withdrawal.label : config.getLabel();
  return withdrawal;
}

export function signWithdrawal(_withdrawal, keyPair, exchangeId, tokens) {
  if (_withdrawal.signature !== undefined) {
    return;
  }

  const withdrawal = setupOffChainWithdrawal(_withdrawal, tokens);
  const hasher = Poseidon.createHash(9, 6, 53);

  // Calculate hash
  const inputs = [
    exchangeId,
    withdrawal.accountId,
    withdrawal.tokenId,
    withdrawal.amountInBN,
    withdrawal.tokenFId,
    withdrawal.amountFInBN,
    withdrawal.label,
    withdrawal.nonce,
  ];
  const hash = hasher(inputs).toString(10);

  // Create signature
  withdrawal.hash = hash;
  withdrawal.signature = EdDSA.sign(keyPair.secretKey, hash);

  /**
  // Verify signature
  const success = EdDSA.verify(hash, withdrawal.signature, [
    keyPair.publicKeyX,
    keyPair.publicKeyY
  ]);
  assert(success, 'Failed to verify signature');
  */
  return withdrawal;
}

export function signOrder(_order, keyPair, tokens) {
  if (_order.signature !== undefined) {
    return;
  }

  const order = setupOrder(_order, tokens);
  const hasher = Poseidon.createHash(14, 6, 53);

  // Calculate hash
  const inputs = [
    order.exchangeId,
    order.orderId,
    order.accountId,
    order.tokenSId,
    order.tokenBId,
    order.amountSInBN,
    order.amountBInBN,
    order.allOrNone ? 1 : 0,
    order.validSince,
    order.validUntil,
    order.maxFeeBips,
    order.buy ? 1 : 0,
    order.label,
  ];

  order.hash = hasher(inputs).toString(10);

  // Create signature
  const signature = EdDSA.sign(keyPair.secretKey, order.hash);
  order.signature = signature;
  order.signatureRx = signature.Rx;
  order.signatureRy = signature.Ry;
  order.signatureS = signature.s;

  /**
  // Verify signature
  const success = EdDSA.verify(order.hash, order.signature, [
    keyPair.publicKeyX,
    keyPair.publicKeyY
  ]);
  assert(success, 'Failed to verify signature');
   */
  return order;
}

function setupOrder(order, tokens) {
  let tokenBuy, tokenSell;
  if (!order.tokenS.startsWith("0x")) {
    tokenSell = config.getTokenBySymbol(order.tokenS, tokens);
  } else {
    tokenSell = config.getTokenByAddress(order.tokenS, tokens);
  }
  if (!order.tokenB.startsWith("0x")) {
    tokenBuy = config.getTokenBySymbol(order.tokenB, tokens);
  } else {
    tokenBuy = config.getTokenByAddress(order.tokenB, tokens);
  }
  order.tokenS = tokenSell.address;
  order.tokenB = tokenBuy.address;
  order.tokenSId = tokenSell.tokenId;
  order.tokenBId = tokenBuy.tokenId;

  order.amountSInBN = config.toWEI(tokenSell.symbol, order.amountS, tokens);
  order.amountS = order.amountSInBN;

  order.amountBInBN = config.toWEI(tokenBuy.symbol, order.amountB, tokens);
  order.amountB = order.amountBInBN;

  order.buy = order.buy !== undefined ? !!order.buy : false;

  order.maxFeeBips =
    order.maxFeeBips !== undefined ? order.maxFeeBips : config.getMaxFeeBips();
  order.allOrNone = order.allOrNone !== undefined ? !!order.allOrNone : false;

  order.feeBips =
    order.feeBips !== undefined ? order.feeBips : order.maxFeeBips;
  order.rebateBips = order.rebateBips !== undefined ? order.rebateBips : 0;
  order.label = order.label !== undefined ? order.label : config.getLabel();

  assert(order.maxFeeBips < 64, "maxFeeBips >= 64");
  assert(order.feeBips < 64, "feeBips >= 64");
  assert(order.rebateBips < 64, "rebateBips >= 64");
  assert(order.label < 2 ** 16, "order.label >= 2**16");

  // Sign the order
  return order;
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function signCancel(_cancel, keyPair) {
  if (_cancel.signature !== undefined) {
    return;
  }
  const cancel = setupCancel(_cancel);
  const hasher = Poseidon.createHash(9, 6, 53);

  // Calculate hash
  const inputs = [
    cancel.exchangeId,
    cancel.accountId,
    cancel.orderTokenId,
    cancel.orderId,
    cancel.tokenFId,
    cancel.amountFInBN,
    cancel.label,
    cancel.nonce,
  ];
  const hash = hasher(inputs).toString(10);

  // Create signature
  cancel.signature = EdDSA.sign(keyPair.secretKey, hash);

  /**
     *
     // Verify signature
     const success = EdDSA.verify(hash, cancel.signature, [
     keyPair.publicKeyX,
     keyPair.publicKeyY
     ]);
     assert(success, 'Failed to verify signature');
     */

  return cancel;
}

function setupCancel(cancel, tokens) {
  let orderToken, feeToken;
  if (!cancel.orderToken.startsWith("0x")) {
    orderToken = config.getTokenBySymbol(cancel.orderToken, tokens);
  } else {
    orderToken = config.getTokenByAddress(cancel.orderToken, tokens);
  }
  if (!cancel.tokenF.startsWith("0x")) {
    feeToken = config.getTokenBySymbol(cancel.tokenF, tokens);
  } else {
    feeToken = config.getTokenByAddress(cancel.tokenF, tokens);
  }
  cancel.tokenFId = feeToken.tokenId;
  cancel.tokenF = feeToken.symbol;
  cancel.orderTokenId = orderToken.tokenId;
  cancel.orderToken = orderToken.symbol;

  cancel.amountFInBN = config.toWEI(feeToken.symbol, cancel.amountF, tokens);
  cancel.amountF = cancel.amountFInBN;

  cancel.label = cancel.label !== undefined ? cancel.label : config.getLabel();
  return cancel;
}

export function signFlexCancel(request, keyPair) {
  if (request.signature !== undefined) {
    return;
  }

  const method = "DELETE";
  const uri = encodeURIComponent(`${config.getServer()}/api/v2/orders`);
  let params = `accountId=${request.accountId}`;

  if (request.clientOrderId) {
    params = params + `&clientOrderId=${request.clientOrderId}`;
  }

  if (request.orderHash) {
    params = params + `&orderHash=${request.orderHash}`;
  }

  const encodedParams = encodeURIComponent(params);
  const message = `${method}&${uri}&${encodedParams}`;

  const hash = fm.addHexPrefix(sha256(message).toString());
  // Create signature
  request.signature = EdDSA.sign(keyPair.secretKey, hash);

  /**
     *
     // Verify signature
     const success = EdDSA.verify(hash, request.signature, [
     keyPair.publicKeyX,
     keyPair.publicKeyY
     ]);
     assert(success, 'Failed to verify signature');
     */

  return request;
}

export function signTransfer(transfer, keyPair, tokens) {
  const tokenConf = config.getTokenBySymbol(transfer.token, tokens);
  const tokenFConf = config.getTokenBySymbol(transfer.tokenF, tokens);
  const amountInBN = config.toWEI(transfer.token, transfer.amount, tokens);
  const amountFInBN = config.toWEI(transfer.tokenF, transfer.amountF, tokens);
  transfer.token = tokenConf.tokenId;
  transfer.tokenF = tokenFConf.tokenId;
  transfer.amount = amountInBN;
  transfer.amountF = amountFInBN;

  const inputs = [
    transfer.exchangeId,
    transfer.sender,
    transfer.receiver,
    transfer.token,
    amountInBN,
    transfer.tokenF,
    amountFInBN,
    transfer.label,
    transfer.nonce,
  ];

  const hasher = Poseidon.createHash(10, 6, 53);
  const hash = hasher(inputs).toString(10);
  const signature = EdDSA.sign(keyPair.secretKey, hash);

  transfer.signatureRx = signature.Rx;
  transfer.signatureRy = signature.Ry;
  transfer.signatureS = signature.s;

  return transfer;
}

export function encodeTransfer({
  exchangeId,
  sender,
  receiver,
  token,
  amount,
  tokenF,
  amountF,
  label,
  nonce,
}) {
  const inputs = {
    exchangeId: exchangeId,
    sender: sender,
    receiver: receiver,
    token: token,
    amount: amount,
    tokenF: tokenF,
    amountF: amountF,
    label: label,
    nonce: nonce,
  };

  return fm.addHexPrefix(sha256(JSON.stringify(inputs)).toString());
}
