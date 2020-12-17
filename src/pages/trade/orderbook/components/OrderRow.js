import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

const CompactOrderTableRow = styled.tr`
  font-size: 0.85rem;
  color: ${(props) => props.theme.textDim};
  height: 24px;
  font-weight: 600;
  background: ${(props) => props.theme.foreground};
  &:hover {
    cursor: pointer;
    background: ${(props) => props.theme.tableHoverBackground};
  }
  // Hack: background-image doesn't work on safari
  @media not all and (min-resolution:.001dpcm) { @media {
    background-attachment: fixed;
  }}
  background-image: ${(props) => {
    return `linear-gradient(to right, ${props.sizeBarColor}, ${props.sizeBarColor}), linear-gradient(to right, ${props.theme.foreground}, ${props.theme.foreground});`;
  }}
  background-repeat: no-repeat;
  background-position:
        0 0, /* gradient 1 */
        0 0;
  background-size: ${(props) => {
    return `${props.sizeBarWidthStr} 100%, 100% 100%;`;
  }}
`;

const CompactOrderTablePriceColumn = styled.td`
  text-align: left;
  width: 30%;
  padding: 1px 1px 1px 12px;
`;

const CompactOrderTableSizeColumn = styled.td`
  text-align: right;
  width: 35%;
  padding: 1px 12px 1px 8px;
`;

const CompactOrderTablePositionColumn = styled.td`
  text-align: right;
  width: 35%;
  padding: 1px 12px 1px 1px;
`;

const EmptyOrderRow = () => {
  const theme = useContext(ThemeContext);
  return (
    <CompactOrderTableRow style={{ userSelect: 'none' }}>
      <CompactOrderTablePriceColumn
        style={{ color: theme.inputPlaceHolderColor }}
      >
        -
      </CompactOrderTablePriceColumn>
      <CompactOrderTableSizeColumn
        style={{ color: theme.inputPlaceHolderColor }}
      >
        -
      </CompactOrderTableSizeColumn>
      <CompactOrderTablePositionColumn
        style={{ color: theme.inputPlaceHolderColor }}
      >
        -
      </CompactOrderTablePositionColumn>
    </CompactOrderTableRow>
  );
};

const OrderRow = ({
  side,
  size,
  filled,
  sizeBarMaxWidth,
  sizeBarMaxSize,
  sizeBarUnitSize,
  buyPrimary,
  buyBar,
  sellPrimary,
  sellBar,
  onClick,
  order,
  dataConfigs,
  onClickCancel,
  ...props
}) => {
  const totalUnits = sizeBarMaxSize / sizeBarUnitSize;
  const numUnits = Math.floor(size / sizeBarUnitSize);
  const percentSize = numUnits >= totalUnits ? 1 : numUnits / totalUnits;
  const sizeBarWidth = percentSize * 80;
  const sizeBarWidthStr = `${sizeBarWidth}%`;
  const sizeBarColor = side === 'buy' ? buyBar : sellBar;

  return (
    <CompactOrderTableRow
      {...props}
      sizeBarWidthStr={sizeBarWidthStr}
      sizeBarColor={sizeBarColor}
    >
      {dataConfigs.map(({ propName = 'data', format, getter, renderer }, i) => {
        if (propName === 'price') {
          return (
            <CompactOrderTablePriceColumn
              key={i}
              onClick={(e) => {
                e.preventDefault();
                if (onClick) {
                  onClick(order, side, 'price');
                }
              }}
            >
              {renderer({
                side,
                format,
                [propName]: getter(order),
                buyPrimary,
                sellPrimary,
              })}
            </CompactOrderTablePriceColumn>
          );
        } else if (propName === 'size') {
          return (
            <CompactOrderTableSizeColumn
              key={i}
              onClick={(e) => {
                e.preventDefault();
                if (onClick) {
                  onClick(order, side, 'size');
                }
              }}
            >
              {renderer({
                side,
                format,
                [propName]: getter(order),
              })}
            </CompactOrderTableSizeColumn>
          );
        } else if (propName === 'position') {
          return (
            <CompactOrderTablePositionColumn key={i}>
              {renderer({
                side,
                format,
                [propName]: getter(order),
              })}
            </CompactOrderTablePositionColumn>
          );
        } else {
          return <span />;
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

export { OrderRow, EmptyOrderRow };
