import { Redirect, Route, Switch } from "react-router";
import React from "react";

import {
  MyBalancesPage,
  MyDepositsPage,
  MyLiquidityMiningPage,
  MyReferralRewardsPage,
  MyTransferPage,
  MyWithdrawalsPage,
} from "pages/account/AccountPages";

import {
  MyOpenOrdersPage,
  MyOrderHistoryPage,
  MyTradesPage,
} from "pages/orders/OrderPages";

import NotFoundPage from "pages/not-found/NotFoundPage";
import TopNavBar from "components/top-nav-bar/TopNavBar";
import TradePage from "pages/trade/TradePage";

const routes = (
  <div>
    <TopNavBar />
    <Switch id="side-bar-container">
      <Route exact path="/" render={() => <Redirect to="/trade/LRC-USDT" />} />
      <Route
        exact
        path="/trade"
        render={() => <Redirect to="/trade/LRC-USDT" />}
      />
      <Route exact path="/trade/:pair" component={TradePage} />
      <Route exact path="/invite" component={TradePage} />
      <Route exact path="/invite/:refer" component={TradePage} />
      <Route exact path="/orders/open-orders" component={MyOpenOrdersPage} />
      <Route
        exact
        path="/orders/order-history"
        component={MyOrderHistoryPage}
      />
      <Route exact path="/orders/trade-history" component={MyTradesPage} />
      <Route exact path="/account/transfers" component={MyTransferPage} />
      <Route exact path="/account/balances" component={MyBalancesPage} />
      <Route exact path="/account/deposits" component={MyDepositsPage} />
      <Route exact path="/account/withdrawals" component={MyWithdrawalsPage} />
      <Route
        exact
        path="/account/liquidity-mining"
        component={MyLiquidityMiningPage}
      />
      <Route
        exact
        path="/account/referral-rewards"
        component={MyReferralRewardsPage}
      />
      <Route exact path="/404" component={NotFoundPage} />
      <Route path="/*" render={() => <Redirect to="/404" />} />
    </Switch>
  </div>
);

export default routes;
