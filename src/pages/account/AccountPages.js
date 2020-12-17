// React and third-partycomponents

import React from 'react';

import BalanceTable from './components/Balance/BalanceTable';
import DepositWithdrawalTable from './components/DepositWithdrawal/DepositWithdrawalTable';
import LiquidityMiningRankingsPage from './components/LiquidityMining/LiquidityMiningRankingsPage';
import LiquidityMiningRewardsPage from './components/LiquidityMining/LiquidityMiningRewardsPage';
import ReferralRewardsPage from './components/ReferralRewards/ReferralRewardsPage';

import SimpleSecondaryPageLayout from '../components/SimpleSecondaryPageLayout';

const accountSubPages = [
  {
    id: 'balances',
    label: 'Balances',
    url: '/account/balances',
  },
  {
    id: 'transfers',
    label: 'Transfers',
    url: '/account/transfers',
  },
  {
    id: 'deposits',
    label: 'Deposits',
    url: '/account/deposits',
  },
  {
    id: 'withdrawals',
    label: 'Withdrawals',
    url: '/account/withdrawals',
  },
  {
    id: 'referral-rewards',
    label: 'Maker & Referral Rewards',
    url: '/account/referral-rewards',
  },
];

const liquidityMiningSubPages = [
  {
    id: 'liquidity-mining-rewards',
    label: 'Rewards',
    url: '/liquidity-mining/rewards',
  },
  {
    id: 'liquidity-mining-ranking',
    label: 'Ranking',
    url: '/liquidity-mining/ranking',
  },
];

const MyBalancesPage = () => {
  return (
    <SimpleSecondaryPageLayout pageId="balances" navbarConfig={accountSubPages}>
      <BalanceTable />
    </SimpleSecondaryPageLayout>
  );
};

const MyTransferPage = () => {
  return (
    <SimpleSecondaryPageLayout
      pageId="transfers"
      navbarConfig={accountSubPages}
    >
      <DepositWithdrawalTable type="transfer" />
    </SimpleSecondaryPageLayout>
  );
};

const MyDepositsPage = () => {
  return (
    <SimpleSecondaryPageLayout pageId="deposits" navbarConfig={accountSubPages}>
      <DepositWithdrawalTable type="deposit" />
    </SimpleSecondaryPageLayout>
  );
};

const MyWithdrawalsPage = () => {
  return (
    <SimpleSecondaryPageLayout
      pageId="withdrawals"
      navbarConfig={accountSubPages}
    >
      <DepositWithdrawalTable type="withdrawals" />
    </SimpleSecondaryPageLayout>
  );
};

const MyLiquidityMiningRewardsPage = () => {
  return (
    <SimpleSecondaryPageLayout
      pageId="liquidity-mining-rewards"
      navbarConfig={liquidityMiningSubPages}
    >
      <LiquidityMiningRewardsPage />
    </SimpleSecondaryPageLayout>
  );
};

const MyLiquidityMiningRankingsPage = () => {
  return (
    <SimpleSecondaryPageLayout
      pageId="liquidity-mining-ranking"
      navbarConfig={liquidityMiningSubPages}
    >
      <LiquidityMiningRankingsPage />
    </SimpleSecondaryPageLayout>
  );
};

const MyReferralRewardsPage = () => {
  return (
    <SimpleSecondaryPageLayout
      pageId="referral-rewards"
      navbarConfig={accountSubPages}
    >
      <ReferralRewardsPage />
    </SimpleSecondaryPageLayout>
  );
};

export {
  MyBalancesPage,
  MyTransferPage,
  MyDepositsPage,
  MyWithdrawalsPage,
  MyLiquidityMiningRewardsPage,
  MyLiquidityMiningRankingsPage,
  MyReferralRewardsPage,
};
