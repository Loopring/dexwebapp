import { createGlobalStyle } from 'styled-components';

const AntdModalStyles = createGlobalStyle`

.ant-modal-content {
  background-color: ${(props) => props.theme.popupBackground};
  border-radius: 12px;
}

.ant-modal-content > .ant-modal-header {
  background-color: ${(props) => props.theme.popupHeaderBackground};
  border-bottom: none;
  padding: 14px 24px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.ant-modal-title {
  text-align: center!important;
}

.ant-modal-body {
  padding: 18px 60px;

  @media only screen and (max-width: 770px) {
    padding: 18px 20px;
  }
}

.ant-modal-close-x {
  color: ${(props) => props.theme.textDim};
  width: 54px;
  height: 54px;
  line-height: 54px;
}

.ant-notification,
.ant-notification-notice-message {
  color: ${(props) => props.theme.textWhite};
  font-size: 0.9rem !important;
}

.ant-notification-notice-description {
 color: ${(props) => props.theme.textDim};
  font-size: 0.85rem !important;
}

.ant-notification-close-icon {
  color: ${(props) => props.theme.textDim};
}


//---------------------------

.defaultPopover.ant-popover {
  .ant-popover-inner-content , .ant-popover-message-title {
    border-radius:2px;
    font-size: 0.85rem!important;
    color: ${(props) => props.theme.textWhite}!important;
    background-color: ${(props) => props.theme.popupBackground}!important;
  }

  .ant-popover-message-title {
    padding: 8px 32px;
  }

  .ant-popover-arrow {
    border-top-color: ${(props) => props.theme.popupHeaderBackground}!important;
    border-left-color: ${(props) =>
      props.theme.popupHeaderBackground}!important;
    border-right-color:${(props) =>
      props.theme.popupHeaderBackground}!important;
    border-bottom-color: ${(props) =>
      props.theme.popupHeaderBackground}!important;
  }

  .ant-popover-buttons {
    text-align: center;
  }
  button.ant-btn.ant-btn-sm, button.ant-btn.ant-btn-sm.primary {
    min-width: 80px;
    font-size: 1rem;
    font-weight: 600;
    height: 32px;
    border-radius: 16px;
    border:none;
  }

  button.ant-btn.ant-btn-sm {
    background-color:${(props) => props.theme.buttonBackground}!important;
     color: ${(props) => props.theme.textWhite}!important;
     &:hover {
        color: ${(props) => props.theme.primary}!important;
     }
  }

  button.ant-btn.ant-btn-sm.ant-btn-primary {
    background: ${(props) => props.theme.primary}!important;
    color: ${(props) => props.theme.textBigButton}!important;
    &:hover {
      color: ${(props) => props.theme.highlight}!important;
    }
  }
}
`;
export default AntdModalStyles;
