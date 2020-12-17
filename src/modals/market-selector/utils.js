export function checkMarketIsNew(markets) {
  let updatedMarkets = [];
  for (let i = 0; i < markets.length; i = i + 1) {
    // Update market list configurations here.
    let market = markets[i];
    market.isNew = false;

    let existingMarkets = [
      'LRC-USDT',
      'LRC-ETH',
      'ETH-DAI',
      'ETH-USDT',
      'LINK-ETH',
      'DXD-ETH',
      'AUC-ETH',
      'RPL-ETH',
      'USDT-DAI',
      'KEEP-USDT',
      'USDC-USDT',
      'PNK-ETH',
      'RENBTC-USDT',
      'LEND-ETH',
      'PNT-USDT',
      'LEND-USDT',
      'BTU-USDT',
      'BZRX-ETH',
      'COMP-USDT',
      'GRID-ETH',
      'NEST-ETH',
      'PBTC-USDT',
      'ETH-USDC',
      'YFI-USDT',
      'GRG-ETH',
      'ONG-USDT',
      'ETH-RENBTC',
      'CRV-USDT',
      'BUSD-USDT',
      'ETH-WBTC',
      'WBTC-USDC',
      'BAND-USDT',
      'TON-ETH',
      'UNI-USDT',
      'KAI-USDT',
      'PLTC-USDT',
      'QCAD-USDT',
    ];
    if (existingMarkets.includes(market.market) === false) {
      market.isNew = true;
    } else {
      market.isNew = false;
    }
    updatedMarkets.push(market);
  }
  return updatedMarkets;
}

export function sortByVolume(markets, prices) {
  let ethFilteredPrice = prices.filter((price) => price.symbol === 'ETH');
  let usdtFilteredPrice = prices.filter((price) => price.symbol === 'USDT');

  // If no prices from APIs, use default values.
  let ethPrice = 240;
  let usdtPrice = 1;
  if (ethFilteredPrice.length === 1 && usdtFilteredPrice.length === 1) {
    ethPrice = parseFloat(ethFilteredPrice[0].price);
    usdtPrice = parseFloat(usdtFilteredPrice[0].price);
  }

  let weightedMarkets = [];
  for (let i = 0; i < markets.length; i = i + 1) {
    let market = markets[i];

    // Check zero volume.
    if (market.ticker.volume === '-') {
      market.updatedVolume = 0;
      weightedMarkets.push(market);
      continue;
    }

    let updatedVolume = market.ticker.volume;
    let tokenSymbol = market.quoteToken.symbol;
    if (tokenSymbol === 'USDT' || tokenSymbol === 'DAI') {
      updatedVolume = market.ticker.volume * usdtPrice;
    } else if (tokenSymbol === 'ETH') {
      updatedVolume = market.ticker.volume * ethPrice;
    } else {
      // If quota token is not USDT, DAI nor ETH, skip it.
      updatedVolume = market.ticker.volume * usdtPrice;
    }
    market.updatedVolume = updatedVolume;
    weightedMarkets.push(market);
  }

  weightedMarkets.sort((a, b) => {
    return (
      b.updatedVolume - a.updatedVolume ||
      a.baseToken.symbol > b.baseToken.symbol
    );
  });

  return weightedMarkets;
}
