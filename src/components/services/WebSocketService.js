import { connect } from 'react-redux';
import React, { Component } from 'react';
import config from 'lightcone/config';

import {
  emptyOrderBooks,
  fetchOrderBooks,
  updateSocketOrderBooks,
} from 'redux/actions/market/OrderBook';
import {
  emptyTrades,
  extendTrades,
  fetchTradeHistory,
} from 'redux/actions/market/TradeHistory';

import { LOGGED_IN } from 'redux/actions/DexAccount';
import { fetchMyAccountPage, updateBalance } from 'redux/actions/MyAccountPage';
import {
  fetchMyHistoryOrders,
  fetchMyOpenOrders,
  updateSocketOrder,
} from 'redux/actions/MyOrders';

import { updateSocketAllOrder } from 'redux/actions/MyOrderPage';
import { updateTicker } from 'redux/actions/market/Ticker';

import { arrToDepth } from 'lightcone/api/v1/depth';
import {
  arrToTicker,
  arrToTrade,
  getWsApiKey,
} from 'lightcone/api/LightconeAPI';

import { map as balanceMap } from 'lightcone/api/v1/balances';
import { map as orderMap } from 'lightcone/api/v1/orders';

const WESOCKET_URL = config.getWsServer();

let tickerBuffer = null;

let tradeBuffer = [];

let timer = 0;

let retry = 0;

class WebSocketService extends Component {
  state = {
    initialied: false,
  };

  // Use setupAfterExchangeInitialized rather than componentDidMount
  setupAfterExchangeInitialized() {
    this.setSubscription();

    // TODO: use debouse to handle interval
    // No network request in this interval.
    this.interval = setInterval(() => {
      tradeBuffer = tradeBuffer
        .filter(
          (trade) =>
            trade.market === this.props.currentMarket.current.toUpperCase()
        )
        .map((trade) => {
          delete trade.market;
          return trade;
        });
      if (tradeBuffer.length > 0) {
        this.props.extendTrades(tradeBuffer);
        tradeBuffer = [];
      }

      if (
        tickerBuffer &&
        tickerBuffer.market === this.props.currentMarket.current.toUpperCase()
      ) {
        delete tickerBuffer.market;
        this.props.updateTicker(tickerBuffer);
        tickerBuffer = null;
      }
    }, 500);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.exchange.isInitialized !== this.props.exchange.isInitialized
    ) {
      this.setupAfterExchangeInitialized();
    }

