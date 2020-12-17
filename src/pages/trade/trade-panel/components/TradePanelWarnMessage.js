import { ThemeContext } from 'styled-components';
import I from 'components/I';
import React, { useContext } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';

const TradePanelWarnMessage = ({ show, message }) => {
  return (
    <div
      style={{
        display: show ? 'initial' : 'none',
        fontSize: '0.85rem',
        color: useContext(ThemeContext).orange,
        height: '24px',
        fontWeight: '600',
      }}
    >
      <FontAwesomeIcon
        style={{ marginRight: '8px' }}
        size="1x"
        icon={faExclamationTriangle}
      />
      <I s={message} />
    </div>
  );
};

export default TradePanelWarnMessage;
