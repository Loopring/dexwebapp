import { ConfigProvider, Table } from 'antd';
import EmptyTableIndicator from 'components/EmptyTableIndicator';
import I from 'components/I';
import React from 'react';

import { SimpleTableContainer } from 'styles/Styles';
import TableLoadingSpin from 'components/TableLoadingSpin';
import styled from 'styled-components';

const Cell = styled.div`
  font-size: 0.9rem;
  margin-right: ${(props) => props.margin || 4}px;
  margin-left: ${(props) => props.margin || 4}px;
  white-space: nowrap;
`;

const Header = styled(Cell)`
  font-weight: 400;
  user-select: none;
  text-transform: uppercase;
  font-size: 0.8rem;
  color: ${(props) => props.theme.textDim};
`;

const SimpleTableWidget = ({
  columnBuilders,
  rowData,
  emptyText,
  margin,
  loading,
}) => {
  const _rowData = rowData || [];
  const customizeRenderEmpty = () => <EmptyTableIndicator text={emptyText} />;

  const columns = columnBuilders.map((builder, j) => ({
    ...builder,
    title: (
      <Header margin={margin}>
        <I s={builder.label} />
      </Header>
    ),
    dataIndex: 'col_' + j,
  }));

  const dataSource = _rowData.map((row, i) => {
    var rowValue = { key: i };

    columnBuilders.forEach((builder, j) => {
      rowValue['col_' + j] = (
        <Cell margin={margin} sortedValue={builder.sortedValue(row)}>
          {builder.getColValue(row)}
        </Cell>
      );
    });

    return rowValue;
  });

  return (
    <SimpleTableContainer>
      <ConfigProvider
        renderEmpty={dataSource.length === 0 && customizeRenderEmpty}
      >
        <TableLoadingSpin loading={loading}>
          <Table
            tableLayout="auto"
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
        </TableLoadingSpin>
      </ConfigProvider>
    </SimpleTableContainer>
  );
};

export default SimpleTableWidget;
