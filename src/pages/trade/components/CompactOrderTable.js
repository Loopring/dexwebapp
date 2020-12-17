import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  background: ${(props) => props.theme.foreground};
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 4em;
`;

const HiddenCompactTableHead = styled.div`
  height: 34px;
`;

const CollapseCompactTableHead = styled.thead`
  visibility: collapse;
`;

const CompactOrderTable = ({
  children,
  headerLabels,
  tableHeaderVisibility,
  ...props
}) => (
  <Table {...props}>
    {/* HiddenCompactTableHead is to set column width */}
    {tableHeaderVisibility === 'hidden' ? (
      <HiddenCompactTableHead />
    ) : (
      <CollapseCompactTableHead>
        <tr>
          {headerLabels.map((label, i) => (
            <th key={i} style={{ userSelect: 'none' }}>
              {label}
            </th>
          ))}
        </tr>
      </CollapseCompactTableHead>
    )}
    <tbody>{children}</tbody>
  </Table>
);

CompactOrderTable.propTypes = {
  children: PropTypes.node,
  headerLabels: PropTypes.array,
  tableHeaderVisibility: PropTypes.string,
};

CompactOrderTable.defaultProps = {
  headerLabels: [],
  tableHeaderVisibility: 'hidden',
};

export default CompactOrderTable;
