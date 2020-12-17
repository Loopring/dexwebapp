import lightcone_v3_config from 'lightcone/config';
import request from 'lightcone/common/request';

export async function getData(exchangeTokens, market, interval, end) {
  try {
    // TODO: replace LP-
    if (market.startsWith('LP-')) {
      market = market.replace('LP-', '');
    }

    let params = {
      market,
      interval,
      limit: '120',
    };

    if (end) {
      params['end'] = end;
    }

    // https://loopring.github.io/DEX-API/zh-hans/dex_apis/getCandlestick.html
    const response = await request({
      method: 'GET',
      url: '/api/v2/candlestick',
      params,
    });

    const data = response['data'];
    const candles = data.map((arr) => arrToCandlestick(arr));

    let baseToken;
    let i;

    var newCandles = [];
    for (i = 0; i < candles.length; i = i + 1) {
      const candle = candles[i];
      const tokens = market.split('-');

      const start = candle['start'];

      // API may return duplicated data
      if (start >= end) {
        continue;
      }

      baseToken = tokens[0];
      const baseTokenVolume = lightcone_v3_config.fromWEI(
        baseToken,
        candle['size'], // Use Base Token成交总量
        exchangeTokens
      );

      let kLineModel = {
        timestamp: start,
        low: Number(candle['low']),
        high: Number(candle['high']),
        open: Number(candle['open']),
        close: Number(candle['close']),
        volume: Number(baseTokenVolume),
      };
      kLineModel.turnover =
        ((kLineModel.open +
          kLineModel.close +
          kLineModel.high +
          kLineModel.low) /
          4) *
        kLineModel.volume;
      newCandles.push(kLineModel);
    }

    let updatedCandles = [];
    // Sort candles
    if (newCandles && newCandles.length > 1) {
      newCandles = newCandles.sort((a, b) =>
        a.timestamp > b.timestamp ? 1 : -1
      );

      let previousCandle = newCandles[0];
      const intervalInMillisecond = intervalToMillisecond(interval);

      // Not all timestamps have data.
      for (i = 1; i < newCandles.length; i = i + 1) {
        let newCandle = newCandles[i];
        while (
          newCandle.timestamp >
          previousCandle.timestamp + intervalInMillisecond
        ) {
          let kLineModel = {
            timestamp: previousCandle.timestamp + intervalInMillisecond,
            low: previousCandle.close,
            high: previousCandle.close,
            open: previousCandle.close,
            close: previousCandle.close,
            volume: 0,
          };
          kLineModel.turnover =
            ((kLineModel.open +
              kLineModel.close +
              kLineModel.high +
              kLineModel.low) /
              4) *
            kLineModel.volume;
          updatedCandles.push(kLineModel);
          previousCandle = Object.assign({}, kLineModel);
        }

        updatedCandles.push(newCandle);
        previousCandle = Object.assign({}, newCandle);
      }
    } else {
      updatedCandles = newCandles;
    }

    return updatedCandles;
  } catch (error) {
    return null;
  }
}

function arrToCandlestick(arr) {
  return {
    start: Number(arr[0]),
    count: Number(arr[1]),
    open: arr[2],
    close: arr[3],
    high: arr[4],
    low: arr[5],
    size: arr[6],
    volume: arr[7],
  };
}

function intervalToMillisecond(interval) {
  switch (interval) {
    case '1min':
      return 60000;
    case '5min':
      return 300000;
    case '15min':
      return 900000;
    case '30min':
      return 1800000;
    case '1hr':
      return 3600000;
    case '2hr':
      return 7200000;
    case '4hr':
      return 14400000;
    case '12hr':
      return 43200000;
    case '1d':
      return 86400000;
    case '1w':
      return 604800000;
    default:
      return 604800000;
  }
}
