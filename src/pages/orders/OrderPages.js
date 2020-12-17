import React from 'react';

import HistoryOrdersTable from './components/HistoryOrdersTable';
import HistoryTradesTable from './components/HistoryTradesTable';
import OpenOrdersTable from './components/OpenOrdersTable';
import SimpleSecondaryPageLayout from '../components/SimpleSecondaryPageLayout';

const orderSubPages = [
  {
    id: 'open-orders',
    label: 'Open Orders',
    url: '/orders/open-orders',
  },
  {
    id: 'order-history',
    label: 'Order History',
    url: '/orders/order-history',
  },
  {
    id: 'trade-history',
    label: 'Fill History',
    url: '/orders/trade-history',
  },
];

const MyOpenOrdersPage = () => {
  return (
    <SimpleSecondaryPageLayout
      pageId="open-orders"
      navbarConfig={orderSubPages}
    >
      <OpenOrdersTable />
    </SimpleSecondaryPageLayout>
  );
};

const MyOrderHistoryPage = () => {
  return (
    <SimpleSecondaryPageLayout
      pageId="order-history"
      navbarConfig={orderSubPages}
    >
      <HistoryOrdersTable />
    </SimpleSecondaryPageLayout>
  );
};

const MyTradesPage = () => {
  return (
    <SimpleSecondaryPageLayout
      pageId="trade-history"
      navbarConfig={orderSubPages}
    >
      <HistoryTradesTable />
    </SimpleSecondaryPageLayout>
  );
};

export { MyOpenOrdersPage, MyOrderHistoryPage, MyTradesPage };
