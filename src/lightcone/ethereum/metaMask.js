import { addHexPrefix, toBuffer, toHex, toNumber } from "../common/formatter";
import { hashPersonalMessage, keccak256 } from "ethereumjs-util";
import { validate } from "../common";
import ABI from "../ethereum/contracts";
import Transaction from "ethereumjs-tx";

/**
 * @description sign hash
 * @param web3
 * @param account
 * @param hash
 * @returns {Promise.<*>}
 */
export async function sign(web3, account, hash) {
  await validate({ value: account, type: "ETH_ADDRESS" });

  return new Promise((resolve) => {
    web3.eth.sign(hash, account, function (err, result) {
      if (!err) {
        const r = result.slice(0, 66);
        const s = addHexPrefix(result.slice(66, 130));
        const v = toNumber(addHexPrefix(result.slice(130, 132)));
        resolve({ result: { r, s, v } });
      } else {
        const errorMsg = err.message.substring(0, err.message.indexOf(" at "));
        resolve({ error: { message: errorMsg } });
      }
    });
  });
}

/**
 * @description sign message
 * @param web3
 * @param account
 * @param message
 * @returns {Promise}
 */
export async function signMessage(web3, account, message) {
  const hash = toHex(hashPersonalMessage(keccak256(message)));
  return await sign(web3, account, hash);
}

export async function personalSign(web3, account, msg) {
  return new Promise((resolve) => {
    web3.eth.personal.sign(msg, account, "", async function (err, result) {
      if (!err) {
        const valid = await ecRecover(web3, account, msg, result);
        if (valid.result) {
          resolve({ sig: result });
        } else {
          const walletValid = await contractWalletValidate(
            web3,
            account,
            msg,
            result
          );
          // console.log(JSON.stringify(walletValid));
          if (walletValid.result) {
            resolve({ sig: result });
          } else {
            const walletValid2 = await contractWalletValidate2(
              web3,
              account,
              msg,
              result
            );
            console.log(JSON.stringify(walletValid2));
            if (walletValid2.result) {
              resolve({ sig: result });
            } else {
              resolve({ error: "invalid sig" });
            }
          }
        }
      } else resolve({ error: err });
    });
  });
}

export async function ecRecover(web3, account, msg, sig) {
  return new Promise((resolve) => {
    web3.eth.personal.ecRecover(msg, sig, function (err, address) {
      if (!err)
        resolve({
          result: address.toLowerCase() === account.toLowerCase(),
        });
      else resolve({ error: err });
    });
  });
}

export async function contractWalletValidate(web3, account, msg, sig) {
  return new Promise((resolve) => {
    const hash = hashPersonalMessage(toBuffer(msg));
    const data = ABI.Contracts.ContractWallet.encodeInputs(
      "isValidSignature(bytes,bytes)",
      {
        _data: hash,
        _signature: toBuffer(sig),
      }
    );

    web3.eth.call(
      {
        to: account, // contract addr
        data: data,
      },
      function (err, result) {
        if (!err) {
          const valid = ABI.Contracts.ContractWallet.decodeOutputs(
            "isValidSignature(bytes,bytes)",
            result
          );
          resolve({
            result: toHex(toBuffer(valid[0])) === data.slice(0, 10),
          });
        } else resolve({ error: err });
      }
    );
  });
}

export async function contractWalletValidate2(web3, account, msg, sig) {
  return new Promise((resolve) => {
    const hash = hashPersonalMessage(toBuffer(msg));
    const data = ABI.Contracts.ContractWallet.encodeInputs(
      "isValidSignature(bytes32,bytes)",
      {
        _data: hash,
        _signature: toBuffer(sig),
      }
    );

    web3.eth.call(
      {
        to: account, // contract addr
        data: data,
      },
      function (err, result) {
        if (!err) {
          const valid = ABI.Contracts.ContractWallet.decodeOutputs(
            "isValidSignature(bytes32,bytes)",
            result
          );
          resolve({
            result: toHex(toBuffer(valid[0])) === data.slice(0, 10),
          });
        } else resolve({ error: err });
      }
    );
  });
}

/**
 * @description Signs ethereum tx
 * @param web3
 * @param account
 * @param rawTx
 * @returns {Promise.<*>}
 */
export async function signEthereumTx(web3, account, rawTx) {
  await validate({ value: rawTx, type: "TX" });
  const ethTx = new Transaction(rawTx);
  const hash = toHex(ethTx.hash(false));
  const response = await sign(web3, account, hash);
  if (!response["error"]) {
    const signature = response["result"];
    signature.v += ethTx.getChainId() * 2 + 8;
    Object.assign(ethTx, signature);
    return { result: toHex(ethTx.serialize()) };
  } else {
    throw new Error(response["error"]["message"]);
  }
}

/**
 * @description Sends ethereum tx through MetaMask
 * @param web3
 * @param tx
 * @returns {*}
 */
export async function sendTransaction(web3, tx) {
  await validate({ type: "TX", value: tx });
  delete tx.gasPrice;
  const response = await new Promise((resolve) => {
    web3.eth.sendTransaction(tx, function (err, transactionHash) {
      if (!err) {
        resolve({ result: transactionHash });
      } else {
        resolve({ error: { message: err.message } });
      }
    });
  });

  if (response["result"]) {
    return response;
  } else {
    throw new Error(response["error"]["message"]);
  }
}
