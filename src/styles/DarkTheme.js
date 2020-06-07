import { WalletConnectEN, WalletConnectZH } from "./WalletConnectI18n";

const green = "#33cc00";
const red = "#FF3333";
const orange = "#FFA333";
const blue = "#1c60ff";
const lightblue = "#447CFF";

const yankeesBlueDarker = "#151618";
const yankeesBlue = "#1c1d24";
const russianViolet = "#282a32";
const gunmetal = "#282a32";
const arsenic = "#403f4c";

const DarkTheme = {
  imgDir: "dark",
  green: green,
  red: red,
  orange: orange,
  primary: blue,
  warning: orange,
  success: green,
  error: red,
  highlight: lightblue,

  background: yankeesBlueDarker,
  foreground: yankeesBlue,
  lightForeground: russianViolet,

  sidePanelBackground: gunmetal,
  buttonBackground: "#616774",

  textBright: "#EEEEEE",
  textWhite: "#E0E0E0",

  textWhiteBulk: "#9FA0BF",
  textDim: "#E0E0E080",
  textSidebarMenu: "#E0E0E0",
  textLowContrast: "#424242",
  textBigButton: "rgba(255,255,255,.8)",
  textSelection: "#eeeeee",

  popupBackground: gunmetal,
  popupHeaderBackground: `#1c1d24`,
  notificationBackground: russianViolet,

  secondaryNavbarBackground: yankeesBlue,
  marketSelectionHoverBackground: yankeesBlueDarker,
  spreadAggregationBackground: russianViolet,
  inputPlaceHolderColor: "#E0E0E040",

  inputBorderColor: "rgba(255,255,255,0.05)",
  inputBorderActiveColor: "rgba(255,255,255,0.2)",
  seperator: "rgba(255,255,255,0.05)",
  border: yankeesBlueDarker,

  tableHeaderBackground: "#282a32",
  tableHoverBackground: "#282a32",

  legalIframeBackground: yankeesBlueDarker,

  buyPrimary: green,
  buySecondary: green + "BB",
  buyBar: green + "30",

  sellPrimary: red,
  sellSecondary: red + "BB",
  sellBar: red + "30",
};

const DarkThemeZH = {
  ...DarkTheme,
  walletConnectI18n: WalletConnectZH,
  upColor: red,
  downColor: green,
  timeFormat: "M月DD日 HH:mm:ss",
  shortTimeFormat: "M月DD日 HH:mm",
};

const DarkThemeEN = {
  ...DarkTheme,
  walletConnectI18n: WalletConnectEN,
  upColor: green,
  downColor: red,
  timeFormat: "MM/DD HH:mm:ss",
  shortTimeFormat: "MM/DD HH:mm",
};

export { DarkThemeZH, DarkThemeEN };
