import { ActionButton, AssetDropdownMenuItem } from 'styles/Styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Instruction,
  MyModal,
  Section,
  TextPopupTitle,
} from 'modals/styles/Styles';

import { Checkbox, Input, Spin } from 'antd';
import { connect } from 'react-redux';
import { showWithdrawModal } from 'redux/actions/ModalManager';
import AppLayout from 'AppLayout';
import AssetDropdown from 'modals/components/AssetDropdown';
import ErrorMessage from 'modals/components/ErrorMessage';
import Group from 'modals/components/Group';
import I from 'components/I';
import LabelValue from 'modals/components/LabelValue';
import ModalIndicator from 'modals/components/ModalIndicator';
import NumericInput from 'components/NumericInput';
import React from 'react';

import styled, { withTheme } from 'styled-components';

import {
  checkWithdrawAgent,
  getEstimatedBlockTime,
  getStorageId,
  submitWithdraw,
} from 'lightcone/api/LightconeAPI';
import { debounce } from 'lodash';
import { dropTrailingZeroes } from 'pages/trade/components/defaults/util';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { fetchInfo } from 'redux/actions/ExchangeInfo';
import { formatter } from 'lightcone/common';
import { getWalletType } from 'lightcone/api/localStorgeAPI';
import { isValidAddress } from 'ethereumjs-util';
import { isValidENS } from '../lightcone/common/utils';
import { notifyError, notifySuccess } from 'redux/actions/Notification';
import WalletConnectIndicator from 'modals/components/WalletConnectIndicator';
import WalletConnectIndicatorPlaceholder from 'modals/components/WalletConnectIndicatorPlaceholder';
import config from 'lightcone/config';

const { Search } = Input;

const SearchStyled = styled(Search)`
  .ant-input-suffix {
    display: table;
    height: 100%;

    .ant-input-search-icon {
      display: ${(props) => (props.loading ? 'table-cell' : 'none')};
      vertical-align: middle;
      color: ${(props) => props.theme.textDim};
    }
  }
`;

class WithdrawModal extends React.Component {
  state = {
    errorMessage1: '',
    errorToken: '',
    errorMessage2: '',
    loading: false,
    amount: null,
    balance: 0,
    validateAmount: true,
    availableAmount: 0,
    addressValue: '',
    addressLoading: false,
    toAddress: '',
    validateAddress: true,
    hasFastWithdraw: false,
    hasFastWithdrawDict: {},
    enableFastWithdraw: false,
    estimatedBlockTime: '-',
  };

