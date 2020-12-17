import { ActionButton } from 'styles/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeContext } from 'styled-components';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import I from 'components/I';
import React, { useContext } from 'react';

const SwapRegisteringButton = () => {
  const theme = useContext(ThemeContext);
  return (
    <ActionButton
      color={theme.textWhite}
      style={{
        cursor: 'default',
        backgroundColor: theme.sidePanelBackground,
      }}
    >
      <FontAwesomeIcon
        style={{
          width: '14px',
          height: '14px',
          marginRight: '8px',
        }}
        icon={faCircleNotch}
        spin={true}
      />
      <span>
        <I s="Registering Account..." />
      </span>
    </ActionButton>
  );
};

export default SwapRegisteringButton;
