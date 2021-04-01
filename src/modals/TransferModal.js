import { ActionButton, AssetDropdownMenuItem } from 'styles/Styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Instruction,
  MyModal,
  Section,
  TextPopupTitle,
} from 'modals/styles/Styles';

import { Col, Input, Row, Spin } from 'antd';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';

import { dropTrailingZeroes } from 'pages/trade/components/defaults/util';
import { formatter } from 'lightcone/common';
import { getStorageId, lightconeGetAccount } from 'lightcone/api/LightconeAPI';
import { getWalletType } from 'lightcone/api/localStorgeAPI';
import { isValidAddress } from 'ethereumjs-util';
import { isValidENS } from '../lightcone/common/utils';
import { notifyError, notifySuccess } from 'redux/actions/Notification';
import { showTransferModal } from 'redux/actions/ModalManager';
import { withUserPreferences } from 'components/UserPreferenceContext';
import AppLayout from 'AppLayout';
import AssetDropdown from 'modals/components/AssetDropdown';
import ErrorMessage from 'modals/components/ErrorMessage';
import Group from 'modals/components/Group';
import I from 'components/I';
import LabelValue from 'modals/components/LabelValue';
import ModalIndicator from 'modals/components/ModalIndicator';
import NumericInput from 'components/NumericInput';
import React from 'react';
import WalletConnectIndicator from 'modals/components/WalletConnectIndicator';
import WalletConnectIndicatorPlaceholder from 'modals/components/WalletConnectIndicatorPlaceholder';
import styled, { withTheme } from 'styled-components';

import { fetchInfo } from 'redux/actions/ExchangeInfo';
import config from 'lightcone/config';

import './TransferModal.less';

import { fetchTransfers } from 'redux/actions/MyAccountPage';
import { submitTransfer } from 'lightcone/api/v1/transfer';

import { CopyToClipboard } from 'react-copy-to-clipboard';

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

class TransferModal extends React.Component {
  state = {
    loading: false,
    amount: null,
    amountF: null,
    addressValue: '',
    addressLoading: false,
    toAddress: '',
    receiver: null,
    validateAddress: true,
    nonce: -1,
    validateAmount: true,
    availableAmount: 0,
    balance: 0,
    errorMessage1: '',
    errorToken: '',
    errorMessage2: '',
    errorAddressMessage: '',
    memo: '',
    isTransferToOpenNewAccount: false,
    amountOpenAccountFee: null,
  };

  componentDidUpdate(prevProps, prevState) {
    // When the modal becomes visible
    if (
      (this.props.isVisible !== prevProps.isVisible ||
        this.props.dexAccount.account.address !==
          prevProps.dexAccount.account.address) &&
      this.props.isVisible &&
      window.wallet
    ) {
      const selectedTokenSymbol = this.props.modalManager.transferToken;
      this.loadData(selectedTokenSymbol);
      (async () => {
        this.props.fetchInfo();
      })();
    }

    if (
      this.props.isVisible === false &&
      this.props.isVisible !== prevProps.isVisible
    ) {
      this.setState({
        loading: false,
        configLoading: false,
        amount: null,
        amountF: null,
        toAddress: '',
        receiver: null,
        addressValue: '',
        addressLoading: false,
        validateAddress: true,
        nonce: -1,
        validateAmount: true,
        availableAmount: 0,
        errorMessage1: '',
        errorToken: '',
        errorMessage2: '',
        errorAddressMessage: '',
        memo: '',
        isTransferToOpenNewAccount: false,
      });
    }
  }

  handleCurrencyTypeSelect = (tokenSymbol) => {
    this.props.showTransferModal(tokenSymbol);
    this.loadData(tokenSymbol);

    // Reset amount and error message
    this.setState({
      amount: null,
      amountF: null,
      validateAmount: true,
    });
  };

  handleSelectedFeeToken = (token) => {
    this.setState({
      feeToken: token,
    });
  };

