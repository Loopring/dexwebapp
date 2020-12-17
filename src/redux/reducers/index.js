import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { AmmMarketsReducer } from './swap/AmmMarkets';
import { AuthereumReducer } from './Authereum';
import { CommissionRewardReducer } from './CommissionReward';
import { DexAccountReducer } from './DexAccount';
import { ExchangeInfoReducer } from './ExchangeInfo';
import { GasPriceReducer } from './GasPrice';
import { LayoutManagerReducer } from './LayoutManager';
import { LegalPriceReducer } from './LegalPrice';
import { LiquidityMiningReducer } from './LiquidityMining';
import { MetaMaskReducer } from './MetaMask';
import { MewConnectReducer } from './MewConnect';
import { ModalManagerReducer } from './ModalManager';
import { MyAccountPageReducer } from './MyAccountPage';
import { MyOrderPageReducer } from './MyOrderPage';
import { MyOrdersReducer } from './MyOrders';
import { NonceReducer } from './Nonce';
import { TabsReducer } from './Tabs';
import { TradePanelReducer } from './TradePanel';
import { UserPreferenceManagerReducer } from './UserPreferenceManager';
import { WalletConnectReducer } from './WalletConnect';
import { WalletLinkReducer } from './WalletLink';

// markets
import { CurrentMarketReducer } from './market/CurrentMarket';
import { NotifyCenterReducer } from './NotifyCenter';
import { OrderBookReducer } from './market/OrderBook';
import { TickerReducer } from './market/Ticker';
import { TradeHistoryReducer } from './market/TradeHistory';

// Swap
import { CurrentSwapFormReducer } from './swap/CurrentSwapForm';

const rootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    exchange: ExchangeInfoReducer,
    tabs: TabsReducer,
    tradePanel: TradePanelReducer,
    layoutManager: LayoutManagerReducer,
    liquidityMining: LiquidityMiningReducer,
    currentMarket: CurrentMarketReducer,
    orderBook: OrderBookReducer,
    tradeHistory: TradeHistoryReducer,
    ticker: TickerReducer,
    modalManager: ModalManagerReducer,
    balances: MyAccountPageReducer,
    myOrders: MyOrdersReducer,
    myOrderPage: MyOrderPageReducer,
    metaMask: MetaMaskReducer,
    walletConnect: WalletConnectReducer,
    walletLink: WalletLinkReducer,
    mewConnect: MewConnectReducer,
    authereum: AuthereumReducer,
    dexAccount: DexAccountReducer,
    nonce: NonceReducer,
    gasPrice: GasPriceReducer,
    legalPrice: LegalPriceReducer,
    commissionReward: CommissionRewardReducer,
    userPreferences: UserPreferenceManagerReducer,
    notifyCenter: NotifyCenterReducer,
    ammMarkets: AmmMarketsReducer,
    swapForm: CurrentSwapFormReducer,
  });

export default rootReducer;
