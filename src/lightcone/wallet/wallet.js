import * as exchange from '../sign/exchange';
import * as fm from '../common/formatter';

import {
  personalSign,
  sendTransaction,
  signEip712,
  signEthereumTx,
} from '../ethereum/metaMask';
import { sha256 } from 'ethereumjs-util';
import BigNumber from 'bignumber.js';

import { isHardwareAddress, saveHardwareAddress } from '../api/localStorgeAPI';
import { sleep } from 'modals/components/utils';
import Contracts from '../ethereum/contracts/Contracts';
import EdDSA from '../sign/eddsa';
import config from '../config';

const assert = require('assert');

export default class Wallet {
  keyMessage = 'Sign this message to access Loopring Exchange: ';
  transferMessage = 'Sign this message to authorize Loopring Pay: ';

  constructor(walletType, web3, address, accountId = -1, keyPair = null) {
    this.walletType = walletType;
    this.web3 = web3;
    this.address = address;
    this.accountId = accountId;
    this.keyPair = keyPair;
  }

  // 3.6
  /**
   * Approve Zero
   * @param tokenAddress: approve token symbol to zero
   * @param nonce: Ethereum nonce of this address
   * @param gasPrice: gas price in gwei
   * @param sendByMetaMask
   */
  async approveZero(
    tokenAddress,
    depositAddress,
    chainId,
    nonce,
    gasPrice,
    sendByMetaMask = false
  ) {
    const rawTx = {
      from: this.address,
      to: tokenAddress,
      value: '0',
      data: Contracts.ERC20Token.encodeInputs('approve', {
        _spender: depositAddress,
        _value: '0x0',
      }),
      chainId: chainId,
      nonce: nonce.toString(),
      gasPrice: fm.fromGWEI(gasPrice).toString(),
      gas: config.getGasLimitByType('approve').gas.toString(),
    };

    const response = sendByMetaMask
      ? await sendTransaction(this.web3, rawTx)
      : await signEthereumTx(this.web3, this.address, rawTx);
    return response['result'];
  }

  // 3.6
  /**
   * Approve Max
   * @param tokenAddress: approve token symbol to max
   * @param nonce: Ethereum nonce of this address
   * @param gasPrice: gas price in gwei
   * @param sendByMetaMask
   */
  async approveMax(
    tokenAddress,
    depositAddress,
    chainId,
    nonce,
    gasPrice,
    sendByMetaMask = false
  ) {
    // TODO: What is _spender?
    const rawTx = {
      from: this.address,
      to: tokenAddress,
      value: '0',
      data: Contracts.ERC20Token.encodeInputs('approve', {
        _spender: depositAddress,
        _value: config.getMaxAmountInWEI(),
      }),
      chainId: chainId,
      nonce: nonce.toString(),
      gasPrice: fm.fromGWEI(gasPrice).toString(),
      gas: config.getGasLimitByType('approve').gas.toString(),
    };
    const response = sendByMetaMask
      ? await sendTransaction(this.web3, rawTx)
      : await signEthereumTx(this.web3, this.address, rawTx);

    return response['result'];
  }

