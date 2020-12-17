import { ThemeContext } from 'styled-components';
import PrettyPrice from '../../components/PrettyPrice';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';

const Spread = ({
  spread,
  label,
  format,
  buyPrimary,
  sellPrimary,
  ...props
}) => {
  const theme = useContext(ThemeContext);

  return (
    <div
      {...props}
      style={{
        fontSize: '0.85rem',
        fontWeight: '600',
        lineHeight: '30px',
        color: theme.textDim,
        backgroundColor: theme.spreadAggregationBackground,
      }}
    >
      <div
        style={{
          display: 'inline-block',
          marginLeft: '0px',
          width: '30%',
          textAlign: 'left',
          padding: '1px 1px 1px 12px',
          userSelect: 'none',
        }}
      >
        <PrettyPrice
          price={spread}
          format={format}
          buyPrimary={buyPrimary}
          sellPrimary={sellPrimary}
        />
      </div>
      <div
        style={{
          display: 'inline-block',
          width: '35%',
          textAlign: 'right',
          padding: '1px 12px 1px 8px',
          userSelect: 'none',
        }}
      >
        {label}
      </div>
    </div>
  );
};

Spread.propTypes = {
  spread: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  format: PropTypes.string,
};

Spread.defaultProps = {
  spread: 0,
  format: '0.00',
};

export default Spread;