  loadData(tokenSymbol) {
    (async () => {
      try {
        this.setState({ configLoading: true });
        const { balances } = this.props.balances;
        const tokenBalance = this.getAvailableAmount(tokenSymbol, balances);
        console.log('token symbol ', tokenSymbol);
        const amountF = config.feeFromWei(
          tokenSymbol,
          this.getFee(tokenSymbol),
          this.props.exchange.tokens
        );

        const amountOpenAccountFee = config.fromWEI(
          tokenSymbol,
          this.getOpenAccountFee(tokenSymbol),
          this.props.exchange.tokens
        );

        let validateAmount = !this.state.amount;
        if (!validateAmount) {
          if (this.state.isTransferToOpenNewAccount) {
            validateAmount =
              Number(this.state.amount) +
                Number(amountF) +
                Number(amountOpenAccountFee) <=
              Number(tokenBalance);
          } else {
            validateAmount =
              Number(this.state.amount) + Number(amountF) <=
              Number(tokenBalance);
          }
        }

        const { accountNonce } = await lightconeGetAccount(
          window.wallet.address
        );

        this.setState({
          availableAmount: tokenBalance,
          balance: this.getBalance(tokenSymbol, balances),
          validateAmount,
          amountF,
          nonce: accountNonce,
          configLoading: false,
          amountOpenAccountFee,
        });
      } catch (error) {
        this.setState({ configLoading: false });
      }
    })();
  }

  getFee = (tokenSymbol) => {
    const { transferFees } = this.props.exchange;
    if (transferFees) {
      const feeConfig = config.getFeeByToken(tokenSymbol, transferFees);
      return feeConfig ? feeConfig.fee : '0';
    } else return '0';
  };

  getOpenAccountFee = (tokenSymbol) => {
    const { openAccountFees } = this.props.exchange;
    if (openAccountFees) {
      const feeConfig = config.getFeeByToken(tokenSymbol, openAccountFees);
      return feeConfig ? feeConfig.fee : '0';
    } else return '0';
  };

  getAvailableAmount = (symbol, balances) => {
    const tokens = this.props.exchange.tokens;
    const selectedToken = config.getTokenBySymbol(symbol, tokens);
    const holdBalance = balances.find(
      (ba) => ba.tokenId === selectedToken.tokenId
    );

    let avaliableBalance = formatter.toBig(0);
    if (this.state.isTransferToOpenNewAccount) {
      avaliableBalance = holdBalance
        ? formatter
            .toBig(holdBalance.totalAmount)
            .minus(holdBalance.frozenAmount)
            .minus(this.getFee(symbol))
            .minus(this.getOpenAccountFee(symbol))
        : formatter.toBig(0);
    } else {
      avaliableBalance = holdBalance
        ? formatter
            .toBig(holdBalance.totalAmount)
            .minus(holdBalance.frozenAmount)
            .minus(this.getFee(symbol))
        : formatter.toBig(0);
    }

    return config.fromWEI(
      selectedToken.symbol,
      avaliableBalance.isPositive() ? avaliableBalance : 0,
      tokens
    );
  };

  getBalance = (symbol, balances) => {
    const tokens = this.props.exchange.tokens;
    const selectedToken = config.getTokenBySymbol(symbol, tokens);
    const holdBalance = balances.find(
      (ba) => ba.tokenId === selectedToken.tokenId
    );
    return holdBalance
      ? config.fromWEI(
          selectedToken.symbol,
          formatter.toBig(holdBalance.totalAmount),
          tokens
        )
      : config.fromWEI(selectedToken.symbol, 0, tokens);
  };

