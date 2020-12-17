import { ThemeContext } from 'styled-components';

import React, { useContext } from 'react';

const PanelHeader = ({ headerText }) => {
  const theme = useContext(ThemeContext);

  return (
    <div
      style={{
        height: '44px',
        lineHeight: '20px',
        paddingTop: '12px',
        paddingBottom: '12px',
        paddingLeft: '0px',
        paddingRight: '0px',
        position: 'relative',
        fontWeight: '600',
        fontSize: '0.9rem',
        userSelect: 'none',
        color: theme.textWhite,
      }}
    >
      {headerText}
    </div>
  );
};

export default PanelHeader;
