import { Redirect, Route, Switch } from 'react-router';
import React from 'react';

import {
  MyBalancesPage,
  MyDepositsPage,
  MyLiquidityMiningRankingsPage,
  MyLiquidityMiningRewardsPage,
  MyReferralRewardsPage,
  MyTransferPage,
  MyWithdrawalsPage,
} from 'pages/account/AccountPages';

import {
  MyOpenOrdersPage,
  MyOrderHistoryPage,
  MyTradesPage,
} from 'pages/orders/OrderPages';

import {
  CookiePolicyPage,
  DisclaimerPage,
  PrivacyPolicyPage,
  TermsPage,
} from 'pages/legal/LegalPages';

import {
  SupportDaiPage,
  SupportEthPage,
  SupportLinkPage,
  SupportLrcPage,
  SupportUsdtPage,
  SystenStatusPage,
} from 'pages/support/SupportPages';

import { FeesPage } from 'pages/docs/DocumentPages';

import MaintenancePage from 'pages/maintenance/MaintenancePage';
import NotFoundPage from 'pages/not-found/NotFoundPage';
import TopNavBar from 'components/top-nav-bar/TopNavBar';
import TradePage from 'pages/trade/TradePage';

import { getLastTradePage } from 'lightcone/api/localStorgeAPI';

const routes = (
  <div>
    <TopNavBar />
    <Switch id="side-bar-container">
      <Route
        exact
        path="/"
        render={() => {
          let lastTradePage = getLastTradePage();
          return <Redirect to={`/trade/${lastTradePage}`} />;
        }}
      />
      <Route
        exact
        path="/trade"
        render={() => {
          let lastTradePage = getLastTradePage();
          return <Redirect to={`/trade/${lastTradePage}`} />;
        }}
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
      <Route
        path="/orders/*"
        render={() => {
          return <Redirect to={'/orders/open-orders'} />;
        }}
      />

      <Route exact path="/account/transfers" component={MyTransferPage} />
      <Route exact path="/account/balances" component={MyBalancesPage} />
      <Route exact path="/account/deposits" component={MyDepositsPage} />
      <Route exact path="/account/withdrawals" component={MyWithdrawalsPage} />
      <Route
        exact
        path="/account/referral-rewards"
        component={MyReferralRewardsPage}
      />
      <Route
        exact
        path="/account/liquidity-mining"
        render={() => {
          return <Redirect to={'/account/balances'} />;
        }}
      />
      <Route
        path="/account/*"
        render={() => {
          return <Redirect to={'/account/balances'} />;
        }}
      />
      <Route
        exact
        path="/liquidity-mining/rewards"
        component={MyLiquidityMiningRewardsPage}
      />
      <Route
        exact
        path="/liquidity-mining/ranking"
        component={MyLiquidityMiningRankingsPage}
      />
      <Route exact path="/swap" componnet={MyLiquidityMiningRankingsPage} />
      <Route exact path="/support/system-status" component={SystenStatusPage} />
      <Route exact path="/support/eth" component={SupportEthPage} />
      <Route exact path="/support/lrc" component={SupportLrcPage} />
      <Route exact path="/support/usdt" component={SupportUsdtPage} />
      <Route exact path="/support/dai" component={SupportDaiPage} />
      <Route exact path="/support/link" component={SupportLinkPage} />
      <Route exact path="/legal/terms" component={TermsPage} />
      <Route exact path="/legal/disclaimer" component={DisclaimerPage} />
      <Route exact path="/legal/privacy-policy" component={PrivacyPolicyPage} />
      <Route exact path="/legal/cookie-policy" component={CookiePolicyPage} />
      <Route exact path="/document/fees" component={FeesPage} />
      <Route exact path="/maintenance" component={MaintenancePage} />
      <Route exact path="/404" component={NotFoundPage} />
      <Route path="/*" render={() => <Redirect to="/404" />} />
    </Switch>
  </div>
);

export default routes;