  componentDidMount() {
    if (this.props.dexAccount.account.address) {
      this.setState({
        addressValue: this.props.dexAccount.account.address,
        toAddress: this.props.dexAccount.account.address,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // When the modal becomes visible
    if (
      this.props.isVisible &&
      (this.props.dexAccount.account.address !==
        prevProps.dexAccount.account.address ||
        this.props.isVisible !== prevProps.isVisible) &&
      window.wallet
    ) {
      const { balances } = this.props.balances;
      const selectedTokenSymbol = this.props.modalManager.withdrawalToken;
      const holdAmount = this.getAvailableAmount(selectedTokenSymbol, balances);
      const balance = this.getHoldBalance(selectedTokenSymbol, balances);

      this.setState({
        balance: balance,
        availableAmount: holdAmount,
        validateAmount:
          !this.state.amount || Number(this.state.amount) <= holdAmount,
        addressValue:
          this.state.addressValue || this.props.dexAccount.account.address,
        toAddress:
          this.state.toAddress || this.props.dexAccount.account.address,
      });
      this.fetchEstimatedBlockTime();
      this.checkFastWithdraw();

      (async () => {
        this.props.fetchInfo();
      })();
    }

    if (
      prevProps.modalManager.withdrawalToken !==
        this.props.modalManager.withdrawalToken &&
      this.props.exchange.isInitialized
    ) {
      this.fetchEstimatedBlockTime();
      this.checkFastWithdraw();
      const { balances } = this.props.balances;
      const selectedTokenSymbol = this.props.modalManager.withdrawalToken;
      const holdAmount = this.getAvailableAmount(selectedTokenSymbol, balances);
      const balance = this.getHoldBalance(selectedTokenSymbol, balances);
      this.setState({
        balance: balance,
        availableAmount: holdAmount,
        validateAmount:
          !this.state.amount || Number(this.state.amount) <= holdAmount,
      });
    }

    if (
      this.props.isVisible === false &&
      this.props.isVisible !== prevProps.isVisible
    ) {
      this.setState({
        loading: false,
        amount: null,
        validateAmount: true,
        availableAmount: 0,
        addressValue: '',
        addressLoading: false,
        toAddress: '',
        validateAddress: true,
      });
    }
  }

  handleCurrencyTypeSelect = (tokenSymbol) => {
    const amount = this.getAvailableAmount(
      tokenSymbol,
      this.props.balances.balances
    );
    this.props.showModal(tokenSymbol);

    // Reset amount and error message
    this.setState(
      {
        amount: null,
        validateAmount: true,
        availableAmount: amount,
      },
      () => {
        this.checkAgentAmount();
      }
    );
  };

  // TODO: move to redux. will do the tranformation just after getting the data.
  getAvailableAmount = (symbol, balances) => {
    const tokens = this.props.exchange.tokens;
    const selectedToken = config.getTokenBySymbol(symbol, tokens);
    const holdBalance = balances.find(
      (ba) => ba.tokenId === selectedToken.tokenId
    );

    const avaliableBalance = holdBalance
      ? formatter
          .toBig(holdBalance.totalAmount)
          .minus(holdBalance.frozenAmount)
          .minus(this.getFeeCost(symbol))
      : formatter.toBig(0);

    return config.fromWEI(
      selectedToken.symbol,
      avaliableBalance.isPositive() ? avaliableBalance : 0,
      tokens
    );
  };

  getHoldBalance = (symbol, balances) => {
    const tokens = this.props.exchange.tokens;
    const selectedToken = config.getTokenBySymbol(symbol, tokens);
    const holdBalance = balances.find(
      (ba) => ba.tokenId === selectedToken.tokenId
    );
    return holdBalance
      ? config.fromWEI(
          selectedToken.symbol,
          formatter.toBig(holdBalance.totalAmount),
          tokens,
          {
            ceil: true,
          }
        )
      : config.fromWEI(selectedToken.symbol, 0, tokens);
  };

  fetchEstimatedBlockTime = () => {
    (async () => {
      try {
        let blockTime = await getEstimatedBlockTime();
        this.setState({
          estimatedBlockTime: blockTime,
        });
      } catch (e) {
        console.log('e', e);
      } finally {
      }
    })();
  };

  checkFastWithdraw = () => {
    (async () => {
      let maxTotalAmount = 0;
      let selectedTokenSymbol = this.props.modalManager.withdrawalToken;

      if (selectedTokenSymbol in this.state.hasFastWithdrawDict) {
        if (this.state.hasFastWithdrawDict[selectedTokenSymbol]) {
          this.setState({
            hasFastWithdraw: true,
          });
          return;
        } else {
          this.setState({
            hasFastWithdraw: false,
          });
          return;
        }
      }

      const tokenConf = config.getTokenBySymbol(
        selectedTokenSymbol,
        this.props.exchange.tokens
      );

      try {
        let fastWithdrawLimit = config.fromWEI(
          selectedTokenSymbol,
          tokenConf.fastWithdrawLimit,
          this.props.exchange.tokens
        );
        if (Number(fastWithdrawLimit) < Number(this.state.amount)) {
          maxTotalAmount = Number(fastWithdrawLimit);
          throw 'fastWithdrawLimit';
        }

        let withdrawAgents = await checkWithdrawAgent(tokenConf.tokenId, '0');
        if (withdrawAgents) {
          for (let i = 0; i < withdrawAgents.length; i++) {
            let withdrawAgent = withdrawAgents[i];
            let totalAmount = config.fromWEI(
              selectedTokenSymbol,
              withdrawAgent['totalAmount'],
              this.props.exchange.tokens
            );
            if (Number(totalAmount) > maxTotalAmount) {
              maxTotalAmount = totalAmount;
            }
          }
        }
      } catch (e) {
        console.log('e', e);
      } finally {
      }

      let copyHasFastWithdrawDict = this.state.hasFastWithdrawDict;

      if (maxTotalAmount > 0) {
        copyHasFastWithdrawDict[selectedTokenSymbol] = true;
        this.setState({
          hasFastWithdraw: true,
          hasFastWithdrawDict: copyHasFastWithdrawDict,
        });
      } else {
        copyHasFastWithdrawDict[selectedTokenSymbol] = false;
        this.setState({
          hasFastWithdraw: false,
          hasFastWithdrawDict: copyHasFastWithdrawDict,
        });
      }
    })();
  };

  getFeeCost = (token) => {
    if (this.state.hasFastWithdraw && this.state.enableFastWithdraw) {
      return this.getFastWithdrawFeeCost(token);
    } else {
      return this.getWithdrawFeeCost(token);
    }
  };

  getWithdrawFeeCost = (token) => {
    if (this.props.exchange && this.props.exchange.withdrawalFees) {
      const feeConfig = config.getFeeByToken(
        token,
        this.props.exchange.withdrawalFees
      );
      return feeConfig ? feeConfig.fee : '0';
    } else return '0';
  };

  getFastWithdrawFeeCost = (token) => {
    if (this.props.exchange && this.props.exchange.fastWithdrawalFees) {
      const feeConfig = config.getFeeByToken(
        token,
        this.props.exchange.fastWithdrawalFees
      );
      return feeConfig ? feeConfig.fee : '0';
    } else return '0';
  };

  clickedEnableFastWithdrawal = (e) => {
    this.setState(
      {
        enableFastWithdraw: e.target.checked,
        validateAmount: this.validateAmount(),
      },
      () => {
        this.checkAgentAmount();
        const { balances } = this.props.balances;
        const selectedTokenSymbol = this.props.modalManager.withdrawalToken;
        const holdAmount = this.getAvailableAmount(
          selectedTokenSymbol,
          balances
        );
        const balance = this.getHoldBalance(selectedTokenSymbol, balances);
        this.setState({
          balance: balance,
          availableAmount: holdAmount,
          validateAmount:
            !this.state.amount || Number(this.state.amount) <= holdAmount,
        });
      }
    );
  };

  clickedDisableFastWithdrawal = (e) => {
    this.setState(
      {
        enableFastWithdraw: !e.target.checked,
        validateAmount: this.validateAmount(),
      },
      () => {
        this.checkAgentAmount();
        const { balances } = this.props.balances;
        const selectedTokenSymbol = this.props.modalManager.withdrawalToken;
        const holdAmount = this.getAvailableAmount(
          selectedTokenSymbol,
          balances
        );
        const balance = this.getHoldBalance(selectedTokenSymbol, balances);
        this.setState({
          balance: balance,
          availableAmount: holdAmount,
          validateAmount:
            !this.state.amount || Number(this.state.amount) <= holdAmount,
        });
      }
    );
  };

  checkAgentAmount = debounce(() => {
    // Only check when the amount is validated.
    if (
      !this.state.validateAmount ||
      !this.state.hasFastWithdraw ||
      !this.state.enableFastWithdraw
    ) {
      return;
    }

    (async () => {
      let smallerThanWithdrawAgents = false;
      let maxTotalAmount = 0;
      let selectedTokenSymbol = this.props.modalManager.withdrawalToken;
      const tokenConf = config.getTokenBySymbol(
        selectedTokenSymbol,
        this.props.exchange.tokens
      );

      try {
        let fastWithdrawLimit = config.fromWEI(
          selectedTokenSymbol,
          tokenConf.fastWithdrawLimit,
          this.props.exchange.tokens
        );
        if (Number(fastWithdrawLimit) < Number(this.state.amount)) {
          maxTotalAmount = Number(fastWithdrawLimit);
          throw 'fastWithdrawLimit';
        }

        let withdrawAgents = await checkWithdrawAgent(tokenConf.tokenId, '0');
        if (withdrawAgents) {
          for (let i = 0; i < withdrawAgents.length; i++) {
            let withdrawAgent = withdrawAgents[i];
            let totalAmount = config.fromWEI(
              selectedTokenSymbol,
              withdrawAgent['totalAmount'],
              this.props.exchange.tokens
            );
            if (Number(totalAmount) > Number(this.state.amount)) {
              smallerThanWithdrawAgents = true;
              break;
            }
            if (Number(totalAmount) > maxTotalAmount) {
              maxTotalAmount = totalAmount;
            }
          }
        }
      } catch (e) {
        console.log('e', e);
      } finally {
        if (smallerThanWithdrawAgents === false) {
          let errorMessage1 = 'Maximum_amount_for_fast_withdrawal_part_1';
          let errorToken = `${maxTotalAmount} ${selectedTokenSymbol}`;
          let errorMessage2 = 'Maximum_amount_for_fast_withdrawal_part_2';
          let validateAmount = false;

          this.setState({
            validateAmount,
            errorMessage1,
            errorToken,
            errorMessage2,
          });
        }
      }
    })();
  }, 500);

  onAmountValueChange = (value) => {
    const selectedTokenSymbol = this.props.modalManager.withdrawalToken;

    // Check validateAmount
    let validateAmount;
    if (Number.isNaN(Number(value)) || Number(value) <= 0) {
      validateAmount = false;
    } else {
      validateAmount = !value || Number(value) <= this.state.availableAmount;
    }

    // Check amount decimal points
    let errorMessage1 = '';
    let errorToken = '';
    let errorMessage2 = '';

    const { tokens } = this.props.exchange;
    const token = config.getTokenBySymbol(selectedTokenSymbol, tokens);

    if (token.symbol && validateAmount && value.split('.').length === 2) {
      var inputPrecision = value.split('.')[1].length;
      if (
        inputPrecision > token.decimals ||
        (parseFloat(value) === 0 && inputPrecision === token.decimals)
      ) {
        errorMessage1 = 'Maximum_amount_input_decimal_part_1';
        errorToken = `${token.decimals}`;
        errorMessage2 = 'Maximum_input_decimal_part_2';
        validateAmount = false;
      }
    }

    this.setState(
      {
        amount: value,
        validateAmount,
        errorMessage1,
        errorToken,
        errorMessage2,
      },
      () => {
        this.checkAgentAmount();
      }
    );
  };

  validateAmount = () => {
    const { amount, availableAmount } = this.state;
    if (
      amount &&
      parseFloat(amount) > 0 &&
      availableAmount >= parseFloat(amount)
    ) {
      return true;
    } else {
      return false;
    }
  };

  submitOffchainWithdrawal_3_6() {
    this.setState({
      loading: true,
    });

    (async () => {
      try {
        let { amount, toAddress } = this.state;

        const { tokens } = this.props.exchange;
        const { dexAccount } = this.props;

        let symbol = this.props.modalManager.withdrawalToken;

        const tokenConf = config.getTokenBySymbol(symbol, tokens);

        const storageId = await getStorageId(
          dexAccount.account.accountId,
          tokenConf.tokenId,
          dexAccount.account.apiKey
        );

        const validUntil =
          Math.ceil(new Date().getTime() / 1000) + 3600 * 24 * 60;

        const amountInBN = config.toWEI(symbol, amount, tokens);
        const amountFInBN = this.getFeeCost(symbol);

        let data = {
          exchange: this.props.exchange.exchangeAddress,
          accountID: dexAccount.account.accountId,
          accountId: dexAccount.account.accountId,
          owner: dexAccount.account.owner,
          from: dexAccount.account.owner,
          to: toAddress,
          extraData: '',
          tokenID: tokenConf.tokenId,
          token: tokenConf.tokenId,
          amount: amountInBN,
          feeTokenID: tokenConf.tokenId,
          feeToken: tokenConf.tokenId,
          maxFeeAmount: amountFInBN,
          validUntil: Math.floor(validUntil),
          storageID: storageId.offchainId,
          storageId: storageId.offchainId,
          // TODO: How to get minGas?
          minGas: 10,
        };

        const { ecdsaSig, eddsaSig } = await window.wallet.signOffchainWithdraw(
          data
        );

        data['eddsaSig'] = eddsaSig;
        data['fastWithdrawalMode'] =
          this.state.hasFastWithdraw && this.state.enableFastWithdraw;

        await submitWithdraw(data, ecdsaSig, dexAccount.account.apiKey);

        notifySuccess(
          <I s="WithdrawInstructionNotification" />,
          this.props.theme,
          15
        );
      } catch (err) {
        notifyError(
          <I s="WithdrawInstructionNotificationFailed" />,
          this.props.theme
        );
        console.log(err);
      } finally {
        this.props.closeModal();
        this.setState({
          loading: false,
        });
      }
    })();
  }

  onClick = () => {
    if (this.validateAmount() === false) {
      this.setState({
        validateAmount: false,
      });
      return;
    } else {
      this.setState({
        validateAmount: true,
      });
    }

    this.submitOffchainWithdrawal_3_6();
  };

  enterAmount = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.onClick();
    }
  };

  withdrawAll = () => {
    this.setState(
      {
        amount: this.state.availableAmount,
        validateAmount: true,
      },
      () => {
        this.checkAgentAmount();
      }
    );
  };

  onToAddressChange = async (e) => {
    const value = e.target.value;
    // Update the search UI
    this.setState({
      addressValue: value,
    });

    // Verify the search input value
    this.onToAddressChangeLoadData(value);
  };

  onToAddressChangeLoadData = debounce((value) => {
    (async () => {
      let address = value;
      // Check ENS
      if (isValidENS(value)) {
        this.setState({
          addressLoading: true,
        });
        try {
          await window.wallet.web3.eth.ens
            .getAddress(value)
            .then(function (addr) {
              console.log(addr);
              address = addr;
            });
        } catch (e) {}
        this.setState({
          addressLoading: false,
        });
      }

      let validateAddress = !!address && isValidAddress(address);
      if (validateAddress) {
        this.setState({
          addressValue: value,
          toAddress: address,
          validateAddress,
          errorAddressMessage: '',
        });
      } else {
        this.setState({
          addressValue: value,
          toAddress: '',
          validateAddress: false,
          errorAddressMessage: 'Invalid recipient address',
        });
      }
    })();
  }, 500);

  render() {
    const theme = this.props.theme;
    const { tokens } = this.props.exchange;
    const selectedTokenSymbol = this.props.modalManager.withdrawalToken;
    const selectedToken = config.getTokenBySymbol(selectedTokenSymbol, tokens);

    const options = tokens
      .filter((a) => a.enabled)
      .map((token, i) => {
        const option = {};
        option.key = token.symbol;
        option.text = token.symbol + ' - ' + token.name;
        if (token.memo) {
          option.text = option.text + '(' + token.memo + ')';
        }

        const menuItem = (
          <AssetDropdownMenuItem
            key={i}
            onClick={() => {
              this.handleCurrencyTypeSelect(token.symbol);
            }}
          >
            <span>
              {token.name.split('-').length - 1 >= 2 ? (
                <div>{token.symbol}</div>
              ) : (
                <div>
                  {token.symbol} - <I s={token.name} />{' '}
                </div>
              )}{' '}
              {token.memo ? '(' : ''} {token.memo ? <I s={token.memo} /> : ''}{' '}
              {token.memo ? ')' : ''}
            </span>
          </AssetDropdownMenuItem>
        );

        return menuItem;
      });

    let withdrawOption;
    if (this.state.hasFastWithdraw) {
      withdrawOption = (
        <div>
          <Group>
            <ul>
              <li>
                <Checkbox
                  style={{
                    marginLeft: '4px',
                    marginTop: '4px',
                    marginBottom: 'auto',
                    textTransform: 'none',
                  }}
                  onChange={this.clickedDisableFastWithdrawal}
                  checked={!this.state.enableFastWithdraw}
                  defaultChecked={!this.state.enableFastWithdraw}
                >
                  <div
                    style={{
                      display: 'inline',
                      userSelect: 'none',
                    }}
                  >
                    <I s="WithdrawInstruction_Fee_1" />
                    {this.state.estimatedBlockTime}
                    <I s="WithdrawInstruction_Fee_2" />
                    {this.getWithdrawFeeCost(selectedTokenSymbol)
                      ? dropTrailingZeroes(
                          config.fromWEI(
                            selectedTokenSymbol,
                            this.getWithdrawFeeCost(selectedTokenSymbol),
                            tokens
                          )
                        )
                      : '-'}{' '}
                    {selectedTokenSymbol.toUpperCase()}
                    {/* <WhyIcon text="FeeWhy" /> */}
                  </div>
                </Checkbox>
              </li>
              <li>
                <Checkbox
                  style={{
                    marginLeft: '4px',
                    marginTop: '8px',
                    marginBottom: 'auto',
                    textTransform: 'none',
                  }}
                  onChange={this.clickedEnableFastWithdrawal}
                  checked={this.state.enableFastWithdraw}
                  defaultChecked={this.state.enableFastWithdraw}
                >
                  {this.state.enableFastWithdraw ? (
                    <div
                      style={{
                        color: this.props.theme.red,
                        fontWeight: '600',
                        display: 'inline',
                        userSelect: 'none',
                      }}
                    >
                      <I s="FastWithdrawInstruction_Fee_1" />{' '}
                      {this.getFastWithdrawFeeCost(selectedTokenSymbol)
                        ? dropTrailingZeroes(
                            config.fromWEI(
                              selectedTokenSymbol,
                              this.getFastWithdrawFeeCost(selectedTokenSymbol),
                              tokens
                            )
                          )
                        : '-'}{' '}
                      {selectedTokenSymbol.toUpperCase()}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'inline',
                        userSelect: 'none',
                      }}
                    >
                      <I s="FastWithdrawInstruction_Fee_1" />
                      {this.getFastWithdrawFeeCost(selectedTokenSymbol)
                        ? dropTrailingZeroes(
                            config.fromWEI(
                              selectedTokenSymbol,
                              this.getFastWithdrawFeeCost(selectedTokenSymbol),
                              tokens
                            )
                          )
                        : '-'}{' '}
                      {selectedTokenSymbol.toUpperCase()}
                    </div>
                  )}
                </Checkbox>
              </li>
            </ul>
          </Group>
        </div>
      );
    } else {
      if (
        this.getFeeCost(selectedTokenSymbol) &&
        Number(
          config.fromWEI(
            selectedTokenSymbol,
            this.getFeeCost(selectedTokenSymbol),
            tokens
          )
        ) > 0
      ) {
        withdrawOption = (
          <ul>
            <li>
              <div
                style={{
                  color: this.props.theme.textWhite,
                  marginBottom: '8px',
                }}
              >
                <I s="WithdrawInstruction_Fee_1" />
                {this.state.estimatedBlockTime}
                <I s="WithdrawInstruction_Fee_2" />
                {this.getFeeCost(selectedTokenSymbol)
                  ? dropTrailingZeroes(
                      config.fromWEI(
                        selectedTokenSymbol,
                        this.getFeeCost(selectedTokenSymbol),
                        tokens
                      )
                    )
                  : '-'}{' '}
                {selectedTokenSymbol.toUpperCase()}
                {/* <WhyIcon text="FeeWhy" /> */}
              </div>
            </li>
          </ul>
        );
      } else {
        // when withdraw is free
        withdrawOption = <div />;
      }
    }

