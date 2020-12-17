import { ThemeContext } from 'styled-components';
import I from 'components/I';
import React, { useContext } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';

const TradePanelErrorMessage = ({
  show,
  errorMessage1,
  errorToken,
  errorMessage2,
}) => {
  return (
    <div
      style={{
        display: show ? 'initial' : 'none',
        fontSize: '0.85rem',
        color: useContext(ThemeContext).red,
        height: '24px',
        fontWeight: '600',
      }}
    >
      <FontAwesomeIcon
        style={{ marginRight: '8px' }}
        size="1x"
        icon={faExclamationTriangle}
      />
      <I s={errorMessage1} />
      {errorToken}
      <I s={errorMessage2} />
    </div>
  );
};

export default TradePanelErrorMessage;
