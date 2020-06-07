import { createGlobalStyle } from "styled-components";

const AntdTableStyles = createGlobalStyle`
.ant-table {
  background: ${(props) => props.theme.foreground}!important;

  tbody > tr > td {
    color: ${(props) => props.theme.textWhite};
  }

  tbody > tr.ant-table-row:hover > td {
    background:${(props) => props.theme.tableHoverBackground}!important;
    color: ${(props) => props.theme.textBright};
  }

  tbody > tr.ant-table-placeholder:hover > td {
    background: transparent;
  }

  tbody > tr > td {
    border-bottom-style: none;
    padding: 0px;
    height: 34px;
  }

  thead > tr {
    height: 32px! important;
    background: ${(props) => props.theme.tableHeaderBackground};
  }

  thead > tr > th {
    margin: 0;
    padding: 0px;
    border: none;
    color: ${(props) => props.theme.textDim};
    background: transparent;
  }
}

.ant-table.ant-table-middle .ant-table-thead > tr > th {
  padding: 0px;
}

.ant-table.ant-table-middle .ant-table-tbody > tr > td {
  padding: 1px 0px;
  height: 24px;
}

.ant-spin-container {
  transation: 0;
}

.ant-spin-container::after {
  background: transparent;
}

.ant-table-placeholder {
  border-style: none;
  user-select: none;
  background: transparent!important;

  .ant-empty-normal {
    margin: 64px 0px;
  }
}

.ant-empty-description {
  color:${(props) => props.theme.textDim};
}
`;
export default AntdTableStyles;
