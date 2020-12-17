import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const CompactOrderTableRow = styled.tr`
  font-size: 0.85rem;
  height: 24px;
  font-weight: 600;
  background: ${(props) => props.theme.foreground};
  &:hover {
    cursor: pointer;
    background: ${(props) => props.theme.tableHoverBackground};
  }
`;

const CommonTableCell = styled.td`
  text-align: right;
  font-size: 0.85rem;
  background: transparent;
`;

const CompactOrderTableSize = styled(CommonTableCell)`
  padding: 1px 10px 1px 1px;
  width: 35%;
`;

const CompactOrderTablePrice = styled(CommonTableCell)`
  padding: 1px 5px 1px 8px;
  width: 30%;
`;

const CompactOrderTableDate = styled(CommonTableCell)`
  padding: 1px 13px 1px 1px;
  width: 33%;
`;

const OrderRow = ({
  side,
  size,
  onClick,
  preOrder,
  order,
  dataConfigs,
  buyPrimary,
  sellPrimary,
  ...props
}) => {
  return (
    <CompactOrderTableRow
      {...props}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick(order, side);
        }
      }}
    >
      {dataConfigs.map(({ propName = 'data', format, getter, renderer }, i) => {
        if (propName === 'size') {
          return (
            <CompactOrderTableSize key={i}>
              {renderer({
                side,
                format,
                [propName]: getter(order),
              })}
            </CompactOrderTableSize>
          );
        } else if (propName === 'price') {
          const prePrice = preOrder ? getter(preOrder) : 0;
          return (
            <CompactOrderTablePrice key={i}>
              {renderer({
                side,
                format,
                [propName]: getter(order),
                prePrice,
                buyPrimary,
                sellPrimary,
              })}
            </CompactOrderTablePrice>
          );
        } else {
          return (
            <CompactOrderTableDate key={i}>
              {renderer({
                side,
                format,
                [propName]: getter(order),
              })}
            </CompactOrderTableDate>
          );
        }
      })}
    </CompactOrderTableRow>
  );
};

OrderRow.propTypes = {
  side: PropTypes.oneOf(['buy', 'sell']),
  dataConfigs: PropTypes.arrayOf(PropTypes.object),
};

OrderRow.defaultProps = {
  side: 'buy',
  dataConfigs: [],
};

export default OrderRow;
