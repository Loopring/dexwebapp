import { DarkThemeEN, DarkThemeZH } from "styles/DarkTheme";
import { LiteThemeEN, LiteThemeZH } from "styles/LiteTheme";

import {
  SELECT_CURRENCY,
  SELECT_LANGUAGE,
  SELECT_THEME,
} from "redux/actions/UserPreferenceManager";
import {
  getCurrency,
  getLanguage,
  getThemeName,
  saveCurrency,
  saveLanguage,
  saveThemeName,
} from "lightcone/api/localStorgeAPI";
import i18n from "../../i18n";

const language = getLanguage();
const currency = getCurrency();
const themeName = getThemeName();

const getAutoThemeName = () => {
  const hours = new Date().getHours();
  const isDayTime = hours > 6 && hours < 20;
  return isDayTime ? "light" : "dark";
};

const selectTheme = (language, themeName) => {
  var themeName_ = themeName;
  if (themeName === "auto") {
    themeName_ = getAutoThemeName();
  }
  return themeName_ === "dark"
    ? language === "zh"
      ? DarkThemeZH
      : DarkThemeEN
    : language === "zh"
    ? LiteThemeZH
    : LiteThemeEN;
};

const initialState = {
  language: language,
  currency: currency,
  themeName: themeName,
  theme: selectTheme(language, themeName),
};

export const UserPreferenceManagerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_THEME:
      const themeName = action.payload.themeName;
      saveThemeName(themeName);
      return {
        ...state,
        themeName: themeName,
        theme: selectTheme(state.language, themeName),
      };

    case SELECT_LANGUAGE:
      const language = action.payload.language;
      i18n.changeLanguage(language);
      saveLanguage(language);

      return {
        ...state,
        language: language,
        theme: selectTheme(language, state.themeName),
      };

    case SELECT_CURRENCY:
      const currency = action.payload.currency;
      saveCurrency(currency);
      return {
        ...state,
        currency: currency,
      };

    default:
      return state;
  }
};
