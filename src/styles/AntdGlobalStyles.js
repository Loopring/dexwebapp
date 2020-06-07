import { createGlobalStyle } from "styled-components";

const AntdGlobalStyles = createGlobalStyle`

.ant-spin-container,.ant-spin{
  transition-delay: 0s!important;
  transition:none!important;
}
.ant-spin-blur {
  opacity: 0!important;
  transition: none!important;
}

.ant-spin {
  color: ${(props) => props.theme.primary};
}

.ant-spin-nested-loading > div > .ant-spin .ant-spin-text {
  text-shadow: none!important;
}
.ant-tooltip-inner {
  background: ${(props) => props.theme.primary};
  padding: 12px 16px;
  color: ${(props) => props.theme.textBigButton};
  font-size: 0.85rem;
}

.ant-tooltip-arrow::before {
  background: ${(props) => props.theme.primary};
}

.ant-input-password input {
  font-weight: normal!important;
}

.ant-checkbox-inner {
  background: ${(props) => props.theme.buttonBackground} !important;
  border: ${(props) => props.theme.inputBorderColor};
}

.ant-checkbox.ant-checkbox-checked .ant-checkbox-inner {
  background: ${(props) => props.theme.primary}!important;
}

.ant-checkbox-wrapper {
  font-size: 0.85rem;
  font-weight: 500;
  color: ${(props) => props.theme.textDim}!important;
}

.ant-form-item-label {
  line-height: 24px;
}

.ant-form-item {
  margin-bottom: 0px;
}

.ant-list-bordered {
  border: none;
}

li.ant-pagination-item {
   border-style: none;
   background: ${(props) => props.theme.foreground}!important;
   a {
     color: ${(props) => props.theme.textDim}!important;
   }
   &:hover {
      background: ${(props) => props.theme.primary}!important;
      a {
       color: ${(props) => props.theme.textBigButton}!important;
      }
   }
}

li.ant-pagination-item-active {
  background: ${(props) => props.theme.primary}!important;
  color: ${(props) => props.theme.textBigButton}!important;

  border-style: none;
  a {
    color: ${(props) => props.theme.textBigButton}!important;
  }
}

.ant-pagination.mini .ant-pagination-item {
  margin: 2px;
}

li.ant-pagination-prev a.ant-pagination-item-link,
li.ant-pagination-next a.ant-pagination-item-link {
  background-color: ${(props) => props.theme.foreground}!important;
  border-style: none;
  color: ${(props) => props.theme.textWhite}!important;
}

li.ant-pagination-prev:hover a.ant-pagination-item-link,
li.ant-pagination-next:hover a.ant-pagination-item-link {
  background-color: ${(props) => props.theme.primary}!important;
  border-style: none;
  color: ${(props) => props.theme.textBigButton}!important;
}

li.ant-pagination-prev.ant-pagination-disable:hover,
li.ant-pagination-next.ant-pagination-disable:hover {
  background-color: ${(props) => props.theme.foreground}!important;
  color: ${(props) => props.theme.textDim}!important;
}

li.ant-pagination-prev.ant-pagination-disable a.ant-pagination-item-link,
li.ant-pagination-next.ant-pagination-disable a.ant-pagination-item-link {
  color: ${(props) => props.theme.textDim}!important;
}

li.ant-pagination-prev  a.ant-pagination-item-link:hover,
li.ant-pagination-next  a.ant-pagination-item-link:hover {
  color: ${(props) => props.theme.textBigButton}!important;
}

li.ant-pagination-prev:hover,li.ant-pagination-prev:focus,
li.ant-pagination-next:hover,li.ant-pagination-next:focus {
  color: ${(props) => props.theme.textBigButton}!important;
}

.ant-pagination-item-ellipsis {
  color: ${(props) => props.theme.textDim}!important;
}

.ant-pagination-item-link-icon {
  color: ${(props) => props.theme.textBigButton}!important;
}

.ant-pagination-options {
  display: none;
}

.ant-table-pagination.ant-pagination {
  padding: 4px 0px !important;
  margin: auto !important;
  text-align: center !important;
}


.ant-input,
.ant-form *,
.ant-pagination-item {
  font-family: Montserrat, sans-serif !important;
  font-size: 0.85rem;
}


.ant-dropdown-menu {
  padding: 0px;
}

.ant-dropdown-menu-item {
  font-size: 0.9rem;
  color: ${(props) => props.theme.textWhite}!important;
  background: ${(props) => props.theme.foreground}!important;
}

.ant-dropdown-menu-submenu-arrow {
  display: none;
}

.ant-dropdown-menu-item-divider,
.ant-dropdown-menu-submenu-title-divider {
  margin: 0px;
  background-color:  ${(props) => props.theme.foreground};
}


.ant-popover > .ant-popover-content {
  border-radius: 4px;
  background:  ${(props) => props.theme.background}!important;
  box-shadow: 0 0 0 5000px rgba(0, 0, 0, 0.45) !important;
}

.ant-popover > .ant-popover-content > .ant-popover-inner {
    border: none;
    color:${(props) => props.theme.textWhite};
    background:  ${(props) => props.theme.popupBackground};
    font-size: 0.85rem;

    min-height: 20px;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;

    .ant-popover-title {
       border-top-left-radius: 2px!important;
       border-top-right-radius: 2px!important;
      background: ${(props) => props.theme.popupHeaderBackground};
      border: none;
      padding-top: 6px;
      padding-bottom: 6px;
      font-size: 0.9rem;
      font-weight: 600;
      color:  ${(props) => props.theme.textWhite};
    }
  }

 .ant-popover > .ant-popover-content > .ant-popover-arrow {
    border-top-color: ${(props) => props.theme.popupHeaderBackground};
    border-left-color:${(props) => props.theme.popupHeaderBackground};
  }

.ant-popover > .ant-popover-content > .ant-popover-inner-content {
  border-bottom-left-radius: 2px!important;
  border-bottom-right-radius: 2px!important;
  background: ${(props) => props.theme.foreground};
}

.marketSelection.ant-popover-placement-bottom,
.marketSelection.ant-popover-placement-bottomLeft,
.marketSelection.ant-popover-placement-bottomRight {
  padding-top: 0px;
}

.ant-btn-icon-only.ant-btn-sm > * {
  font-size: 14px;
  padding-bottom: 2px;
  vertical-align: middle;
}

.ant-radio-group {
  font-size: 0.9rem;
  font-weight: 600;
}

.ant-radio-button-wrapper {
  color: ${(props) => props.theme.textWhite}!important;
  border: 1px solid ${(props) =>
    props.theme.marketSelectionHoverBackground}!important;
  background: ${(props) =>
    props.theme.marketSelectionHoverBackground}!important;
}

.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  color: #fff !important;
  background: ${(props) => props.theme.primary}!important;
}

.ant-radio-button-wrapper:not(:first-child)::before {
  background-color: ${(props) => props.theme.inputBorderColor}!important;
}

.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):focus-within {
  box-shadow: unset;
}

.ant-menu-item, .ant-menu-submenu-title {
  display: none;
}

`;
export default AntdGlobalStyles;
