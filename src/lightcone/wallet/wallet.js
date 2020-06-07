import * as exchange from "../sign/exchange";
import * as fm from "../common/formatter";
import {
  personalSign,
  sendTransaction,
  signEthereumTx,
} from "../ethereum/metaMask";
import { sha256 } from "ethereumjs-util";
import Contracts from "../ethereum/contracts/Contracts";
import config from "../config";

const assert = require("assert");

export default class Wallet {
  keyMessage = "Sign this message to access Loopring Exchange: ";
  transferMessage = "Sign this message to authorize Loopring Pay: ";

  constructor(walletType, web3, address, accountId = -1, keyPair = null) {
    this.walletType = walletType;
    this.web3 = web3;
    this.address = address;
    this.accountId = accountId;
    this.keyPair = keyPair;
  }

  /**
   * Approve Zero
   * @param tokenAddress: approve token symbol to zero
   * @param nonce: Ethereum nonce of this address
   * @param gasPrice: gas price in gwei
   * @param sendByMetaMask
   */
  async approveZero(
    tokenAddress,
    exchangeAddress,
    chainId,
    nonce,
    gasPrice,
    sendByMetaMask = false
  ) {
    const rawTx = {
      from: this.address,
      to: tokenAddress,
      value: "0",
      data: Contracts.ERC20Token.encodeInputs("approve", {
        _spender: exchangeAddress,
        _value: "0x0",
      }),
      chainId: chainId,
      nonce: nonce.toString(),
      gasPrice: fm.fromGWEI(gasPrice).toString(),
      gas: config.getGasLimitByType("approve").gas.toString(),
    };

    const response = sendByMetaMask
      ? await sendTransaction(this.web3, rawTx)
      : await signEthereumTx(this.web3, this.address, rawTx);
    return response["result"];
  }

  /**
   * Approve Max
   * @param tokenAddress: approve token symbol to max
   * @param nonce: Ethereum nonce of this address
   * @param gasPrice: gas price in gwei
   * @param sendByMetaMask
   */
  async approveMax(
    tokenAddress,
    exchangeAddress,
    chainId,
    nonce,
    gasPrice,
    sendByMetaMask = false
  ) {
    const rawTx = {
      from: this.address,
      to: tokenAddress,
      value: "0",
      data: Contracts.ERC20Token.encodeInputs("approve", {
        _spender: exchangeAddress,
        _value: config.getMaxAmountInWEI(),
      }),
      chainId: chainId,
      nonce: nonce.toString(),
      gasPrice: fm.fromGWEI(gasPrice).toString(),
      gas: config.getGasLimitByType("approve").gas.toString(),
    };
    const response = sendByMetaMask
      ? await sendTransaction(this.web3, rawTx)
      : await signEthereumTx(this.web3, this.address, rawTx);

    return response["result"];
  }

  /**
   * generate key pair of account in DEX
   */
  async generateKeyPair(exchangeAddress, keyNonce) {
    assert(this.address !== null);

    const result = await personalSign(
      this.web3,
      this.address,
      this.keyMessage + exchangeAddress + " with key nonce: " + keyNonce
    );

    if (!result.error) {
      return {
        keyPair: exchange.generateKeyPair(sha256(fm.toBuffer(result.sig))),
      };
    } else return result;
  }

  /**
   * verify EDDSA Private Key of account in DEX
   */
  async verify(exchangeAddress, keyNonce) {
    assert(this.address !== null);

    const result = await personalSign(
      this.web3,
      this.address,
      this.keyMessage + exchangeAddress + " with key nonce: " + keyNonce
    );

    if (result.error) {
      throw new Error(result.error.message);
    }

    return exchange.verify(
      this.keyPair.publicKeyX,
      this.keyPair.publicKeyY,
      sha256(fm.toBuffer(result.sig))
    );
  }

  /**
   * create Or Update Account in DEX
   * @param gasPrice: in gwei
   * @param nonce: Ethereum nonce of this address
   * @param permission: user permission
   * @param sendByMetaMask
   */

  /**
   *
   * exchangeAddress,
   fee,
   chainId,
   publicX,
   publicY,
   token,
   amount,
   permission,
   nonce,
   gasPrice
   *
   * */
  async createOrUpdateAccount(keyPair, payload, sendByMetaMask = false) {
    payload["from"] = this.address;

    const tx = exchange.createAccountAndDeposit({
      ...payload,
      publicX: keyPair.publicKeyX,
      publicY: keyPair.publicKeyY,
    });

    const response = sendByMetaMask
      ? await sendTransaction(this.web3, tx)
      : await signEthereumTx(this.web3, this.address, tx);

    return response["result"];
  }

  /**
   * Deposit to Dex
   * @param payload
   * @param sendByMetaMask
   */
  async depositTo(payload, sendByMetaMask = false) {
    payload["from"] = this.address;
    const tx = exchange.deposit(payload);
    const response = sendByMetaMask
      ? await sendTransaction(this.web3, tx)
      : await signEthereumTx(this.web3, this.address, tx);
    return response["result"];
  }