  onAmountValueChange = (value) => {
    const selectedTokenSymbol = this.props.modalManager.transferToken;
    // Check validateAmount
    let validateAmount;
    if (Number.isNaN(Number(value)) || Number(value) <= 0) {
      validateAmount = false;
    } else {
      validateAmount = !value;
      if (!validateAmount) {
        validateAmount =
          Number(value) + Number(this.state.amountF) <=
          this.state.availableAmount;
      }
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

    this.setState({
      amount: value,
      validateAmount,
      errorMessage1,
      errorToken,
      errorMessage2,
    });
  };

  validateAmount = () => {
    const { amount, availableAmount } = this.state;
    if (
      amount &&
      parseFloat(amount) > 0 &&
      parseFloat(amount) <= availableAmount
    ) {
      return true;
    } else {
      return false;
    }
  };

  test_3_6 = () => {
    this.setState({
      loading: true,
    });

    let {
      amount,
      amountF,
      toAddress,
      nonce,
      receiver,
      memo,
      amountOpenAccountFee,
    } = this.state;
    const { tokens } = this.props.exchange;
    // Transfer
    let symbol = this.props.modalManager.transferToken;

    // Need to use Share to generate link if there is an update.
    const twitterLink = `https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Flocalhost%3A3001%2Faccount%2Ftransfers&ref_src=twsrc%5Etfw&text=I%20just%20made%20a%20layer-2%20transfer%20on%20Ethereum%20using%20the%20newly%20launched%20Loopring%20Pay.%20It%20was%20instant%2C%20free%2C%20and%20completely%20self-custodial%20thanks%20to%20Loopring%27s%20zkRollup.%20%23EthereumScalesToday%20%23LoopringPay%20Get%20in%20the%20fast%20lane%20at%20https%3A%2F%2Floopring.io&tw_p=tweetbutton`;

    const { dexAccount } = this.props;

    (async () => {
      try {
        if (nonce === -1) {
          const { accountNonce } = await lightconeGetAccount(
            window.wallet.address
          );

          nonce = accountNonce;
        }

        const tokenConf = config.getTokenBySymbol(symbol, tokens);

        const storageId = await getStorageId(
          dexAccount.account.accountId,
          tokenConf.tokenId,
          dexAccount.account.apiKey
        );

        const validUntil =
          Math.ceil(new Date().getTime() / 1000) + 3600 * 24 * 60;

        const amountInBN = config.toWEI(tokenConf.symbol, amount, tokens);
        let amountFInBN = config.toWEI(tokenConf.symbol, amountF, tokens);
        if (this.state.isTransferToOpenNewAccount) {
          amountFInBN = formatter
            .toBig(amountFInBN)
            .plus(this.getOpenAccountFee(tokenConf.symbol))
            .toString();
        }

        let data = {
          exchange: this.props.exchange.exchangeAddress,
          from: dexAccount.account.owner,
          to: toAddress,
          tokenID: tokenConf.tokenId,
          token: tokenConf.tokenId,
          amount: amountInBN,
          feeTokenID: tokenConf.tokenId,
          feeToken: tokenConf.tokenId,
          maxFeeAmount: amountFInBN,
          validUntil: Math.floor(validUntil),
          storageID: storageId.offchainId,
          storageId: storageId.offchainId,
          memo: memo,
        };

        data['security'] = 4;
        data['payerId'] = dexAccount.account.accountId;
        data['payerAddr'] = dexAccount.account.owner;
        data['payeeId'] = 0; // 后端支持把payeeId设置成0，只赋值payeeAddr即可，且在开户的时候payeeId必须为0
        data['payeeAddr'] = toAddress;

        const { ecdsaSig, eddsaSig } = await window.wallet.signTransfer(data);
        data['eddsaSig'] = eddsaSig;
        // data['ecdsaSig'] = ecdsaSig + '02';

        console.log('data', data);

        await submitTransfer(
          data,
          ecdsaSig,
          this.props.dexAccount.account.apiKey
        );

        let message;
        if (this.props.userPreferences.language === 'zh') {
          message = <I s="TransferInstructionNotification" />;
        } else {
          message = (
            <div>
              <div>
                <I s="TransferInstructionNotification" />
              </div>

              <Row
                style={{
                  marginTop: '3px',
                }}
                gutter={6}
              >
                <Col>
                  <I s="Share on" />
                </Col>
                <Col>
                  <a
                    className="btn-twitter"
                    onClick={() => {
                      window.open(
                        twitterLink,
                        'newwindow',
                        'width=720,height=480'
                      );
                    }}
                  >
                    <FontAwesomeIcon
                      style={{
                        paddingTop: '1px',
                      }}
                      icon={faTwitter}
                    />{' '}
                    Twitter
                  </a>
                </Col>
              </Row>
            </div>
          );
        }

        notifySuccess(message, this.props.theme, 20);
      } catch (err) {
        console.error('transfer failed', err);
        notifyError(
          <I s="TransferInstructionNotificationFailed" />,
          this.props.theme
        );
      } finally {
        this.getTransferHistory();
        this.props.closeModal();
        const { accountNonce } = await lightconeGetAccount(
          window.wallet.address
        );
        this.setState({
          loading: false,
          amount: null,
          nonce: accountNonce,
        });
      }
    })();
  };

  onClose = () => {
    this.props.closeModal();
  };

  getTransferHistory = () => {
    const { dexAccount, exchange, balances, fetchTransfers } = this.props;

    let tokenSymbol;
    if (balances.tokenFilter !== 'All') {
      tokenSymbol = balances.tokenFilter;
    }
    fetchTransfers(
      balances.transferLimit,
      balances.transferOffset,
      dexAccount.account.accountId,
      tokenSymbol,
      dexAccount.account.apiKey,
      exchange.tokens
    );
  };

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

    this.test_3_6();
  };

