import { REST_TICKER, UPDATE_TICKER } from 'redux/actions/market/Ticker';

const initialState = {
  high: '-',
  low: '-',
  percentChange24h: '-',
  size: '-',
  volume: '-',
  open: '-',
  close: '-',
};

export const TickerReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TICKER:
      const ticker = action.payload.ticker;
      let open = parseFloat(ticker['open']);
      let close = parseFloat(ticker['close']);
      let high = parseFloat(ticker['high']);
      let low = parseFloat(ticker['low']);
      let percentChange24h = (((close - open) / open) * 100).toFixed(2);
      percentChange24h = percentChange24h !== 'NaN' ? percentChange24h : '0.00';
      if (close > open) {
        percentChange24h = `+${percentChange24h}`;
      }

      if (isNaN(high)) {
        high = '-';
      }

      if (isNaN(low)) {
        low = '-';
      }

      if (isNaN(open)) {
        open = '-';
      }

      if (isNaN(close)) {
        close = '-';
      }

      return {
        ...state,
        ...ticker,
        high,
        low,
        percentChange24h: `${percentChange24h}%`,
        open,
        close,
      };

    case REST_TICKER:
      return {
        high: '-',
        low: '-',
        percentChange24h: '-',
        size: '-',
        volume: '-',
        open: '-',
        close: '-',
      };

    default:
      return state;
  }
};