  /**
   * On-chain Withdrawal from Dex
   * @param payload
   * @param sendByMetaMask
   */
  async onchainWithdrawal(payload, sendByMetaMask) {
    payload["from"] = this.address;
    const tx = exchange.onChainWithdraw(payload);
    const response = sendByMetaMask
      ? await sendTransaction(this.web3, tx)
      : await signEthereumTx(this.web3, this.address, tx);
    return response["result"];
  }

  /**
   * Off-chain Withdrawal from Dex
   * @param accountId: account ID in exchange
   * @param nonce: DEX nonce of account
   * @param token: token symbol or address to withdraw
   * @param amount: amount to withdraw, in decimal string. e.g. '15'
   * @param tokenF: fee token symbol or address to withdraw
   * @param amountF: withdrawal fee, in decimal string. e.g. '15'
   * @param label: label used in protocol
   */
  offchainWithdrawal(accountId, nonce, token, amount, tokenF, amountF, label) {
    const withdraw = {
      accountId: this.accountId,
      nonce: nonce,
      token: token,
      amount: amount,
      tokenF: tokenF,
      amountF: amountF,
      label: label,
    };
    return exchange.signWithdrawal(withdraw, this.keyPair);
  }

  /**
   * Get signed order, should be submitted by frontend itself TEMPORARY
   * @param tokenS: symbol or hex address of token sell
   * @param tokenB: symbol or hex address of token buy
   * @param amountS: amount of token sell, in string number
   * @param amountB: amount of token buy, in string number
   * @param orderId: next order ID, needed by order signature
   * @param validSince: valid beginning period of this order, SECOND in timestamp
   * @param validUntil: valid ending period of this order, SECOND in timestamp
   * @param label label used in protocol
   * @param buy boolean
   * @param channelId
   */
  submitOrder(
    tokens,
    exchangeId,
    tokenS,
    tokenB,
    amountS,
    amountB,
    orderId,
    validSince,
    validUntil,
    label,
    buy,
    channelId
  ) {
    const order = {
      exchangeId,
      owner: this.address,
      accountId: this.accountId,
      tokenS: tokenS,
      tokenB: tokenB,
      amountS: amountS,
      amountB: amountB,
      orderId: orderId,
      validSince: Math.floor(validSince),
      validUntil: Math.floor(validUntil),
      label: label,
      buy: buy,
      channelId,
    };

    return exchange.signOrder(order, this.keyPair, tokens);
  }

  /**
   * Cancel order in Dex
   * @param nonce: DEX nonce of account
   * @param orderToken: token symbol or address of cancel
   * @param orderId: specified order id to cancel
   * @param tokenF: amountF token symbol or address of cancel
   * @param amountF: cancel amountF, e.g. '15'
   * @param label: [OPTIONAL] label used in protocol
   */
  submitCancel(nonce, orderToken, orderId, tokenF, amountF, label) {
    const cancel = {
      accountId: this.accountId,
      nonce: nonce,
      orderToken: orderToken,
      orderId: orderId,
      tokenF: tokenF,
      amountF: amountF,
      label: label,
    };

    return exchange.signCancel(cancel, this.keyPair);
  }

  /**
   * Get Api Key signature
   */
  getApiKey() {
    const request = {
      accountId: this.accountId,
    };
    return exchange.signGetApiKey(request, this.keyPair);
  }

  applyApiKey() {
    const request = {
      accountId: this.accountId,
    };
    return exchange.signApplyApiKey(request, this.keyPair);
  }

  /**
   * Get Api Key signature
   * @param orderHash: [OPTIONAL] specified order hash to cancel
   * @param clientOrderId: [OPTIONAL] specified client order ID to cancel
   */
  submitFlexCancel(orderHash = "", clientOrderId = "") {
    const request = {
      accountId: this.accountId,
      orderHash: orderHash,
      clientOrderId: clientOrderId,
    };
    return exchange.signFlexCancel(request, this.keyPair);
  }

  /**
   * Generate Hebao Guadian message
   */
  async generateHebaoGuadianMessage(type, message) {
    assert(this.address !== null);

    const result = await personalSign(this.web3, this.address, message);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return {
      address: this.address,
      sig: result["sig"],
      type,
    };
  }

  async signTransfer(transfer, tokens) {
    transfer.sender = this.accountId;
    const signedTransfer = exchange.signTransfer(
      transfer,
      this.keyPair,
      tokens
    );

    const encodeTransfer = exchange.encodeTransfer(signedTransfer);
    const result = await personalSign(
      this.web3,
      this.address,
      `${this.transferMessage}${encodeTransfer}`
    );

    if (!result.error) {
      return {
        ecdsaSig: result.sig,
        transfer: signedTransfer,
      };
    } else return result;
  }
}
