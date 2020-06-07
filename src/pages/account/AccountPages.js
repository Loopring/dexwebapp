// React and third-partycomponents

import React from "react";

import BalanceTable from "./components/Balance/BalanceTable";
import DepositWithdrawalTable from "./components/DepositWithdrawal/DepositWithdrawalTable";
import LiquidityMiningPage from "./components/LiquidityMining/LiquidityMiningPage";
import ReferralRewardsPage from "./components/ReferralRewards/ReferralRewardsPage";

import SimpleSecondaryPageLayout from "../components/SimpleSecondaryPageLayout";

const accountSubPages = [
  {
    id: "balances",
    label: "Balances",
    url: "/account/balances",
  },
  {
    id: "transfers",
    label: "Transfers",
    url: "/account/transfers",
  },
  {
    id: "deposits",
    label: "Deposits",
    url: "/account/deposits",
  },
  {
    id: "withdrawals",
    label: "Withdrawals",
    url: "/account/withdrawals",
  },
  {
    id: "liquidity-mining",
    label: "Liquidity Mining",
    url: "/account/liquidity-mining",
  },
  /*
  {
    id: 'referral-rewards',
    label: 'Referral Rewards',
    url: '/account/referral-rewards',
  }
  */
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

const MyLiquidityMiningPage = () => {
  return (
    <SimpleSecondaryPageLayout
      pageId="liquidity-mining"
      navbarConfig={accountSubPages}
    >
      <LiquidityMiningPage />
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
  MyLiquidityMiningPage,
  MyReferralRewardsPage,
};