    let indicator;
    if (getWalletType() !== 'MetaMask') {
      indicator = <WalletConnectIndicator />;
    } else {
      indicator = (
        <ModalIndicator
          title={
            getWalletType() === 'MetaMask'
              ? 'metamaskConfirm'
              : 'walletConnectConfirm'
          }
          tips={[
            <div key="1">
              <I
                s={
                  getWalletType() === 'MetaMask'
                    ? 'metaMaskPendingTxTip'
                    : 'walletConnectPendingTxTip'
                }
              />
            </div>,
          ]}
          imageUrl={
            getWalletType() === 'MetaMask'
              ? `/assets/images/${theme.imgDir}/metamask_pending.png`
              : ``
          }
          marginTop="60px"
        />
      );
    }

    let isWalletConnectLoading =
      this.state.loading && getWalletType() !== 'MetaMask';

    return (
      <MyModal
        centered
        width={AppLayout.modalWidth}
        title={
          <TextPopupTitle>
            <I s="Make a Withdrawal" />
          </TextPopupTitle>
        }
        footer={null}
        maskClosable={false}
        closeIcon={<FontAwesomeIcon icon={faTimes} />}
        visible={this.props.isVisible}
        onCancel={() => this.props.closeModal()}
        maxHeight={this.state.loading ? '500px' : 'unset'}
      >
        <Spin spinning={this.state.loading} indicator={indicator}>
          <WalletConnectIndicatorPlaceholder
            isWalletConnectLoading={isWalletConnectLoading}
          />
          <Section
            style={{
              display: isWalletConnectLoading ? 'none' : 'block',
            }}
          >
            <Instruction>
              <I s="WithdrawInstruction_1" />
            </Instruction>
          </Section>
          <Section
            style={{
              display: isWalletConnectLoading ? 'none' : 'block',
            }}
          >
            <Group label={<I s="Asset" />}>
              <AssetDropdown
                options={options}
                selected={
                  <span>
                    {selectedToken.name.split('-').length - 1 >= 2 ? (
                      <div>{selectedToken.symbol}</div>
                    ) : (
                      <div>
                        {selectedToken.symbol} - <I s={selectedToken.name} />{' '}
                      </div>
                    )}{' '}
                    {selectedToken.memo ? '(' : ''}{' '}
                    {selectedToken.memo ? <I s={selectedToken.memo} /> : ''}{' '}
                    {selectedToken.memo ? ')' : ''}
                  </span>
                }
              />
            </Group>
            {withdrawOption}

            <Group label={<I s="Recipient Ethereum Address/ENS Name" />}>
              <SearchStyled
                suffix={<span key="search_suffix" />}
                style={{
                  color: theme.textWhite,
                }}
                value={this.state.addressValue}
                onChange={this.onToAddressChange}
                loading={this.state.addressLoading}
                disabled={this.state.addressLoading}
              />
              {isValidENS(this.state.addressValue) && !!this.state.toAddress && (
                <div
                  style={{
                    paddingTop: '12px',
                  }}
                >
                  {' '}
                  <I s="Ethereum Address" />: {this.state.toAddress}
                </div>
              )}
              <ErrorMessage
                isTransfer={true}
                selectedToken={selectedToken}
                amount={this.state.amount}
                availableAmount={this.state.availableAmount}
                validateAmount={this.state.validateAmount}
                errorMessage1={this.state.errorMessage1}
                errorToken={this.state.errorToken}
                errorMessage2={this.state.errorMessage2}
                validateAddress={this.state.validateAddress}
                errorAddressMessage={this.state.errorAddressMessage}
              />
            </Group>
            <Group label={<I s="Amount" />}>
              <NumericInput
                decimals={selectedToken.precision}
                color={
                  this.state.validateAmount
                    ? theme.textWhite
                    : theme.sellPrimary
                }
                value={
                  this.props.modalManager.withdrawalToken.toUpperCase() ===
                  'TRB'
                    ? this.state.balance
                    : this.state.amount
                }
                onChange={this.onAmountValueChange}
                onClick={this.onAmountValueClick}
                suffix={selectedTokenSymbol.toUpperCase()}
                fontSize="0.9rem"
                onKeyDown={this.enterAmount.bind(this)}
                disabled={
                  this.props.modalManager.withdrawalToken.toUpperCase() ===
                  'TRB'
                }
              />
              <ErrorMessage
                isWithdrawal={true}
                selectedToken={selectedToken}
                amount={this.state.amount}
                availableAmount={this.state.availableAmount}
                ethEnough={true}
                validateAmount={this.state.validateAmount}
                errorMessage1={this.state.errorMessage1}
                errorToken={this.state.errorToken}
                errorMessage2={this.state.errorMessage2}
              />
            </Group>
          </Section>
          <Section
            style={{
              display: isWalletConnectLoading ? 'none' : 'block',
            }}
          >
            <LabelValue
              label={<I s="Layer-2 Balance" />}
              value={this.state.balance}
              unit={selectedTokenSymbol.toUpperCase()}
              onClick={() => this.withdrawAll()}
            />
            <LabelValue
              label={<I s="Available to withdraw" />}
              value={this.state.availableAmount}
              unit={selectedTokenSymbol.toUpperCase()}
            />
          </Section>
          <Section
            style={{
              display: isWalletConnectLoading ? 'none' : 'block',
            }}
          >
            <ActionButton
              disabled={
                this.state.amount <= 0 ||
                !this.state.validateAmount ||
                this.state.loading ||
                !this.state.validateAddress
              }
              onClick={() => this.onClick()}
            >
              <I s="Withdraw" />
            </ActionButton>
          </Section>
        </Spin>
      </MyModal>
    );
  }
}

const mapStateToProps = (state) => {
  const { modalManager, dexAccount, balances, exchange } = state;
  const isVisible = modalManager.isWithdrawModalVisible;
  return {
    isVisible,
    modalManager,
    dexAccount,
    balances,
    exchange,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(showWithdrawModal(false)),
    showModal: (token) => dispatch(showWithdrawModal(true, token)),
    fetchInfo: () => dispatch(fetchInfo()),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(WithdrawModal)
);
