import Moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ThinLowContrast = styled.span`
  color: ${(props) => props.theme.textDim};
`;

const PrettyTimeStamp = ({ timestamp, format }) => {
  return (
    <ThinLowContrast>
      {format ? Moment(timestamp).format(format) : timestamp}
    </ThinLowContrast>
  );
};

PrettyTimeStamp.propTypes = {
  timestamp: PropTypes.number,
  format: PropTypes.string,
};

export default PrettyTimeStamp;
