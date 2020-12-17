import { ThemeContext } from 'styled-components';
import React, { useContext } from 'react';

const SwapPoolPricesAndPoolShareItem = ({ topLabel, bottomLabel }) => {
  const theme = useContext(ThemeContext);

  return (
    <div>
      <div
        style={{
          textAlign: 'center',
        }}
      >
        {topLabel}
      </div>
      <div
        style={{
          textAlign: 'center',
          color: theme.textDim2,
        }}
      >
        {bottomLabel}
      </div>
    </div>
  );
};

export default SwapPoolPricesAndPoolShareItem;
