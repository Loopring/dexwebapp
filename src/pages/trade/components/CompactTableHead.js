import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const FullWidthTable = styled.table`
  width: 100%;
  z-index: 1;
  font-size: 0.9rem;
  font-weight: normal;
  color: ${(props) => props.theme.textDim};
  height: 32px;
  user-select: none;
  background: ${(props) => props.theme.tableHeaderBackground};
`;

const CompactTableHead = ({ children, ...props }) => (
  <FullWidthTable {...props}>
    <thead>
      <tr
        style={{
          fontSize: "0.8rem",
          textTransform: "uppercase",
        }}
      >
        {children}
      </tr>
    </thead>
  </FullWidthTable>
);

CompactTableHead.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CompactTableHead;
