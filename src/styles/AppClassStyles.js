import { createGlobalStyle } from "styled-components";

const AppClassStyles = createGlobalStyle`
.marketSelection.ant-popover.ant-popover-placement-bottomLeft > .ant-popover-content {
  background: ${(props) => props.theme.popupBackground}!important;
  .ant-popover-inner-content {
    border-radius: 2px;
  }
  > .ant-popover-arrow {
    display:none!important;
  }
}

.asset-panel {
  border: 1px solid ${(props) => props.theme.inputBorderColor};
  border-radius: 4px;

  .header {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

    color: ${(props) => props.theme.textDim};
    font-size: 0.9rem;
    font-weight: 400;
    height: 32px;

    .row {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      background: ${(props) => props.theme.tableHeaderBackground};
      padding: 0px;
      margin: 0px;
      line-height: 32px;
    }

    .columnLeft {
      border-top-left-radius: 4px;
      text-align: left;
      padding-left: 16px;
    }

    .columnRight {
      text-align: right;
      padding-right: 16px;
      border-top-right-radius: 4px;
    }
  }

  .body {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background: ${(props) => props.theme.foreground};
    color: ${(props) => props.theme.textWhite};
    padding: 0px 16px 16px 16px;

    .row {
      padding: 0px;
      margin: 0px;
    }

    .columnLeft {
      text-align: left;
      padding-left: 16px;
    }

    .columnRight {
      text-align: right;
      padding-right: 16px;
    }
  }
}
`;
export default AppClassStyles;