    if (this.props.exchange.isInitialized) {
      const market = this.props.currentMarket.current;
      const orderbook = this.props.orderBook;
      if (
        prevProps.currentMarket.current !== this.props.currentMarket.current
      ) {
        this.props.emptyTrades();
        this.props.emptyOrderBooks(0);
        const tradeArg = this.getTradeArg(market);
        const tickerArg = this.getTickerArg(market);
        const depthArg = this.getDepthArg(market, orderbook.level);
        const marketArgs = [tradeArg, depthArg, tickerArg];
        this.props.fetchTradeHistory(market);
        this.props.fetchOrderBooks(
          market,
          orderbook.level,
          this.props.exchange.tokens
        );
        tickerBuffer = null;
        tradeBuffer = [];
        this.sub(marketArgs);
      } else if (prevProps.orderBook.level !== this.props.orderBook.level) {
        this.props.emptyOrderBooks(this.props.orderBook.level);
        this.props.fetchOrderBooks(
          market,
          orderbook.level,
          this.props.exchange.tokens
        );
        const depthArg = this.getDepthArg(
          this.props.currentMarket.current,
          this.props.orderBook.level
        );
        this.sub([depthArg]);
      }

      if (
        (prevProps.currentMarket.current !== this.props.currentMarket.current ||
          prevProps.myOrders.showAllOpenOrders !==
            this.props.myOrders.showAllOpenOrders) &&
        this.props.account.state === LOGGED_IN &&
        !!this.props.account.apiKey
      ) {
        const orderArg = this.props.myOrders.showAllOpenOrders
          ? this.getOrderArg(this.props.currentMarket.current)
          : this.getOrderArg(this.props.currentMarket.current);

        this.sub([orderArg], this.props.account.apiKey);
      }

      /**
       * 切换账号时需要断开连接，然后重新订阅
       */
      if (
        (prevProps.account.state !== this.props.account.state ||
          this.props.account.apiKey !== prevProps.account.apiKey) &&
        this.props.account.state === LOGGED_IN &&
        !!this.props.account.apiKey
      ) {
        this.setSubscription();
      }

      /**
       * 切换到Account页面，重新订阅，已减轻不必要的订阅。
       */
      if (prevProps.pathname !== this.props.pathname) {
        try {
          let prevPropsFirst = prevProps.pathname.split('/')[1];
          let propsFirst = this.props.pathname.split('/')[1];
          if (prevPropsFirst !== propsFirst) {
            this.setSubscription();
          }
        } catch (error) {}
      }
    }
  }

  componentWillUnmount() {
    if (this.ws) {
      this.ws.close();
      clearInterval(this.interval);
      clearInterval(this.connectionListener);
    }
  }

  setSubscription() {
    let marketArgs = [];
    const accountArgs = [];

    // Trade related websockets
    if (this.props.pathname.includes('trade')) {
      const market = this.props.currentMarket.current;
      const orderbook = this.props.orderBook;
      this.props.fetchTradeHistory(market);
      this.props.fetchOrderBooks(
        market,
        orderbook.level,
        this.props.exchange.tokens
      );

      const tradeArg = this.getTradeArg(market);
      const tickerArg = this.getTickerArg(market);
      const depthArg = this.getDepthArg(market, orderbook.level);
      marketArgs = [tradeArg, depthArg, tickerArg];
    }

    if (
      this.props.pathname.includes('trade') ||
      this.props.pathname.includes('orders')
    ) {
      const market = this.props.currentMarket.current;

      if (
        this.props.account.state === LOGGED_IN &&
        !!this.props.account.apiKey
      ) {
        this.props.fetchMyOpenOrders(
          this.props.account.accountId,
          this.props.myOrders.openOrdersLimit,
          this.props.myOrders.openOrdersOffset,
          this.props.myOrders.showAllOpenOrders ? undefined : market,
          this.props.account.apiKey,
          this.props.exchange.tokens
        );

        this.props.fetchMyHistoryOrders(
          this.props.account.accountId,
          this.props.myOrders.historyOrdersLimit,
          this.props.myOrders.historyOrdersOffset,
          this.props.myOrders.showAllOpenOrders ? undefined : market,
          this.props.account.apiKey,
          this.props.exchange.tokens
        );
        const orderArg = this.getOrderArg(market);
        accountArgs.push(orderArg);
      }
    }

    if (this.props.account.state === LOGGED_IN && !!this.props.account.apiKey) {
      // However, it's required to avoid a race condition.
      // fetchMyAccountPage is called in DexAccountBalanceService.
      this.props.fetchMyAccountPage(
        this.props.account.accountId,
        this.props.account.apiKey,
        this.props.exchange.tokens
      );

      const accountArg = this.getAccountArg();
      accountArgs.push(accountArg);

      // No websocket connection until a user login.
      tickerBuffer = null;
      tradeBuffer = [];
    }

    if (this.state.initialied === false) {
      this.setup([...marketArgs, ...accountArgs], this.props.account.apiKey);
    } else {
      this.sub([...marketArgs, ...accountArgs], this.props.account.apiKey);
    }
  }

  setupSocketConnectionListener() {
    if (this.connectionListener) {
      clearInterval(this.connectionListener);
    }
    this.connectionListener = setInterval(() => {
      if (timer >= 50) {
        timer = 0;
        clearInterval(this.connectionListener);
        this.setSubscription();
      } else {
        timer += 1;
      }
    }, 10 * 1000);
  }

  sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  setup(topics = [], apiKey = '') {
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {}
    }

    (async () => {
      try {
        // ws api key is only valid one time.
        const wsApiKey = await getWsApiKey();
        this.ws = new WebSocket(`${WESOCKET_URL}?wsApiKey=${wsApiKey}`);

        this.ws.onopen = () => {
          if (topics.length > 0) {
            const data = {
              op: 'sub',
              topics: topics,
            };
            if (apiKey) {
              data.apiKey = apiKey;
              this.setState({
                initialied: true,
              });
            }
            this.setupSocketConnectionListener();
            try {
              this.ws.send(JSON.stringify(data));
            } catch (e) {
              console.log(e);
            }
          }
        };

        this.ws.onerror = (error) => {
          // Wait for 10 seconds
          (async () => {
            await this.sleep(10 * 1000);
            this.setup(topics, apiKey);
          })();
        };

        // listen to onmessage event
        this.ws.onmessage = (evt) => {
          // add the new message to state
          if (evt.data === 'ping') {
            try {
              timer = 0;
              this.ws.send('pong');
            } catch {}
          } else {
            this.parseData(evt);
          }
        };
        this.ws.onclose = () => {};
      } catch (err) {
        console.log('failed to connect ws', err);
        // TODO: a race condition
        if (retry === 0) {
          retry = 1;
          (async () => {
            await this.sleep(1 * 1000);
            this.setup(topics, apiKey);
          })();
        }
      }
    })();
  }

  getTradeArg(market) {
    return {
      topic: 'trade',
      market: market,
    };
  }

  getDepthArg(market, level) {
    return {
      topic: 'orderbook',
      market: market,
      level: level,
    };
  }

  getTickerArg(market) {
    return {
      topic: 'ticker',
      market,
    };
  }

  getAccountArg() {
    return {
      topic: 'account',
    };
  }

  getOrderArg(market) {
    return {
      topic: 'order',
      market,
    };
  }

  getUnsub(topic) {
    return {
      topic,
      unsubscribeAll: true,
    };
  }

  parseData(evt) {
    // console.log(evt);
    const parsedData = JSON.parse(evt.data);
    const parsedTopic = parsedData['topic'];
    if (parsedTopic) {
      const topic = parsedTopic.topic.toLowerCase();
      const data = parsedData['data'];
      switch (topic) {
        case 'account':
          if (
            this.props.account.state === LOGGED_IN &&
            this.props.account.accountId === data.accountId
          ) {
            const balances = balanceMap([data], this.props.exchange.tokens);
            this.props.updateBalance(balances[0]);
          }
          break;
        case 'trade':
          const newTrades = data.map((arr) => {
            const trade = arrToTrade(arr);
            return {
              market: parsedTopic.market.toUpperCase(),
              timestamp: trade.timestamp,
              side: trade.side,
              size: trade.size,
              price: Number(trade.price),
              fee: trade.fee,
            };
          });

          tradeBuffer = newTrades.concat(tradeBuffer).slice(0, 80);

          break;
        case 'ticker':
          const ticker = arrToTicker(data);
          tickerBuffer = {
            market: parsedTopic.market.toUpperCase(),
            high: ticker.high,
            low: ticker.low,
            size: config.fromWEI(
              this.props.currentMarket.baseTokenSymbol,
              ticker.size,
              this.props.exchange.tokens
            ),
            volume: config.fromWEI(
              this.props.currentMarket.quoteTokenSymbol,
              ticker.volume,
              this.props.exchange.tokens
            ),
            open: ticker.open,
            close: ticker.close,
          };

          break;
        case 'orderbook':
          const market = parsedTopic.market.toUpperCase();
          if (market === this.props.currentMarket.current.toUpperCase()) {
            const startVersion = parsedData['startVersion'];
            if (startVersion <= this.props.orderBook.version + 1) {
              const endVersion = parsedData['endVersion'];
              const asks = data.asks.map((arr) => {
                const slot = arrToDepth(arr);
                return {
                  ...slot,
                  sizeInNumber: config.fromWEI(
                    this.props.currentMarket.baseTokenSymbol,
                    slot.size,
                    this.props.exchange.tokens
                  ),
                };
              });
              const bids = data.bids.map((arr) => {
                const slot = arrToDepth(arr);
                return {
                  ...slot,
                  sizeInNumber: config.fromWEI(
                    this.props.currentMarket.baseTokenSymbol,
                    slot.size,
                    this.props.exchange.tokens
                  ),
                };
              });

              this.props.updateSocketOrderBooks(
                asks,
                bids,
                startVersion,
                endVersion,
                market,
                this.props.exchange.tokens
              );
            } else {
              this.props.fetchOrderBooks(
                this.props.currentMarket.current,
                this.props.orderBook.level,
                this.props.exchange.tokens
              );
            }
          }
          break;

        case 'order':
          if (this.props.account.state === LOGGED_IN) {
            const order = orderMap([data], this.props.exchange.tokens)[0];
            const market = parsedTopic.market.toUpperCase();
            if (market === this.props.currentMarket.current.toUpperCase()) {
              this.props.updateSocketOrder(order);
            }
            this.props.updateSocketAllOrder(order);
          }
          break;

        default:
      }
    }
  }

  sub(topics, apiKey = '') {
    if (!this.ws) {
      this.setup(topics, apiKey);
    } else {
      const unsub = {
        op: 'unsub',
        topics: topics.map((topic) => {
          return {
            topic: topic.topic,
            unsubscribeAll: true,
          };
        }),
      };
      const sub = {
        op: 'sub',
        topics: topics,
      };
      if (apiKey) {
        unsub.apiKey = apiKey;
        sub.apiKey = apiKey;
        this.setState({
          initialied: true,
        });
      }

      if (this.ws.readyState === 1) {
        this.ws.send(JSON.stringify(unsub));
        this.ws.send(JSON.stringify(sub));
      } else {
        setTimeout(() => this.sub(topics, apiKey), 500);
      }
    }
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = (state) => {
  const { pathname } = state.router.location;
  const { currentMarket, orderBook, dexAccount, exchange, myOrders } = state;
  return {
    currentMarket,
    orderBook,
    account: dexAccount.account,
    exchange,
    myOrders,
    pathname,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    extendTrades: (newTrades) => dispatch(extendTrades(newTrades)),
    fetchTradeHistory: (market) => dispatch(fetchTradeHistory(market)),
    updateBalance: (balance) => dispatch(updateBalance(balance)),
    updateTicker: (ticker) => dispatch(updateTicker(ticker)),
    fetchOrderBooks: (market, level, tokens) =>
      dispatch(fetchOrderBooks(market, level, tokens)),
    updateSocketOrderBooks: (
      sells,
      buys,
      startVersion,
      endVersion,
      market,
      tokens
    ) =>
      dispatch(
        updateSocketOrderBooks(
          sells,
          buys,
          startVersion,
          endVersion,
          market,
          tokens
        )
      ),
    updateSocketOrder: (order) => dispatch(updateSocketOrder(order)),
    updateSocketAllOrder: (order) => dispatch(updateSocketAllOrder(order)),
    emptyTrades: () => dispatch(emptyTrades()),
    emptyOrderBooks: (level) => dispatch(emptyOrderBooks(level)),
    fetchMyAccountPage: (accountId, apiKey, tokens) =>
      dispatch(fetchMyAccountPage(accountId, apiKey, tokens)),
    fetchMyOpenOrders: (accountId, limit, offset, market, apiKey, tokens) =>
      dispatch(
        fetchMyOpenOrders(accountId, limit, offset, market, apiKey, tokens)
      ),
    fetchMyHistoryOrders: (accountId, limit, offset, market, apiKey, tokens) =>
      dispatch(
        fetchMyHistoryOrders(accountId, limit, offset, market, apiKey, tokens)
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WebSocketService);
