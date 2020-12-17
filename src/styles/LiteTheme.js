import { WalletConnectEN, WalletConnectZH } from './WalletConnectI18n';

const green = '#00B800';
const red = '#FF3333';
const orange = '#FFA333';
const blue = '#1c60ff';
const lightblue = '#447CFF';

// const yankeesBlueDarker = '#242539';
// const yankeesBlue = '#292B42';
// const russianViolet = '#2F304D';
// const gunmetal = '#303249';
// const arsenic = '#3e3f61';

const LiteTheme = {
  imgDir: 'light',
  green: green,
  red: red,
  orange: orange,
  primary: blue,
  warning: orange,
  success: green,
  error: red,
  highlight: lightblue,

  background: '#DFE6EF',
  foreground: '#F9FCFD',
  lightForeground: '#F9FCFD',

  sidePanelBackground: '#EDF2F7',
  buttonBackground: '#CAD1D5',

  textBright: '#000000',
  textWhite: '#050505',

  textWhiteBulk: '#050505',
  textDim: '#05050590',
  textSidebarMenu: '#050505',
  textLowContrast: '#05050590',
  textBigButton: 'rgba(255,255,255,.8)',
  textSelection: 'rgba(255,255,255,.8)',

  popupBackground: '#F0F5F9',
  popupHeaderBackground: '#DFE6EF',
  notificationBackground: '#F0F5F9',

  secondaryNavbarBackground: '#EDF2F7',
  marketSelectionHoverBackground: '#FFFFFF',
  spreadAggregationBackground: '#F0F5F9',
  inputPlaceHolderColor: 'rgba(0,0,0,.2)',

  inputBorderColor: 'rgba(0,0,0,0.1)',
  inputBorderActiveColor: 'rgba(0,0,0,0.3)',
  seperator: 'rgba(0,0,0,0.1)',
  border: '#C8C8DA', //yankeesBlueDarker,

  tableHeaderBackground: '#F0F5F9',
  tableHoverBackground: '#F0F5F9',

  legalIframeBackground: '#DFE6EF',

  buyPrimary: green,
  buySecondary: green + 'BB',
  buyBar: green + '30',

  sellPrimary: red,
  sellSecondary: red + 'BB',
  sellBar: red + '30',
};

const LiteThemeZH = {
  ...LiteTheme,
  walletConnectI18n: WalletConnectZH,
  upColor: red,
  downColor: green,
  timeFormat: 'M月DD日 HH:mm:ss',
  shortTimeFormat: 'M月DD日 HH:mm',
};

const LiteThemeEN = {
  ...LiteTheme,
  walletConnectI18n: WalletConnectEN,
  upColor: green,
  downColor: red,
  timeFormat: 'MM/DD HH:mm:ss',
  shortTimeFormat: 'MM/DD HH:mm',
};

export { LiteThemeZH, LiteThemeEN };
