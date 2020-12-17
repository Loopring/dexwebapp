import Numeral from 'numeral';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { countTrailingZeroes } from './defaults/util';

const LowContrast = styled.span`
  color: ${(props) => props.theme.textDim};
`;

const MedContrast = styled.span`
  color: ${(props) => props.theme.textWhite};
`;

const HighContrast = styled.span`
  color: ${(props) => props.theme.textWhite};
`;

const DotColor = styled.span`
  color: ${(props) =>
    props.digitsAfterDecimal.length === 0
      ? props.theme.textDim
      : props.theme.textWhite};
`;

const PrettySize = ({ size = 0, format, side }) => {
  const formattedSize = Numeral(size).format(format);
  if (size === 0) return <LowContrast>{formattedSize}</LowContrast>;
  // count trailing zeroes
  const numTrailingZeroes = countTrailingZeroes(formattedSize);
  // get digit arrays before and after decimal
  const [digitsBeforeDecimal, digitsAfterDecimal = []] = formattedSize
    .split('.')
    .map((str) => str.split(''));
  // splice trailing zeroes into seperate array
  const trailingZeroes = digitsAfterDecimal.splice(
    digitsAfterDecimal.length - numTrailingZeroes
  );
  // return colorized version of size
  return [
    <MedContrast key="dbd">{digitsBeforeDecimal}</MedContrast>,
    <DotColor key="dot" side={side} digitsAfterDecimal={digitsAfterDecimal}>
      .
    </DotColor>,
    <HighContrast key="dad">{digitsAfterDecimal}</HighContrast>,
    <LowContrast key="tz">{trailingZeroes}</LowContrast>,
  ];
};

PrettySize.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  format: PropTypes.string,
  side: PropTypes.oneOf(['buy', 'sell']),
};

export default PrettySize;