  enterAmount = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.onClick();
    }
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
        try {
          const receiver = (await lightconeGetAccount(address)).accountId;
          if (receiver !== window.wallet.accountId) {
            this.setState({
              addressValue: value,
              toAddress: address,
              receiver,
              validateAddress,
              errorAddressMessage: '',
              isTransferToOpenNewAccount: false,
            });
          } else {
            this.setState({
              addressValue: value,
              toAddress: address,
              receiver,
              validateAddress: false,
              errorAddressMessage: 'Sender and receiver are the same',
              isTransferToOpenNewAccount: false,
            });
          }
        } catch (err) {
          this.setState({
            addressValue: value,
            toAddress: address,
            validateAddress: true,
            errorAddressMessage: '',
            isTransferToOpenNewAccount: true,
          });
        }
      } else {
        this.setState({
          addressValue: value,
          toAddress: '',
          validateAddress: false,
          errorAddressMessage: 'Invalid recipient address',
          isTransferToOpenNewAccount: false,
        });
      }
      this.loadData(this.props.modalManager.transferToken);
    })();
  }, 500);

  transferAll = () => {
    const { availableAmount } = this.state;
    // availableAmount has included transfer fee.
    const amount = parseFloat(availableAmount);

    this.setState({
      amount: Math.max(0, amount),
      validateAmount: amount > 0,
      errorMessage1: '',
      errorToken: '',
      errorMessage2: '',
    });
  };

  onMemoChange = (e) => {
    if (e.target.value.length <= 128) {
      this.setState({
        memo: e.target.value,
      });
    }
  };

  clickedCopyReferralLink = () => {
    notifySuccess(<I s="CopyReferralLink" />, this.props.theme);
  };

  render() {
    const theme = this.props.theme;

    const { availableAmount, balance } = this.state;
    const { balances } = this.props.balances;
    const { tokens } = this.props.exchange;

    const selectedTokenSymbol = this.props.modalManager.transferToken;
    const selectedToken = config.getTokenBySymbol(selectedTokenSymbol, tokens);
    let isLpToken = selectedToken.name.split('-').length - 1 >= 2;

    const options = tokens
      .filter(
        (token) =>
          token.transferEnabled &&
          balances.find((ba) => ba.tokenId === token.tokenId)
      )
      .map((token, i) => {
        const option = {};
        option.key = token.symbol;
        option.text = token.symbol + ' - ' + token.name;

        const menuItem = (
          <AssetDropdownMenuItem
            key={i}
            onClick={() => {
              this.handleCurrencyTypeSelect(token.symbol);
            }}
          >
            <span>
              {isLpToken ? (
                <div>{token.symbol}</div>
              ) : (
                <div>
                  {token.symbol} - <I s={token.name} />{' '}
                </div>
              )}
            </span>
          </AssetDropdownMenuItem>
        );

        return menuItem;
      });

    const tipIcons = [];
    const tips = [];
    tipIcons.push(
      <div key="0">
        <FontAwesomeIcon
          icon={faClock}
          style={{
            visibility: 'hidden',
          }}
        />
      </div>
    );
    tips.push(
      <I
        s={
          getWalletType() === 'MetaMask'
            ? 'metaMaskPendingTxTip'
            : 'walletConnectPendingTxTip'
        }
      />
    );

    let indicator;
    if (tips.length === 1 && getWalletType() !== 'MetaMask') {
      indicator = <WalletConnectIndicator />;
    } else {
      indicator = (
        <ModalIndicator
          title={
            getWalletType() === 'MetaMask'
              ? 'metamaskConfirm'
              : 'walletConnectConfirm'
          }
          tipIcons={tipIcons}
          tips={tips}
          imageUrl={
            getWalletType() === 'MetaMask'
              ? `/assets/images/${theme.imgDir}/metamask_pending.png`
              : ``
          }
          marginTop="80px"
        />
      );
    }

    let isWalletConnectLoading =
      this.state.loading && tips.length === 1 && getWalletType() !== 'MetaMask';

    let referralLink;
    if (
      this.props.dexAccount.account &&
      this.props.dexAccount.account.accountId
    ) {
      referralLink = `${window.location.host}/invite/${this.props.dexAccount.account.accountId}`;
    } else {
      referralLink = '';
    }

    return (
      <MyModal
        centered
        width={AppLayout.modalWidth}
        title={
          <TextPopupTitle>
            <I s="Make a Fast Transfer" />
          </TextPopupTitle>
        }
        footer={null}
        maskClosable={false}
        closeIcon={<FontAwesomeIcon icon={faTimes} />}
        visible={this.props.isVisible}
        onCancel={() => this.onClose()}
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
              <I s="TransferInstruction_1" />
            </Instruction>

            {isLpToken ? (
              <Instruction style={{ color: theme.red }}>
                <I s="TransferInstruction_lptoken" />
              </Instruction>
            ) : (
              <div />
            )}

            <Instruction>
              <I s="TransferInstruction_2" />{' '}
              <CopyToClipboard text={referralLink}>
                <a
                  onClick={() => {
                    notifySuccess(<I s="CopyReferralLink" />, this.props.theme);
                  }}
                >
                  {referralLink}
                </a>
              </CopyToClipboard>
              <I s="TransferInstruction_2_end" />
            </Instruction>

            <ul>
              {this.state.configLoading ||
              (!!this.state.amountF && Number(this.state.amountF) !== 0) ? (
                <li>
                  <I s="TransferInstruction_Fee_1" />{' '}
                  {this.state.amountF
                    ? dropTrailingZeroes(this.state.amountF)
                    : '-'}{' '}
                  {selectedTokenSymbol}
                  <I s="TransferInstruction_Fee_2" />
                </li>
              ) : (
                <li>
                  <I s="TransferInstruction_Fee_3" />
                </li>
              )}
            </ul>
          </Section>
          <Section></Section>

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
                    {isLpToken ? (
                      <div>{selectedToken.symbol}</div>
                    ) : (
                      <div>
                        {selectedToken.symbol} - <I s={selectedToken.name} />{' '}
                      </div>
                    )}
                  </span>
                }
              />
            </Group>
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
                availableAmount={availableAmount}
                validateAmount={this.state.validateAmount}
                errorMessage1={this.state.errorMessage1}
                errorToken={this.state.errorToken}
                errorMessage2={this.state.errorMessage2}
                validateAddress={this.state.validateAddress}
                errorAddressMessage={this.state.errorAddressMessage}
              />
              {this.state.isTransferToOpenNewAccount && (
                <div
                  style={{
                    paddingTop: '12px',
                    color: theme.red,
                    fontWeight: '600',
                  }}
                >
                  {' '}
                  <I s="TransferToOpenAccountInstruction_OpenAccount" />
                  {!!this.state.amountOpenAccountFee &&
                  Number(this.state.amountOpenAccountFee) !== 0 ? (
                    <li>
                      <I s="TransferToOpenAccountInstruction_Fee_1" />{' '}
                      {this.state.amountOpenAccountFee
                        ? dropTrailingZeroes(this.state.amountOpenAccountFee)
                        : '-'}{' '}
                      {selectedTokenSymbol}
                      <I s="TransferToOpenAccountInstruction_Fee_2" />
                    </li>
                  ) : (
                    <li>
                      <I s="TransferToOpenAccountInstruction_Fee_3" />
                    </li>
                  )}
                </div>
              )}
            </Group>
            <Group label={<I s="Amount" />}>
              <NumericInput
                decimals={selectedToken.precision}
                color={
                  this.state.validateAmount
                    ? theme.textWhite
                    : theme.sellPrimary
                }
                value={this.state.amount}
                onChange={this.onAmountValueChange}
                onClick={this.onAmountValueClick}
                suffix={selectedTokenSymbol.toUpperCase()}
                onKeyDown={this.enterAmount.bind(this)}
              />
              <ErrorMessage
                isTransfer={true}
                selectedToken={selectedToken}
                ethEnough={true}
                amount={this.state.amount}
                availableAmount={availableAmount}
                validateAmount={this.state.validateAmount}
                errorMessage1={this.state.errorMessage1}
                errorToken={this.state.errorToken}
                errorMessage2={this.state.errorMessage2}
              />
            </Group>
            <Group label={<I s="Memo" />}>
              <SearchStyled
                color={theme.textWhite}
                value={this.state.memo}
                onChange={this.onMemoChange}
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
              value={balance}
              unit={selectedTokenSymbol.toUpperCase()}
            />
            <LabelValue
              label={<I s="Available to transfer" />}
              value={availableAmount}
              unit={selectedTokenSymbol.toUpperCase()}
              onClick={() => this.transferAll()}
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
                !this.state.validateAddress ||
                !this.state.addressValue
              }
              onClick={() => this.onClick()}
            >
              <I s="Transfer" />
            </ActionButton>
          </Section>
        </Spin>
      </MyModal>
    );
  }
}

const mapStateToProps = (state) => {
  const { modalManager, dexAccount, balances, exchange } = state;

  const isVisible = modalManager.isTransferModalVisible;
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
    closeModal: () => dispatch(showTransferModal(false, '')),
    showTransferModal: (token) => dispatch(showTransferModal(true, token)),
    fetchTransfers: (limit, offset, accountId, tokenSymbol, apiKey, tokens) =>
      dispatch(
        fetchTransfers(limit, offset, accountId, tokenSymbol, apiKey, tokens)
      ),
    fetchInfo: () => dispatch(fetchInfo()),
  };
};

export default withUserPreferences(
  withTheme(connect(mapStateToProps, mapDispatchToProps)(TransferModal))
);
