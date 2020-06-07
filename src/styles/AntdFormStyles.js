import { createGlobalStyle } from "styled-components";

const AntdFormStyles = createGlobalStyle`

input.ant-input {
  background-color: transparent;
  color: ${(props) => props.theme.textWhite} !important;
  border: none;
  height: 40px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: left;
  padding-left: 6px;
  caret-color: ${(props) => props.theme.textBright} !important;
}

input.ant-input.ant-input-disabled {
  background-color: transparent;
  color: ${(props) => props.theme.textDim} !important;
}

.ant-input-suffix {
  min-height: 100%;
  color: ${(props) => props.theme.inputPlaceHolderColor}!important;
}

.ant-input-password-icon{
  color: ${(props) => props.theme.inputPlaceHolderColor}!important;
  &:hover {
    color: ${(props) => props.theme.textWhite}!important;
  }
}

.ant-select-selection__placeholder {
  color: ${(props) => props.theme.inputPlaceHolderColor};
}

.ant-input-affix-wrapper {
  background-color: ${(props) => props.theme.foreground}! important;
  border-radius: 4px;
  border: 1px solid  ${(props) => props.theme.inputBorderColor} !important;
  border: none;
  box-shadow: none;
  width: 100%;
  height: 40px;
  padding: 0px 11px;
  max-height: 40px;
  
  &:hover,
  &:focus {
    border: 1px solid  ${(props) =>
      props.theme.inputBorderActiveColor} !important;
    box-shadow: none;
  }

  .ant-input-password-icon {
    // margin-top: 12px;
  }
}
`;
export default AntdFormStyles;
