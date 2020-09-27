import { BandChain } from './BandChainCopy.js';

export default class BandChainClient {
  constructor() {
    this.endpoint = 'https://poa-api.bandchain.org';
    this.scriptId = 1;
  }

  async getOraclePrice(legal) {
    const tokens = ['ETH', 'USDT', 'LRC', 'BTC'];
    const bandchain = new BandChain(this.endpoint);
    const oracleScript = await bandchain.getOracleScript(this.scriptId);
    let results = [];

    for (let i = 0; i < tokens.length; i = i + 1) {
      const token = tokens[i];
      const r = await this.getPrice(bandchain, legal, token, oracleScript);
      results.push(r);
    }
    return results;
  }

  async getPrice(client, legal, baseSymbol, oracleScript) {
    const params = {
      base_symbol: baseSymbol,
      quote_symbol: legal,
      aggregation_method: 'median',
      multiplier: 1000000,
    };

    const validatorCounts = {
      minCount: 3,
      askCount: 4,
    };

    const oracleResult = await client.getLastMatchingRequestResult(
      oracleScript,
      params,
      validatorCounts
    );

    return {
      symbol: baseSymbol,
      price: (parseFloat(oracleResult.result.px) / params.multiplier).toFixed(
        3
      ),
    };
  }
}
