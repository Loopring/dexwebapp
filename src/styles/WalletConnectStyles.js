import { createGlobalStyle } from 'styled-components';

const WalletConnectStyles = createGlobalStyle`
// Wallet connect
.walletconnect-wrapper,
.walletconnect-wrapper *,
.walletconnect-qrcode__text {
  font-family: Montserrat, sans-serif !important;
}

.walletconnect-modal__header {
  text-align: center !important;
  display: block !important;
  background-color: ${(props) => props.theme.popupHeaderBackground} !important;
  padding: 14px 24px !important;
  margin-bottom: 40px !important;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.walletconnect-modal__headerLogo {
  height: 24px !important;
  width: auto !important;
  margin: 0 !important;
}

.walletconnect-modal__base {
  background: ${(props) => props.theme.popupBackground} !important;
  border-radius: 12px !important;
  max-width: 600px!important;
  width: 540px!important;

  @media only screen and (max-width: 770px) {
    margin-right: 10px;
    margin-left:10px;
    width: 95% !important
  }
}

.walletconnect-modal__close__wrapper {
  top: 18px !important;
  right: 18px !important;
}

.walletconnect-modal__close__icon {
  width: 16px !important;
  height: 16px !important;
}


.walletconnect-modal__close__icon > div {
  border: none !important;
  transition: border-color 150ms ease-in-out 0s;
  cursor: pointer;
  background: ${(props) => props.theme.textDim} !important;
}

.walletconnect-modal__close__icon:hover > div {
  border: none !important;
  background: ${(props) => props.theme.textDim} !important;
}

.walletconnect-modal__close__line1 {
  height: 3px;
  width: 90%;
}

.walletconnect-modal__close__line2 {
  height: 3px;
  width: 90%;
}

.walletconnect-qrcode__text {
  color: ${(props) => props.theme.textDim} !important;
}
.walletconnect-qrcode__image {
  background: ${(props) => props.theme.textBigButton}!important;
  padding: 24px!important;
  margin: 40px 80px;
  border-radius: 4px;
  width: 320px !important;
  user-select: none !important;

  @media only screen and (max-width: 770px) {
    width: 260px !important;
  }
}

////////////////// I18N ////////////////////////////

p.walletconnect-qrcode__text {
    font-size: 0!important;
    ::before {
      display:block;
        font-size: 1rem !important;
        font-weight: 600 !important;
        white-space: pre;
        color: ${(props) => props.theme.red}!important;
        content: '${(props) => props.theme.walletConnectI18n.scanQrCode}';
    }
}

`;

export default WalletConnectStyles;
