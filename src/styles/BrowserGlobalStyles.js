import { createGlobalStyle } from 'styled-components';

const BrowserGlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Montserrat-Regular';
    font-weight: normal;
    font-style: normal;
    src: local('Montserrat-Regular'),
      url(/assets/fonts/Montserrat/Montserrat-Regular.ttf) format('truetype');
  }

  @font-face {
    font-family: 'Montserrat-Italic';
    font-weight: normal;
    font-style: normal;
    src: local('Montserrat-Italic'),
      url(/assets/fonts/Montserrat/Montserrat-Italic.ttf) format('truetype');
  }

  @font-face {
    font-family: 'Montserrat-Medium';
    font-weight: normal;
    font-style: normal;
    src: local('Montserrat-Medium'),
      url(/assets/fonts/Montserrat/Montserrat-Medium.ttf) format('truetype');
  }

  @font-face {
    font-family: 'Montserrat-Bold';
    font-weight: bold;
    font-style: normal;
    src: local('Montserrat-Bold'),
      url(/assets/fonts/Montserrat/Montserrat-Bold.ttf) format('truetype');
  }

  @font-face {
    font-family: 'Montserrat-Light';
    font-weight: 300;
    font-style: normal;
    src: local('Montserrat-Light'),
      url(/assets/fonts/Montserrat/Montserrat-Light.ttf) format('truetype');
  }

  html {
    font-size: 13px;
    color: ${(props) => props.theme.background};
  }

  body {
    margin:0;
    overflow-y: scroll !important;
    background-color: ${(props) => props.theme.background};
    // Hide scrollbar in Firefox
    * {
      scrollbar-width: none !important;
    }
  }

  // Hide scrollbar on others
  ::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    background: transparent;  /* optional: just make scrollbar invisible */
  }

  input, textarea {
    outline: none!important;
  }

  input:-internal-autofill-selected {
    color: ${(props) => props.theme.inputPlaceHolderColor}!important;
    transition: background-color 5000s ease-in-out 0s; // this is the magic
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active  {
      -webkit-text-fill-color: ${(props) => props.theme.primary}!important;
  }

  .desktop-layout {
    @media only screen and (max-width: 770px) {
      display: none;
    }
  }

  .mobile-layout {
    @media only screen and (min-width: 770px) {
      display: none;
    }
  }

  .cookieConsent {
    @media only screen and (max-width: 769px) {
      display: none !important;
    }
  }

  *::selection {
    background: ${(props) => props.theme.primary};
    color: ${(props) => props.theme.textSelection} ;
  }

  *::placeholder {
    color: ${(props) => props.theme.inputPlaceHolderColor}!important;
    opacity: 1;
  }

  a {
    color:${(props) => props.theme.primary};
  }

  a:hover {
    color:${(props) => props.theme.highlight};
  }

`;

export default BrowserGlobalStyles;
