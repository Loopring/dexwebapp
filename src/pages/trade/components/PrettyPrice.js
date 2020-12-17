import Numeral from 'numeral';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { countTrailingZeroes } from './defaults/util';

const SidePrimary = styled.span`
  color: ${(props) => {
    return props.side === 'buy' ? props.buyPrimary : props.sellPrimary;
  }};
`;

const SideSecondary = styled.span`
  color: ${(props) => {
    return props.side === 'buy' ? props.buyPrimary : props.sellPrimary;
  }};
`;

const SideBar = styled.span`
  color: ${(props) => {
    return props.side === 'buy' ? props.buyPrimary : props.sellPrimary;
  }};
`;

const NoSidePrimary = styled.span`
  color: ${(props) => props.theme.textWhite};
`;

const NoSideSecondary = styled.span`
  color: ${(props) => props.theme.textDim};
`;

const DotColor = styled.span(
  ({ side, digitsAfterDecimal, price, prePrice, buyPrimary, sellPrimary }) => {
    return {
      color: side === 'buy' ? buyPrimary : sellPrimary,
    };
  }
);

const NoSideDotColor = styled.span(({ theme, side, digitsAfterDecimal }) => {
  return {
    color: theme.textWhite,
  };
});

const PrettyPrice = ({
  price = 0,
  format,
  side,
  prePrice,
  buyPrimary,
  sellPrimary,
}) => {
  let updatedPrice = String(price);
  let updatedPrePrice = prePrice;
  let formattedSize = updatedPrice;

  // Avoid scientific notation
  if (updatedPrice.includes('e-') || updatedPrice.includes('E-')) {
    try {
      const formatLength = format.split('.')[1].length;
      updatedPrice = Number(updatedPrice).toFixed(formatLength);
      formattedSize = updatedPrice;
    } catch (error) {}
  } else if (updatedPrice.includes('e') || updatedPrice.includes('E')) {
    try {
      updatedPrice = Number(updatedPrice).toLocaleString('fullwide', {
        useGrouping: false,
      });
    } catch (error) {}
  } else {
    formattedSize = Numeral(updatedPrice).format(format);
  }

  // count trailing zeroes
  const numTrailingZeroes = countTrailingZeroes(formattedSize);
  // get digit arrays before and after decimal
  const [digitsBeforeDecimal, digitsAfterDecimal] = formattedSize
    .split('.')
    .map((str) => str.split(''));
  // splice trailing zeroes into seperate array
  const trailingZeroes = digitsAfterDecimal.splice(
    digitsAfterDecimal.length - numTrailingZeroes
  );
  // return colorized version of price
  return side ? (
    <span>
      <SideSecondary
        key="dbd"
        side={side}
        price={updatedPrice}
        prePrice={updatedPrePrice}
        buyPrimary={buyPrimary}
        sellPrimary={sellPrimary}
      >
        {digitsBeforeDecimal}
      </SideSecondary>
      <DotColor
        key="dot"
        side={side}
        price={updatedPrice}
        prePrice={updatedPrePrice}
        digitsAfterDecimal={digitsAfterDecimal}
        buyPrimary={buyPrimary}
        sellPrimary={sellPrimary}
      >
        .
      </DotColor>
      <SidePrimary
        key="dad"
        side={side}
        price={updatedPrice}
        prePrice={updatedPrePrice}
        buyPrimary={buyPrimary}
        sellPrimary={sellPrimary}
      >
        {digitsAfterDecimal}
      </SidePrimary>
      <SideBar
        key="tz"
        side={side}
        price={updatedPrice}
        prePrice={updatedPrePrice}
        buyPrimary={buyPrimary}
        sellPrimary={sellPrimary}
      >
        {trailingZeroes}
      </SideBar>
    </span>
  ) : (
    <span>
      <NoSidePrimary key="_dbd" side={side}>
        {digitsBeforeDecimal}
      </NoSidePrimary>
      <NoSideDotColor
        key="dot"
        side={side}
        digitsAfterDecimal={digitsAfterDecimal}
      >
        .
      </NoSideDotColor>
      <NoSidePrimary key="_dad" side={side}>
        {digitsAfterDecimal}
      </NoSidePrimary>
      <NoSideSecondary key="tz" side={side}>
        {trailingZeroes}
      </NoSideSecondary>
    </span>
  );
};

PrettyPrice.propTypes = {
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  format: PropTypes.string,
  side: PropTypes.oneOf(['buy', 'sell']),
};

PrettyPrice.defaultProps = {
  price: 0,
  format: '0.00',
};

export default PrettyPrice;