  /**
   * generate key pair of account in DEX
   */
  async generateKeyPair(exchangeAddress, keyNonce) {
    assert(this.address !== null);

    const result = await personalSign(
      this.web3,
      this.address,
      this.keyMessage + exchangeAddress + ' with key nonce: ' + keyNonce,
      this.walletType
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
      this.keyMessage + exchangeAddress + ' with key nonce: ' + keyNonce,
      this.walletType
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
    payload['from'] = this.address;

    const tx = exchange.createAccountAndDeposit({
      ...payload,
      publicX: keyPair.publicKeyX,
      publicY: keyPair.publicKeyY,
    });

    const response = sendByMetaMask
      ? await sendTransaction(this.web3, tx)
      : await signEthereumTx(this.web3, this.address, tx);

    return response['result'];
  }

  // 3.6
  async depositTo_3_6(payload, sendByMetaMask = false) {
    payload['from'] = this.address;
    const tx = exchange.deposit(payload);
    const response = sendByMetaMask
      ? await sendTransaction(this.web3, tx)
      : await signEthereumTx(this.web3, this.address, tx);
    return response['result'];
  }

  /**
   * Deposit to Dex
   * @param payload
   * @param sendByMetaMask
   */
  async depositTo(payload, sendByMetaMask = false) {
    payload['from'] = this.address;
    const tx = exchange.deposit(payload);
    const response = sendByMetaMask
      ? await sendTransaction(this.web3, tx)
      : await signEthereumTx(this.web3, this.address, tx);
    return response['result'];
  }

  /**
   * On-chain Withdrawal from Dex
   * @param payload
   * @param sendByMetaMask
   */
  async onchainWithdrawal(payload, sendByMetaMask) {
    payload['from'] = this.address;
    const tx = exchange.onChainWithdraw(payload);
    const response = sendByMetaMask
      ? await sendTransaction(this.web3, tx)
      : await signEthereumTx(this.web3, this.address, tx);
    return response['result'];
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
    exchangeAddress,
    tokenS,
    tokenB,
    amountS,
    amountB,
    orderId,
    validSince,
    validUntil,
    label,
    buy,
    channelId,
    orderType,
    poolAddress
  ) {
    const order = {
      exchange: exchangeAddress,
      owner: this.address,
      accountId: this.accountId,
      tokenS: tokenS,
      tokenB: tokenB,
      amountS: amountS,
      amountB: amountB,
      orderId: orderId,
      // validSince: Math.floor(validSince),
      validUntil: Math.floor(validUntil),
      label: label,
      buy: buy,
      channelId,
      orderType: orderType,
      poolAddress: poolAddress,
    };

    let data = exchange.signOrder(order, this.keyPair, tokens);
    // data['eddsaSig'] = data.signature;
    return data;
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

  batchCancelOrdersByHash(orderHashes) {
    return exchange.batchCancelOrdersByHash(
      this.accountId,
      orderHashes,
      this.keyPair
    );
  }

  batchCancelOrdersByClientOrderId(clientOrderIds) {
    return exchange.batchCancelOrdersByClientOrderIds(
      this.accountId,
      clientOrderIds,
      this.keyPair
    );
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

  // 3.6
  // 02 is for SignatureType.EIP_712 ， 03 for hash eth_sign
  async accountUpdate(data) {
    data['chainId'] = await this.web3.eth.net.getId();

    if (
      this.walletType === 'MetaMask' &&
      isHardwareAddress(this.address) === false
    ) {
      try {
        return {
          ecdsaSig:
            (await this.accountUpdateWithDataStructure(data)).ecdsaSig + '02',
        };
      } catch (err) {
        if (err.message.indexOf('Not supported on this device') !== -1) {
          console.log('catch err', err);
          saveHardwareAddress(this.address);

          // Sleep is to avoid MetaMask popup too fast.
          await sleep(1500);

          // Try not to use EIP 712
          // If it fails, throw errors
          return {
            ecdsaSig:
              (await this.accountUpdateWithoutDataStructure(data)).ecdsaSig +
              '03',
          };
        }
        throw err;
      }
    } else {
      const result = await this.accountUpdateWithoutDataStructure(data);
      return {
        ecdsaSig: result.ecdsaSig + '03',
      };
    }
  }

  async accountUpdateWithDataStructure(data) {
    const typedData = exchange.getAccountUpdateEcdsaSigTypedData(data);
    const msgParams = JSON.stringify(typedData);
    const params = [this.address, msgParams];
    const method = 'eth_signTypedData_v4';
    const signEip712Result = await signEip712(
      this.web3,
      this.address,
      method,
      params
    );

    return {
      ecdsaSig: signEip712Result.result,
    };
  }

  async accountUpdateWithoutDataStructure(data) {
    const hash = exchange.getAccountUpdateEcdsaSig(data);
    const signature = await personalSign(this.web3, this.address, hash);

    return {
      ecdsaSig: signature.sig,
    };
  }

  /**
   * Get Api Key signature
   * @param orderHash: [OPTIONAL] specified order hash to cancel
   * @param clientOrderId: [OPTIONAL] specified client order ID to cancel
   */
  submitFlexCancel(orderHash = '', clientOrderId = '') {
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

    const result = await personalSign(
      this.web3,
      this.address,
      message,
      this.walletType
    );

    if (result.error) {
      throw new Error(result.error.message);
    }

    return {
      address: this.address,
      sig: result['sig'],
      type,
    };
  }

  // 3.6
  async signOffchainWithdraw(data) {
    data['chainId'] = await this.web3.eth.net.getId();
    if (
      this.walletType === 'MetaMask' &&
      isHardwareAddress(this.address) === false
    ) {
      try {
        const result = await this.signOffchainWithdrawWithDataStructure(data);
        return {
          ...result,
          ecdsaSig: result.ecdsaSig + '02',
        };
      } catch (err) {
        if (err.message.indexOf('Not supported on this device') !== -1) {
          console.log('catch err', err);
          saveHardwareAddress(this.address);

          // Sleep is to avoid MetaMask popup too fast.
          await sleep(1500);

          // Try not to use EIP 712
          // If it fails, throw errors
          const result = await this.signOffchainWithdrawWithoutDataStructure(
            data
          );
          return {
            ...result,
            ecdsaSig: result.ecdsaSig + '03',
          };
        }
        throw err;
      }
    } else {
      const result = await this.signOffchainWithdrawWithoutDataStructure(data);
      return {
        ...result,
        ecdsaSig: result.ecdsaSig + '03',
      };
    }
  }

  async signOffchainWithdrawWithDataStructure(data) {
    const typedData = exchange.getWithdrawTypedData(data);
    const msgParams = JSON.stringify(typedData);
    const params = [this.address, msgParams];
    const method = 'eth_signTypedData_v4';
    const signEip712Result = await signEip712(
      this.web3,
      this.address,
      method,
      params
    );

    const eddsaSig = exchange.signOffChainWithdraw(
      data,
      this.keyPair,
      this.keyPair
    );

    return {
      ecdsaSig: signEip712Result.result,
      eddsaSig: eddsaSig,
    };
  }

  async signOffchainWithdrawWithoutDataStructure(data) {
    const hash = exchange.getWithdrawEcdsaSig(data);

    const signature = await personalSign(this.web3, this.address, hash);
    const eddsaSig = exchange.signOffChainWithdraw(
      data,
      this.keyPair,
      this.keyPair
    );

    return {
      ecdsaSig: signature.sig,
      eddsaSig: eddsaSig,
    };
  }

  // 3.6
  async signTransfer(data) {
    data['chainId'] = await this.web3.eth.net.getId();
    if (
      this.walletType === 'MetaMask' &&
      isHardwareAddress(this.address) === false
    ) {
      try {
        const result = await this.signTransferWithDataStructure(data);
        return {
          ...result,
          ecdsaSig: result.ecdsaSig + '02',
        };
      } catch (err) {
        if (err.message.indexOf('Not supported on this device') !== -1) {
          console.log('catch err', err);
          saveHardwareAddress(this.address);

          // Sleep is to avoid MetaMask popup too fast.
          await sleep(1500);

          // Try not to use EIP 712
          // If it fails, throw errors
          const result = await this.signTransferWithoutDataStructure(data);
          return {
            ...result,
            ecdsaSig: result.ecdsaSig + '03',
          };
        }
        throw err;
      }
    } else {
      const result = await this.signTransferWithoutDataStructure(data);
      return {
        ...result,
        ecdsaSig: result.ecdsaSig + '03',
      };
    }
  }

  async signTransferWithDataStructure(data) {
    const typedData = exchange.getTransferTypedData(data);
    const msgParams = JSON.stringify(typedData);
    const params = [this.address, msgParams];
    const method = 'eth_signTypedData_v4';
    const signEip712Result = await signEip712(
      this.web3,
      this.address,
      method,
      params
    );

    const eddsaSig = exchange.signTransfer(data, this.keyPair);
    return {
      ecdsaSig: signEip712Result.result,
      eddsaSig: eddsaSig,
    };
  }

  async signTransferWithoutDataStructure(data) {
    const hash = exchange.getTransferEcdsaSig(data);
    const signature = await personalSign(this.web3, this.address, hash);

    const eddsaSig = exchange.signTransfer(data, this.keyPair);
    return {
      ecdsaSig: signature.sig,
      eddsaSig: eddsaSig,
    };
  }

  signUpdateDistributeHash(request) {
    return exchange.signUpdateDistributeHash(request, this.keyPair);
  }

  async claimWithdrawal(
    exchangeAddress,
    chainId,
    nonce,
    gasPrice,
    blockIndex,
    slotIndex,
    sendByMetaMask = false
  ) {
    const rawTx = {
      from: this.address,
      to: exchangeAddress,
      value: '0',
      data: Contracts.ExchangeContract.encodeInputs(
        'withdrawFromApprovedWithdrawal',
        {
          blockIdx: blockIndex,
          slotIdx: slotIndex,
        }
      ),
      chainId: chainId,
      nonce: nonce.toString(),
      gasPrice: fm.fromGWEI(gasPrice).toString(),
      gas: config.getGasLimitByType('claim').gas.toString(),
    };
    const response = sendByMetaMask
      ? await sendTransaction(this.web3, rawTx)
      : await signEthereumTx(this.web3, this.address, rawTx);

    return response['result'];
  }

  // 3.6

  async ammJoin(data) {
    data['chainId'] = await this.web3.eth.net.getId();
    const hash = exchange.getAmmJoinEcdsaSig(data);
    const sigHash = fm.toHex(new BigNumber(hash, 16).idiv(8));
    const signature = EdDSA.sign(this.keyPair.secretKey, sigHash);

    return {
      eddsaSig:
        fm.formatEddsaKey(fm.toHex(fm.toBig(signature.Rx))) +
        fm.clearHexPrefix(fm.formatEddsaKey(fm.toHex(fm.toBig(signature.Ry)))) +
        fm.clearHexPrefix(fm.formatEddsaKey(fm.toHex(fm.toBig(signature.s)))),
    };
  }

  // async ammJoin(data) {
  //   data['chainId'] = await this.web3.eth.net.getId();
  //
  //   if (
  //     this.walletType === 'MetaMask' &&
  //     isHardwareAddress(this.address) === false
  //   ) {
  //     try {
  //       return {
  //         ecdsaSig: (await this.ammJoinWithDataStructure(data)).ecdsaSig + '02',
  //       };
  //     } catch (err) {
  //       // Try not to use EIP 712
  //       // If it fails, throw errors
  //       if (err.message.indexOf('Not supported on this device') !== -1) {
  //         console.log('catch err', err);
  //         saveHardwareAddress(this.address);
  //
  //         // Sleep is to avoid MetaMask popup too fast.
  //         await sleep(1500);
  //
  //         // Try not to use EIP 712
  //         // If it fails, throw errors
  //         return {
  //           ecdsaSig:
  //             (await this.ammJoinWithoutDataStructure(data)).ecdsaSig + '03',
  //         };
  //       }
  //       throw err;
  //     }
  //   } else {
  //     const result = await this.ammJoinWithoutDataStructure(data);
  //     return {
  //       ecdsaSig: result.ecdsaSig + '03',
  //     };
  //   }
  // }

  async ammJoinWithDataStructure(data) {
    const typedData = exchange.getAmmJoinEcdsaTypedData(data);
    const msgParams = JSON.stringify(typedData);
    const params = [this.address, msgParams];
    const method = 'eth_signTypedData_v4';
    const signEip712Result = await signEip712(
      this.web3,
      this.address,
      method,
      params
    );

    return {
      ecdsaSig: signEip712Result.result,
    };
  }

  async ammJoinWithoutDataStructure(data) {
    const hash = exchange.getAmmJoinEcdsaSig(data);
    const signature = await personalSign(this.web3, this.address, hash);

    return {
      ecdsaSig: signature.sig,
    };
  }

  async ammExit(data) {
    data['chainId'] = await this.web3.eth.net.getId();
    const hash = exchange.getAmmExitEcdsaSig(data);
    const sigHash = fm.toHex(new BigNumber(hash, 16).idiv(8));
    const signature = EdDSA.sign(this.keyPair.secretKey, sigHash);

    return {
      eddsaSig:
        fm.formatEddsaKey(fm.toHex(fm.toBig(signature.Rx))) +
        fm.clearHexPrefix(fm.formatEddsaKey(fm.toHex(fm.toBig(signature.Ry)))) +
        fm.clearHexPrefix(fm.formatEddsaKey(fm.toHex(fm.toBig(signature.s)))),
    };
  }

  // async ammExit(data) {
  //   data['chainId'] = await this.web3.eth.net.getId();
  //
  //   if (
  //     this.walletType === 'MetaMask' &&
  //     isHardwareAddress(this.address) === false
  //   ) {
  //     try {
  //       return {
  //         ecdsaSig: (await this.ammExitWithDataStructure(data)).ecdsaSig + '02',
  //       };
  //     } catch (err) {
  //       // Try not to use EIP 712
  //       // If it fails, throw errors
  //       if (err.message.indexOf('Not supported on this device') !== -1) {
  //         console.log('catch err', err);
  //         saveHardwareAddress(this.address);
  //
  //         // Sleep is to avoid MetaMask popup too fast.
  //         await sleep(1500);
  //
  //         // Try not to use EIP 712
  //         // If it fails, throw errors
  //         return {
  //           ecdsaSig:
  //             (await this.ammExitWithoutDataStructure(data)).ecdsaSig + '03',
  //         };
  //       }
  //       throw err;
  //     }
  //   } else {
  //     const result = await this.ammExitWithoutDataStructure(data);
  //     return {
  //       ecdsaSig: result.ecdsaSig + '03',
  //     };
  //   }
  // }

  async ammExitWithDataStructure(data) {
    const typedData = exchange.getAmmExitEcdsaTypedData(data);
    const msgParams = JSON.stringify(typedData);
    var params = [this.address, msgParams];
    var method = 'eth_signTypedData_v4';
    const signEip712Result = await signEip712(
      this.web3,
      this.address,
      method,
      params
    );
    return {
      ecdsaSig: signEip712Result.result,
    };
  }

  async ammExitWithoutDataStructure(data) {
    const hash = exchange.getAmmExitEcdsaSig(data);
    const signature = await personalSign(this.web3, this.address, hash);

    return {
      ecdsaSig: signature.sig,
    };
  }
}
