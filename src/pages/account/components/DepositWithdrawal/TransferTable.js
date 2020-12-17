import { connect } from 'react-redux';
import I from 'components/I';
import React from 'react';
import styled, { withTheme } from 'styled-components';

import { ConfigProvider, Pagination, Table, Tooltip } from 'antd';
import { getEtherscanLink } from 'lightcone/api/localStorgeAPI';
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

class TransferTable extends React.Component {
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
        width: '10%',
      },
      {
        title: (
          <TextCompactTableHeader
            style={{
              paddingLeft: '14px',
            }}
          >
            <I s="Asset" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'asset',
        width: '16%',
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Amount" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'amount',
        width: '12%',
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="From/To" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'recipient',
        width: '12%',
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Fee" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'fee',
        width: '12%',
      },
      {
        title: (
          <TextCompactTableHeader
            style={{
              width: '100%',
              textAlign: 'center',
            }}
          >
            <I s="Memo" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'memo',
        width: '14%',
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
        width: '14%',
      },
    ];

    const data = [];
    for (let i = 0; i < this.props.data.length; i++) {
      const transaction = this.props.data[i];
      var status = '-';
      if (transaction.status === 'processing') {
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
      } else if (transaction.status === 'processed') {
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
      } else if (transaction.status === 'failed') {
        status = (
          <LargeTableRowFailed style={{ color: theme.red, textAlign: 'left' }}>
            <StatusFontAwesomeIcon icon={faExclamationCircle} />
            <div>
              <I s="Failed" />
            </div>
          </LargeTableRowFailed>
        );
      } else if (transaction.status === 'received') {
        status = (
          <Tooltip placement="bottom" title={<I s={'StatusConfirming'} />}>
            <LargeTableRowProcessing
              style={{ color: theme.orange, textAlign: 'left' }}
            >
              <StatusFontAwesomeIcon icon={faClock} />

              <div>
                <I s="Confirming" />
              </div>
            </LargeTableRowProcessing>
          </Tooltip>
        );
      }

      let memo = transaction.memo;
      if (transaction.memo.toLowerCase() === 'update account reward') {
        memo = <I s="Update Account Reward" />;
      } else if (transaction.memo.toLowerCase() === 'reward') {
        memo = <I s="Reward" />;
      }

      data.push({
        key: i,
        asset: (
          <LargeTableRow
            style={{
              paddingLeft: '14px',
            }}
          >
            {transaction.symbol} - <I s={transaction.tokenName} />
          </LargeTableRow>
        ),
        amount: (
          <LargeTableRow
            style={{
              color:
                transaction.receiver === window.wallet.accountId
                  ? theme.buyPrimary
                  : theme.sellPrimary,
            }}
          >
            <span>
              {transaction.receiver === window.wallet.accountId ? '+' : '-'}
            </span>
            {transaction.amountInUI} {transaction.symbol}
          </LargeTableRow>
        ),
        recipient: (
          <LargeTableRow>
            <a
              href={`${getEtherscanLink(this.props.chainId)}/address/${
                transaction.receiver === window.wallet.accountId
                  ? transaction.senderAddress
                  : transaction.receiverAddress
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {transaction.receiver === window.wallet.accountId
                ? transaction.senderInUI
                : transaction.recipientInUI}
            </a>
          </LargeTableRow>
        ),
        fee: (
          <LargeTableRow
            style={{
              color: theme.textDim,
            }}
          >
            {transaction.feeInUI} {transaction.symbol}
          </LargeTableRow>
        ),
        date: (
          <LargeTableRow
            style={{
              paddingLeft: '14px',
              color: theme.textDim,
            }}
          >
            {Moment(transaction.timestamp).format(theme.timeFormat)}
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
        memo: (
          <LargeTableRow
            style={{
              color: theme.textDim,
            }}
          >
            {memo}
          </LargeTableRow>
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
  const { exchange, notifyCenter } = state;
  return { chainId: exchange.chainId, blockNum: notifyCenter.blockNum };
};

export default withTheme(connect(mapStateToProps, null)(TransferTable));
