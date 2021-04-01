import Contract from './Contract';

const erc20Abi = require('../../config/abis/erc20.json');
const exchange36Abi = require('../../config/abis/exchange_3_6.json');
const contractWalletAbi = require('../../config/abis/contractWallet.json');

const ERC20Token = new Contract(erc20Abi);
const ExchangeContract = new Contract(exchange36Abi);
const ContractWallet = new Contract(contractWalletAbi);

export default {
  ERC20Token,
  ExchangeContract,
  ContractWallet,
};
