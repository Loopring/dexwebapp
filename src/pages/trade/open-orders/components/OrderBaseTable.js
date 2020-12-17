import { connect } from 'react-redux';
import I from 'components/I';
import React from 'react';

import AppLayout from 'AppLayout';

import styled, { withTheme } from 'styled-components';

import { ConfigProvider, Pagination, Table } from 'antd';
import TableLoadingSpin from 'components/TableLoadingSpin';

import {
  CancelOrderButton,
  LargeTableRow,
  TextCompactTableHeader,
} from 'styles/Styles';

import { cancelOrders } from 'lightcone/api/v1/orders';
import EmptyTableIndicator from 'components/EmptyTableIndicator';
import Moment from 'moment';

import { notifyError, notifySuccess } from 'redux/actions/Notification';

const SmallPagination = styled(Pagination)`
  padding: 2px 8px !important;
  text-align: right;
`;

const TableWrapper = styled.div`
  .ant-table > tr > th {
    padding: 6px 8px 5px 8px;
  }

  .ant-table-container table > thead > tr:first-child th:last-child {
    text-align: center;
  }

  .ant-table-thead > tr:first-child > th:last-child {
    text-align: center;
  }

  .ant-table-tbody > tr > td {
    border-style: none;
    padding: 3px 8px;
    line-height: 22px;
    font-size: 0.9rem;
    background: transparent;
  }
`;

class OrderBaseTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    // Hide filled pctg when the width is between 992 and 1300
    let hideFilledPctg =
      window.innerWidth > 992 && window.innerWidth < 1430 ? true : false;
    this.state = {
      columns: this.getColumns(hideFilledPctg),
      isMounted: false,
    };
    this.updateColumn = this.updateColumn.bind(this);
    this.mql = window.matchMedia('(min-width: 992px) and (max-width: 1430px)');
    this.mql.addListener(this.updateColumn);
    this.updateColumn(this.mql);
  }

  componentDidMount() {
    this.setState({
      isMounted: true,
    });
  }

  componentWillUnmount() {
    this.setState({
      isMounted: false,
    });
    window.removeEventListener('resize', this.updateColumn);
  }

  updateColumn(e) {
    if (this.state.isMounted) {
      this.setState({
        columns: this.getColumns(e.matches),
      });
    }
  }

  onClickCancel = (order) => {
    // Send cancel request...
    (async () => {
      try {
        const apiKey = this.props.dexAccount.account.apiKey;

        const signed = window.wallet.submitFlexCancel(
          order.hash,
          order.clientOrderId
        );

        await cancelOrders(
          this.props.dexAccount.account.accountId,
          signed.orderHash,
          signed.clientOrderId,
          signed.signature,
          apiKey
        );
        notifySuccess(
          <I s="Your order has been cancelled." />,
          this.props.theme
        );
      } catch (err) {
        console.error('failed to cancel order', err);
        notifyError(<I s="Failed to cancel your order." />, this.props.theme);
      }
    })();
  };

  getColumns(hideFilledPctg) {
    let columns = [
      {
        title: (
          <TextCompactTableHeader style={{ paddingLeft: '14px' }}>
            <I s="CreatedAt" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'date',
        width: 110,
      },
      {
        title: '',
        dataIndex: 'padding',
        width: 13,
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Market" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'market',
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Side" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'side',
        // When the width is larger than 1600px
        width: window.innerWidth >= 1600 ? null : 50,
      },

      {
        title: (
          <TextCompactTableHeader>
            <I s="Amount" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'size',
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Order Price" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'price',
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
            <I s="Status / Operations" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'status',
      },
    ];

    if (!hideFilledPctg) {
      let fill_pctg = {
        title: (
          <TextCompactTableHeader>
            <I s="Fill Pctg" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'fill_pctg',
      };
      columns.splice(6, 0, fill_pctg);
    }
    return columns;
  }

  render() {
    const theme = this.props.theme;
    const emptyTableIndicator = () => (
      <EmptyTableIndicator
        text={'NoOpenOrders'}
        marginTop={'4%'}
        loading={this.props.loading}
      />
    );

    const data = [];
    for (let i = 0; i < this.props.data.length; i++) {
      const order = this.props.data[i];

      var status = '-';
      if (order.status === 'processing' || order.status === 'waiting') {
        status = (
          <CancelOrderButton
            onClick={(e) => {
              e.preventDefault();
              this.onClickCancel(order);
            }}
          >
            <I s="Cancel" />
          </CancelOrderButton>
        );
      } else if (order.status === 'processed') {
        status = <I s="Filled" />;
      } else if (order.status === 'failed') {
        status = <I s="Failed" />;
      } else if (
        order.status === 'cancelling' ||
        order.status === 'cancelled'
      ) {
        status = <I s="Cancelled" />;
      } else if (order.status === 'expired') {
        status = <I s="Expired" />;
      }
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
        market: <LargeTableRow>{order.market}</LargeTableRow>,
        size: (
          <LargeTableRow>
            {isNaN(order.sizeInString) ? '--' : order.sizeInString}
          </LargeTableRow>
        ),
        fill_pctg: (
          <LargeTableRow
            style={{
              color: theme.textWhite,
            }}
          >
            {isNaN(order.filled.substr(0, order.filled.length - 1))
              ? '--'
              : order.filled}
          </LargeTableRow>
        ),
        price: (
          <LargeTableRow
            style={{
              color:
                order.side === 'BUY' ? theme.buyPrimary : theme.sellPrimary,
            }}
          >
            {order.price}
          </LargeTableRow>
        ),
        total: (
          <LargeTableRow>
            {isNaN(order.totalInString)
              ? '--'
              : `${order.totalInString} ${order.quoteToken}`}
          </LargeTableRow>
        ),
        date: (
          <LargeTableRow
            style={{
              paddingLeft: '14px',
              color: theme.textDim,
            }}
          >
            {Moment(order.createdAt).format(theme.timeFormat)}
          </LargeTableRow>
        ),
        status: (
          <LargeTableRow
            style={{
              color: theme.textDim,
              textAlign: 'center',
            }}
          >
            {status}
          </LargeTableRow>
        ),
      });
    }

    return (
      <TableWrapper>
        <ConfigProvider renderEmpty={data.length === 0 && emptyTableIndicator}>
          <TableLoadingSpin loading={this.props.loading}>
            <Table
              style={{
                borderStyle: 'none',
                borderWidth: '0px',
                height:
                  this.props.total > this.props.limit
                    ? AppLayout.tradeOrderBaseTableHeight
                    : AppLayout.tradeOrderBaseTableHeightNoPagination,
              }}
              size="middle"
              tableLayout={'fixed'}
              columns={this.state.columns}
              dataSource={data}
              pagination={false}
              scroll={{
                y:
                  this.props.total > this.props.limit
                    ? AppLayout.tradeOrderBaseTableScrollY
                    : AppLayout.tradeOrderBaseTableScrollYNoPagination,
              }}
            />
          </TableLoadingSpin>
          {this.props.total > this.props.limit ? (
            <SmallPagination
              size="small"
              style={{ background: theme.spreadAggregationBackground }}
              total={this.props.total}
              current={this.props.current}
              onChange={this.props.onChange}
              pageSize={this.props.limit}
            />
          ) : (
            <div />
          )}
        </ConfigProvider>
      </TableWrapper>
    );
  }
}

OrderBaseTable.defaultProps = {
  loading: false,
};

const mapStateToProps = (state) => {
  const { dexAccount, myOrders, market } = state;
  return { dexAccount, myOrders, market };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(OrderBaseTable)
);
