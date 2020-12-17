export const SELECT_THEME = 'SELECT_THEME';
export const SELECT_LANGUAGE = 'SELECT_LANGUAGE';
export const SELECT_CURRENCY = 'SELECT_CURRENCY';

export function selectLanguage(language) {
  return {
    type: SELECT_LANGUAGE,
    payload: {
      language,
    },
  };
}

export function selectCurrency(currency) {
  return {
    type: SELECT_CURRENCY,
    payload: {
      currency,
    },
  };
}

export function selectTheme(themeName) {
  return {
    type: SELECT_THEME,
    payload: {
      themeName,
    },
  };
}
