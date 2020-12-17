import { ThemeContext } from 'styled-components';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';

const PrettyFilled = ({ filled }) => {
  const theme = useContext(ThemeContext);

  return <span style={{ color: theme.textWhite }}>{filled}</span>;
};

PrettyFilled.propTypes = {
  filled: PropTypes.string,
};

export default PrettyFilled;
