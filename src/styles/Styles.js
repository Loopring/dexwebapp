import styled from 'styled-components';

import { Button, Input, Menu } from 'antd';

const Scroller = styled.div`
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: scroll
  position: absolute
  &::-webkit-scrollbar: {
    display: none;
  }
`;

const NavButtonWrapper = styled(Menu.Item)`
  && {
    background-color: ${(props) =>
      props.usesidepanelbackground === 'true'
        ? props.theme.sidePanelBackground
        : props.theme.background} !important;
    border: none !important;
    padding: 0 20px!
    margin-left: 0 !important;
    margin-right: 0 !important;
    list-style-type: none!important;
  }

  &.ant-menu-item-disabled {
    display:none;
  }
`;

const TextCompactTableHeader = styled.span`
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 400;
  user-select: none;
  color: ${(props) => props.theme.textDim};
`;

const TextPanelHeader = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${(props) => props.theme.textWhite};
`;

const HighlightTextSpan = styled.span`
  padding-right: 0px;
  font-weight: 600;
  font-size: 0.9rem;
  color: ${(props) => props.theme.textWhite};
`;

const RegularTextSpan = styled.span`
  padding-right: 0px;
  font-weight: 400;
  font-size: 0.85rem;
  color: ${(props) => props.theme.textDim};
`;

const BaseActionButton = styled(Button)`
  font-size: 1rem!important;
  font-weight: 600!important;
  height: 40px!important;
  width: 100%;
  border-style: none!important;
  border-radius: 20px!important;
  color: ${(props) => props.theme.textBigButton}!important;
  text-transform: uppercase!important;
  transition: 1s!important;

  &:hover {
     
  }

  &[disabled],&[disabled]:hover {
    background: ${(props) => props.theme.buttonBackground}!important;
    color: ${(props) => props.theme.textDim}!important;
  }
}
`;

const ActionButton = styled(BaseActionButton)`
  &:not([disabled]) {
    background: ${(props) =>
      props.buttonbackground
        ? props.buttonbackground
        : props.theme.primary}!important;
  }
`;

const OutlineButton = styled(Button)`
  border: 1px solid ${(props) => props.theme.inputBorderColor}!important;
  height: 22px !important;
  font-size: 0.85rem !important;
  font-weight: 500;
  padding-top: inherit !important;
  padding-bottom: inherit !important;
  background-color: transparent;

  &:disabled {
    background-color: transparent !important;
  }
`;

const TransferOutlineButton = styled(OutlineButton)`
  color: ${(props) => props.theme.primary}!important;

  &:focus {
    color: ${(props) => props.theme.primary}!important;
    background-color: transparent !important;
    border: 1px solid ${(props) => props.theme.inputBorderActiveColor}!important;
  }

  &:hover {
    color: ${(props) => props.theme.primary}!important;
    background-color: transparent !important;
    border: 1px solid ${(props) => props.theme.inputBorderActiveColor}!important;
  }
   &:disabled {
    color: ${(props) => props.theme.inputBorderActiveColor}!important;
  }
`;

const DepositOutlineButton = styled(OutlineButton)`
  color: ${(props) => props.theme.green}!important;

  &:focus {
    color: ${(props) => props.theme.green}!important;
    background-color: transparent !important;
    border: 1px solid ${(props) => props.theme.inputBorderActiveColor}!important;
  }

  &:hover {
    color: ${(props) => props.theme.green}!important;
    background-color: transparent !important;
    border: 1px solid ${(props) => props.theme.inputBorderActiveColor}!important;
  }

  &:disabled {
    color: ${(props) => props.theme.inputBorderActiveColor}!important;
  }
`;

const WithdrawOutlineButton = styled(OutlineButton)`
  color: ${(props) => props.theme.red}!important;

  &:focus {
    color: ${(props) => props.theme.red}!important;
    background-color: transparent !important;
    border: 1px solid ${(props) => props.theme.inputBorderActiveColor}!important;
  }

  &:hover {
    color: ${(props) => props.theme.red}!!important;
    background-color: transparent !important;
    border: 1px solid ${(props) => props.theme.inputBorderActiveColor}!important;
  }
`;

const CancelOrderButton = WithdrawOutlineButton;

const SimpleTableContainer = styled.div`
  min-height: 540px;
  max-width: 1250px;
  width: 100%;
  margin: 0 auto;
`;

const LargeTableContainer = styled.div`
  min-height: 540px;
  max-width: 1250px;
  width: 100%;
  display: table;
  margin: 0 auto;
`;

const LargeTableRow = styled.div`
  font-size: 0.85rem;
  font-weight: 400;
`;

const LargeTableRowStatus = styled(LargeTableRow)`
  text-align: center;
  color: ${(props) => props.theme.textDim};

  & > div {
    display: inline-block;
    min-width: 60px;
    text-align: left;
  }
`;
const LargeTableRowProcessed = styled(LargeTableRowStatus)`
  color: ${(props) => props.theme.green};
`;

const LargeTableRowProcessing = styled(LargeTableRowStatus)`
  color: ${(props) => props.theme.highlight};
`;

const LargeTableRowFailed = styled(LargeTableRowStatus)`
  color: ${(props) => props.theme.red};
`;

const LargeTableHeader = styled.div`
  font-size: 0.8rem;
  max-width: 1250px;
  width: 100%;
  display: table;
  margin: 0 auto;
  margin-bottom: 20px;
  color: ${(props) => props.theme.textDim}!important;
`;

const AssetDropdownMenuItem = styled(Menu.Item)`
  border-bottom-style: solid;
  border-bottom-color: ${(props) => props.theme.foreground};
  border-bottom-width: 1px;

  height: 40px;

  > span {
    line-height: 30px;
    font-size: 0.9rem;
  }
`;

const SearchInput = styled(Input)`
  height: 24px !important;
  margin-left: 4px;
  padding-left: 4px !important;
  font-size: 0.85rem !important;
  font-weight: normal !important;
  box-shadow: none !important;
  border-radius: 0px !important;
  wave-animation-width: 0px !important;
  border-top: none;
  border-bottom: 2px solid ${(props) => props.theme.inputBorderColor} !important;
  color: ${(props) => props.theme.textWhite} !important;

  ::placeholder {
    color: ${(props) => props.theme.textDim}!important;
  }

  :hover {
    order-bottom: 2px solid ${(props) => props.theme.primary} !important;
  }

  :focus {
    box-shadow: none;
    border-radius: 0px;
    border-top: none;
    border-bottom: 2px solid ${(props) => props.theme.primary} !important;
  }
`;

export {
  Scroller,
  TextCompactTableHeader,
  TextPanelHeader,
  HighlightTextSpan,
  RegularTextSpan,
  ActionButton,
  OutlineButton,
  TransferOutlineButton,
  DepositOutlineButton,
  WithdrawOutlineButton,
  CancelOrderButton,
  NavButtonWrapper,
  SimpleTableContainer,
  LargeTableContainer,
  LargeTableRow,
  LargeTableRowStatus,
  LargeTableRowProcessed,
  LargeTableRowProcessing,
  LargeTableRowFailed,
  LargeTableHeader,
  AssetDropdownMenuItem,
  SearchInput,
};
