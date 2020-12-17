import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const ThinLowContrast = styled.span`
  color: ${(props) => props.theme.textWhite};
  width: 10px;
`;

const PrettySide = ({ side }) => {
  return <ThinLowContrast>{side === 'buy' ? 'Buy' : 'Sell'}</ThinLowContrast>;
};

PrettySide.propTypes = {
  side: PropTypes.oneOf(['buy', 'sell']),
};

export default PrettySide;
