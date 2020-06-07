// Taken and modified from
// https://github.com/iden3/circomlib

import { bigInt } from "snarkjs";
import { createHash } from "./poseidon";

import babyJub from "./babyjub";
import createBlakeHash from "blake-hash";

function generateKeyPair(seed) {
  const secretKey = bigInt.leBuff2int(seed).mod(babyJub.subOrder);
  const publicKey = babyJub.mulPointEscalar(babyJub.Base8, secretKey);
  return {
    publicKeyX: publicKey[0].toString(10),
    publicKeyY: publicKey[1].toString(10),
    secretKey: secretKey.toString(10),
  };
}

function generatePubKeyFromPrivate(secretKey) {
  const publicKey = babyJub.mulPointEscalar(babyJub.Base8, bigInt(secretKey));
  return {
    publicKeyX: publicKey[0].toString(10),
    publicKeyY: publicKey[1].toString(10),
  };
}

function sign(strKey, msg) {
  const key = bigInt(strKey);
  const prv = bigInt.leInt2Buff(key, 32);

  const h1 = createBlakeHash("blake512").update(prv).digest();
  const msgBuff = bigInt.leInt2Buff(bigInt(msg), 32);
  const rBuff = createBlakeHash("blake512")
    .update(Buffer.concat([h1.slice(32, 64), msgBuff]))
    .digest();
  let r = bigInt.leBuff2int(rBuff);
  r = r.mod(babyJub.subOrder);

  const A = babyJub.mulPointEscalar(babyJub.Base8, key);
  const R8 = babyJub.mulPointEscalar(babyJub.Base8, r);

  const hasher = createHash(6, 6, 52);
  const hm = hasher([R8[0], R8[1], A[0], A[1], msg]);
  const S = r.add(hm.mul(key)).mod(babyJub.subOrder);

  return {
    Rx: R8[0].toString(),
    Ry: R8[1].toString(),
    s: S.toString(),
  };
}

function verify(msg, sig, pubKey) {
  const A = [bigInt(pubKey[0]), bigInt(pubKey[1])];
  const R = [bigInt(sig.Rx), bigInt(sig.Ry)];
  const S = bigInt(sig.s);

  // Check parameters
  if (!babyJub.inCurve(R)) return false;
  if (!babyJub.inCurve(A)) return false;
  if (S >= babyJub.subOrder) return false;

  const hasher = createHash(6, 6, 52);
  const hm = hasher([R[0], R[1], A[0], A[1], bigInt(msg)]);

  const Pleft = babyJub.mulPointEscalar(babyJub.Base8, S);
  let Pright = babyJub.mulPointEscalar(A, hm);
  Pright = babyJub.addPoint(R, Pright);

  if (!Pleft[0].equals(Pright[0])) return false;
  if (!Pleft[1].equals(Pright[1])) return false;

  return true;
}

export default {
  generateKeyPair,
  sign,
  verify,
  generatePubKeyFromPrivate,
};
