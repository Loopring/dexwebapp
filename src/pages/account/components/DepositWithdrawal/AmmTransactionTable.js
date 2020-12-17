import { connect } from 'react-redux';
import I from 'components/I';
import React from 'react';
import styled, { withTheme } from 'styled-components';

import { ConfigProvider, Pagination, Table, Tooltip } from 'antd';

import TableLoadingSpin from 'components/TableLoadingSpin';

import Moment from 'moment';

import {
  LargeTableRow,
  LargeTableRowFailed,
  LargeTableRowProcessed,
  LargeTableRowProcessing,
  SimpleTableContainer,
  TextCompactTableHeader,
} from 'styles/Styles';
import EmptyTableIndicator from 'components/EmptyTableIndicator';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';

const StatusFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin-right: 4px;
`;

class AmmTransactionTable extends React.Component {
  render() {
    const theme = this.props.theme;
    const customizeRenderEmpty = () => (
      <EmptyTableIndicator
        text={this.props.placeHolder}
        loading={this.props.loading}
      />
    );

    const columns = [
      {
        title: (
          <TextCompactTableHeader style={{ paddingLeft: '14px' }}>
            <I s="Timestamp" />
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
            <I s="Pool Name" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'poolName',
        width: '15%',
      },
      {
        title: (
          <TextCompactTableHeader
            style={{
              paddingLeft: '0px',
            }}
          >
            <I s="Type" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'txType',
        width: '15%',
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="AMM Amount" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'amount',
        width: '15%',
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Pooled Tokens" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'pooledToken0',
        width: '15%',
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'pooledToken1',
        width: '15%',
      },
      {
        title: (
          <TextCompactTableHeader
            style={{
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                textAlign: 'left',
                paddingRight: '14px',
              }}
            >
              <I s="Status" />
            </div>
          </TextCompactTableHeader>
        ),
        dataIndex: 'status',
        width: '15%',
      },
    ];

    const data = [];
    for (let i = 0; i < this.props.data.length; i++) {
      const transaction = this.props.data[i];
      var status = '-';
      if (transaction.txStatus === 'TX_STATUS_PROCESSING') {
        status = (
          <LargeTableRowProcessing
            style={{ color: theme.highlight, textAlign: 'left' }}
          >
            <StatusFontAwesomeIcon icon={faCircleNotch} spin />
            <div>
              <I s="Processing" />
            </div>
          </LargeTableRowProcessing>
        );
      } else if (transaction.txStatus === 'TX_STATUS_PROCESSED') {
        status = (
          <LargeTableRowProcessed
            style={{ color: theme.green, textAlign: 'left' }}
          >
            <StatusFontAwesomeIcon icon={faCheckCircle} />
            <div>
              <I s="Succeeded" />
            </div>
          </LargeTableRowProcessed>
        );
      } else if (transaction.txStatus === 'TX_STATUS_FAILED') {
        status = (
          <LargeTableRowFailed style={{ color: theme.red, textAlign: 'left' }}>
            <StatusFontAwesomeIcon icon={faExclamationCircle} />
            <div>
              <I s="Failed" />
            </div>
          </LargeTableRowFailed>
        );
      } else if (transaction.txStatus === 'TX_STATUS_RECEIVED') {
        status = (
          <Tooltip placement="bottom" title={<I s={'StatusConfirming'} />}>
            <LargeTableRowProcessing
              style={{ color: theme.orange, textAlign: 'left' }}
            >
              <StatusFontAwesomeIcon icon={faClock} />
              <div>
                <I s="Confirming" />s
              </div>
            </LargeTableRowProcessing>
          </Tooltip>
        );
      }

      let txType = '-';
      if (transaction.txType === 'AMM_JOIN') {
        txType = <I s="Pool Join" />;
      } else if (transaction.txType === 'AMM_EXIT') {
        txType = <I s="Pool Exit" />;
      }

      let amountColor = theme.textDim;
      if (transaction.txStatus === 'TX_STATUS_PROCESSING') {
        amountColor = theme.textDim;
      } else if (transaction.txType === 'AMM_JOIN') {
        amountColor = theme.buyPrimary;
      } else if (transaction.txType === 'AMM_EXIT') {
        amountColor = theme.sellPrimary;
      }

      let pooledTokenColor = theme.textWhite;
      if (transaction.txStatus === 'TX_STATUS_PROCESSING') {
        pooledTokenColor = theme.textDim;
      }

      data.push({
        key: i,
        poolName: (
          <LargeTableRow
            style={{
              paddingLeft: '14px',
              color: theme.textWhite,
            }}
          >
            <span>{transaction.poolName.toUpperCase()}</span>
          </LargeTableRow>
        ),
        txType: (
          <LargeTableRow
            style={{
              color: theme.textWhite,
            }}
          >
            <span>{txType}</span>
          </LargeTableRow>
        ),
        amount: (
          <LargeTableRow
            style={{
              color: amountColor,
            }}
          >
            {transaction.txStatus === 'TX_STATUS_PROCESSING' ? (
              <div>{'-'}</div>
            ) : (
              <div>
                <span>{transaction.txType === 'AMM_JOIN' ? '+' : '-'}</span>
                {transaction.amountInUI} {transaction.symbol}
              </div>
            )}
          </LargeTableRow>
        ),
        pooledToken0: (
          <LargeTableRow
            style={{
              color: pooledTokenColor,
            }}
          >
            {transaction.transfers && transaction.transfers.length == 3 ? (
              <div>
                {transaction.transfers[0].amountInUI}{' '}
                {transaction.transfers[0].tokenSymbol}
              </div>
            ) : (
              <div>{'-'}</div>
            )}
          </LargeTableRow>
        ),
        pooledToken1: (
          <LargeTableRow
            style={{
              color: pooledTokenColor,
            }}
          >
            {transaction.transfers && transaction.transfers.length == 3 ? (
              <div>
                {transaction.transfers[1].amountInUI}{' '}
                {transaction.transfers[1].tokenSymbol}
              </div>
            ) : (
              <div>{''}</div>
            )}
          </LargeTableRow>
        ),
        date: (
          <LargeTableRow
            style={{
              paddingLeft: '14px',
              color: theme.textDim,
            }}
          >
            {Moment(transaction.createdAt).format(theme.timeFormat)}
          </LargeTableRow>
        ),
        status: (
          <div
            style={{
              textAlign: 'center',
              paddingRight: '14px',
            }}
          >
            {status}
          </div>
        ),
      });
    }

    const hasPagination = this.props.total > this.props.limit;

    return (
      <SimpleTableContainer>
        <ConfigProvider renderEmpty={data.length === 0 && customizeRenderEmpty}>
          <TableLoadingSpin loading={this.props.loading}>
            <Table
              style={{
                height: `${data.length * 34 + 35}px`,
              }}
              columns={columns}
              dataSource={data}
              pagination={false}
              scroll={{
                y: `${data.length * 34}px`,
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
              total={this.props.total}
              current={this.props.current}
              onChange={this.props.onChange}
              pageSize={this.props.limit}
            />
          ) : (
            <div />
          )}
        </ConfigProvider>
      </SimpleTableContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { exchange } = state;
  return { chainId: exchange.chainId };
};

export default withTheme(connect(mapStateToProps, null)(AmmTransactionTable));
