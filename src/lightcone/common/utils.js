import { hashPersonalMessage, keccak } from 'ethereumjs-util';
import { toBig, toHex } from './formatter';
import crypto from 'crypto';

/**
 * trim head space and tail space
 * @param str string
 */
export function trim(str) {
  return str.replace(/(^\s+)|(\s+$)/g, '');
}

/**
 * trim all spaces
 * @param str
 */
export function trimAll(str) {
  return trim(str).replace(/\s/g, '');
}

export function keccakHash(str) {
  return toHex(keccak(str));
}

export async function pbkdf2Hash(password, address, salt = 'Loopring') {
  return new Promise((resolve) => {
    crypto.pbkdf2(
      password,
      salt + address.toLowerCase(),
      4000000,
      32,
      'sha256',
      function (err, result) {
        if (err) {
          resolve({ error: err });
        } else {
          resolve({ hash: toHex(result) });
        }
      }
    );
  });
}

export function calculateGas(gasPrice, gasLimit) {
  return toBig(gasPrice).times(gasLimit).div(1e9);
}

const ExitEnable = 1;
const JoinEnable = 2;
const SwapEnable = 4;
const ShowMarket = 8;

export function isExitEnable(status) {
  return (status & ExitEnable) === ExitEnable;
}

export function isJoinEnable(status) {
  return (status & JoinEnable) === JoinEnable;
}

export function isSwapEnable(status) {
  return (status & SwapEnable) === SwapEnable;
}

export function isShowMarket(status) {
  return (status & ShowMarket) === ShowMarket;
}

export function isValidENS(value) {
  return (
    value.toLowerCase().endsWith('.eth') ||
    value.toLowerCase().endsWith('.xyz') ||
    value.toLowerCase().endsWith('.luxe') ||
    value.toLowerCase().endsWith('.kred') ||
    value.toLowerCase().endsWith('.art')
  );
}

export default {
  hashPersonalMessage,
  trim,
  trimAll,
  keccakHash,
  calculateGas,
  pbkdf2Hash,
  isExitEnable,
  isJoinEnable,
  isSwapEnable,
  isShowMarket,
  isValidENS,
};
