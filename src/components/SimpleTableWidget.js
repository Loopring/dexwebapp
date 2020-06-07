import { ConfigProvider, Table } from "antd";
import EmptyTableIndicator from "components/EmptyTableIndicator";
import I from "components/I";
import React, { useContext } from "react";

import { SimpleTableContainer } from "styles/Styles";
import TableLoadingSpin from "components/TableLoadingSpin";
import styled, { ThemeContext } from "styled-components";

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
  const theme = useContext(ThemeContext);
  const _rowData = rowData || [];
  const customizeRenderEmpty = () => <EmptyTableIndicator text={emptyText} />;

  const columns = columnBuilders.map((builder, j) => ({
    ...builder,
    title: (
      <Header margin={margin}>
        <I s={builder.label} />
      </Header>
    ),
    dataIndex: "col_" + j,
  }));

  const dataSource = _rowData.map((row, i) => {
    var rowValue = { key: i };

    columnBuilders.forEach((builder, j) => {
      rowValue["col_" + j] = (
        <Cell margin={margin}>{builder.getColValue(row)}</Cell>
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
        {/* {dataSource.length > 10 ? (
          <Pagination
            style={{
              padding: '30px 0px',
              background: theme.background,
              textAlign: 'center',
            }}
            size=""
            total={dataSource.length}
            pageSize={10}
          />
        ) : (
          <div />
        )} */}
      </ConfigProvider>
    </SimpleTableContainer>
  );
};

export default SimpleTableWidget;
