import { connect } from 'react-redux';
import { history } from 'redux/configureStore';
import I from 'components/I';
import React from 'react';

import { withTheme } from 'styled-components';

import { ConfigProvider, Pagination, Table } from 'antd';
import Header from './Header';
import TableLoadingSpin from 'components/TableLoadingSpin';

import Moment from 'moment';

import {
  LargeTableContainer,
  LargeTableRow,
  TextCompactTableHeader,
} from 'styles/Styles';
import EmptyTableIndicator from 'components/EmptyTableIndicator';

import { compareDexAccounts } from 'components/services/utils';
import { fetchUserTransactions } from 'redux/actions/MyOrderPage';

import { LOGGED_IN } from 'redux/actions/DexAccount';

class HistoryTradesTable extends React.Component {
  componentDidMount() {
    try {
      this.loadData();
    } catch (error) {}
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (this.props.exchange.isInitialized !== prevProps.exchange.isInitialized ||
        !compareDexAccounts(prevProps.dexAccount, this.props.dexAccount)) &&
      this.props.dexAccount.account.apiKey
    ) {
      this.loadData();
    }

    if (
      this.props.exchange.isInitialized &&
      prevProps.myOrderPage.marketFilter !==
        this.props.myOrderPage.marketFilter &&
      this.props.dexAccount.account.apiKey
    ) {
      this.loadData();
    }
  }

  loadData(offset = -1) {
    const {
      dexAccount,
      exchange,
      myOrderPage,
      fetchUserTransactions,
    } = this.props;

    if (
      exchange.isInitialized &&
      !!dexAccount.account.accountId &&
      dexAccount.account.state === LOGGED_IN &&
      dexAccount.account.apiKey
    ) {
      // If All, tokenSymbol is undefined.
      let market;
      if (myOrderPage.marketFilter !== 'All') {
        market = myOrderPage.marketFilter;
      }

      fetchUserTransactions(
        dexAccount.account.accountId,
        market,
        myOrderPage.transactionsLimit,
        offset !== -1 ? offset : myOrderPage.transactionsOffset,
        dexAccount.account.apiKey,
        exchange.tokens
      );
    }
  }

  onChange = (page) => {
    const offset = this.props.myOrderPage.transactionsLimit * (page - 1);
    this.loadData(offset);
  };

  render() {
    const theme = this.props.theme;
    const current =
      Math.floor(
        this.props.myOrderPage.transactionsOffset /
          this.props.myOrderPage.transactionsLimit
      ) + 1;

    const customizeRenderEmpty = () => (
      <EmptyTableIndicator
        text={'NoHistoryOrders'}
        loading={this.props.myOrderPage.isTransactionsLoading}
      />
    );

    const columns = [
      {
        title: (
          <TextCompactTableHeader
            style={{
              paddingLeft: '14px',
            }}
          >
            <I s="Filled At" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'date',
        width: '15%',
      },
      {
        title: (
          <TextCompactTableHeader
            style={{
              paddingLeft: '14px',
            }}
          >
            <I s="Market" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'market',
        width: '10%',
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Side" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'side',
        width: '8%',
      },

      {
        title: (
          <TextCompactTableHeader>
            <I s="Fill Amount" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'size',
        width: '15%',
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Price" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'price',
        width: '15%',
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Order Total" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'total',
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Fee" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'fee',
        width: '15%',
      },
    ];

    const data = [];
    for (let i = 0; i < this.props.myOrderPage.transactions.length; i++) {
      const order = this.props.myOrderPage.transactions[i];

      data.push({
        key: i,
        side: (
          <LargeTableRow
            style={{
              color:
                order.side === 'BUY' ? theme.buyPrimary : theme.sellPrimary,
            }}
          >
            {order.side === 'BUY' ? <I s="Buy" /> : <I s="Sell" />}
          </LargeTableRow>
        ),
        market: (
          <LargeTableRow
            style={{
              paddingLeft: '14px',
            }}
          >
            <a
              onClick={() => {
                history.push(`/trade/${order.market}`);
              }}
            >
              {order.market}{' '}
            </a>
          </LargeTableRow>
        ),
        size: (
          <LargeTableRow>
            {order.sizeInString} {order.market.split('-')[0]}
          </LargeTableRow>
        ),
        price: (
          <LargeTableRow
            style={{
              color:
                order.side === 'BUY' ? theme.buyPrimary : theme.sellPrimary,
            }}
          >
            {Number(order.price)} {order.market.split('-')[1]}
          </LargeTableRow>
        ),
        total: (
          <LargeTableRow>
            {order.totalInString} {order.quoteToken}
          </LargeTableRow>
        ),
        fee: (
          <LargeTableRow
            style={{
              color: theme.textDim,
            }}
          >
            {order.feeInString}{' '}
            {order.side === 'BUY'
              ? order.market.split('-')[0]
              : order.market.split('-')[1]}
          </LargeTableRow>
        ),
        date: (
          <LargeTableRow
            style={{
              color: theme.textDim,
              textAlign: 'left',
              paddingLeft: '14px',
            }}
          >
            {Moment(order.timestamp).format(theme.timeFormat)}
          </LargeTableRow>
        ),
      });
    }

    const hasPagination =
      this.props.myOrderPage.transactionsTotalNum >
      this.props.myOrderPage.transactionsLimit;

    return (
      <div>
        <Header />
        <LargeTableContainer>
          <ConfigProvider
            renderEmpty={data.length === 0 && customizeRenderEmpty}
          >
            <TableLoadingSpin
              loading={this.props.myOrderPage.isTransactionsLoading}
            >
              <Table
                style={{
                  borderStyle: 'none',
                  borderWidth: '0px',
                  height: `${
                    this.props.myOrderPage.transactions.length * 34 + 35
                  }px`,
                  minHeight: '500px',
                }}
                columns={columns}
                dataSource={data}
                pagination={false}
                scroll={{
                  y: `${this.props.myOrderPage.transactions.length * 34}px`,
                }}
              />
            </TableLoadingSpin>
            {hasPagination ? (
              <Pagination
                style={{
                  padding: '30px 0px 30px 0px',
                  background: theme.background,
                  textAlign: 'center',
                }}
                size=""
                total={this.props.myOrderPage.transactionsTotalNum}
                current={current}
                onChange={this.onChange}
                pageSize={this.props.myOrderPage.transactionsLimit}
              />
            ) : (
              <div />
            )}
          </ConfigProvider>
        </LargeTableContainer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, myOrderPage, exchange } = state;
  return { dexAccount, myOrderPage, exchange };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserTransactions: (accountId, market, limit, offset, apiKey, tokens) =>
      dispatch(
        fetchUserTransactions(accountId, market, limit, offset, apiKey, tokens)
      ),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(HistoryTradesTable)
);
