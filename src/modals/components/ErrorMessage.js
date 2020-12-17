import I from 'components/I';
import React from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';

const ErrorLabel = styled.div`
  font-size: 0.85rem;
  color: ${(props) => props.theme.red};
  height: 24px;
  font-weight: 600;
  padding-top: 12px;
`;

const ErrorMessageIcon = () => (
  <FontAwesomeIcon
    style={{ marginRight: '8px' }}
    size="1x"
    icon={faExclamationTriangle}
  />
);

const EthEnoughDepositErrorMessage = ({ selectedToken }) => (
  <ErrorLabel>
    <ErrorMessageIcon />
    {selectedToken.symbol === 'ETH' ? (
      <I s="Insufficient balance" />
    ) : (
      <I s="Not enough Ether to pay deposit fee and transaction gas." />
    )}
  </ErrorLabel>
);

const EthEnoughWithdrawErrorMessage = () => (
  <ErrorLabel>
    <ErrorMessageIcon />
    <I s="Not enough Ether to pay withdrawal fee and transaction gas." />
  </ErrorLabel>
);

const InsufficientBalanceErrorMessage = () => (
  <ErrorLabel>
    <ErrorMessageIcon />
    <I s="Insufficient balance" />
  </ErrorLabel>
);

const GreatThanZeroDepositErrorMessage = () => (
  <ErrorLabel>
    <ErrorMessageIcon />
    <I s="Your deposit amount must be greater than 0." />
  </ErrorLabel>
);

const GreatThanZeroWithdrawalErrorMessage = () => (
  <ErrorLabel>
    <ErrorMessageIcon />
    <I s="Your withdrawal amount must be greater than 0." />
  </ErrorLabel>
);

const GreatThanZeroTransferErrorMessage = () => (
  <ErrorLabel>
    <ErrorMessageIcon />
    <I s="Your transfer amount must be greater than 0." />
  </ErrorLabel>
);

const PrecisionErrorMessage = ({
  errorMessage1,
  errorToken,
  errorMessage2,
}) => (
  <ErrorLabel>
    <ErrorMessageIcon />
    <I s={errorMessage1} />
    {errorToken}
    <I s={errorMessage2} />
  </ErrorLabel>
);

const AddressErrorMessage = ({ errorMessage }) => (
  <ErrorLabel>
    <ErrorMessageIcon />
    <I s={errorMessage} />
  </ErrorLabel>
);

const ErrorMessage = ({
  isDeposit,
  isTransfer,
  isWithdrawal,
  selectedToken,
  amount,
  availableAmount,
  ethEnough,
  validateAmount,
  errorMessage1,
  errorToken,
  errorMessage2,
  validateAddress = true,
  errorAddressMessage = '',
}) => {
  let content;
  if (!validateAddress && !!errorAddressMessage) {
    content = <AddressErrorMessage errorMessage={errorAddressMessage} />;
  } else if (!ethEnough) {
    if (isDeposit) {
      content = <EthEnoughDepositErrorMessage selectedToken={selectedToken} />;
    } else if (isWithdrawal) {
      content = <EthEnoughWithdrawErrorMessage />;
    }
  } else if (ethEnough && errorMessage1 === '' && !validateAmount) {
    if (parseFloat(amount) > 0) {
      content = <InsufficientBalanceErrorMessage />;
    } else {
      if (isDeposit) {
        content = <GreatThanZeroDepositErrorMessage />;
      } else if (isWithdrawal) {
        content = <GreatThanZeroWithdrawalErrorMessage />;
      } else {
        content = <GreatThanZeroTransferErrorMessage />;
      }
    }
  } else if (errorMessage1 !== '' && !validateAmount) {
    content = (
      <PrecisionErrorMessage
        errorMessage1={errorMessage1}
        errorToken={errorToken}
        errorMessage2={errorMessage2}
      />
    );
  }

  return <div>{content}</div>;
};

export default ErrorMessage;
