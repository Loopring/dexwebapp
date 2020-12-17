import { connect } from 'react-redux';
import I from 'components/I';
import React from 'react';
import styled, { withTheme } from 'styled-components';

import { ConfigProvider, Pagination, Table } from 'antd';
import Moment from 'moment';
import TableLoadingSpin from 'components/TableLoadingSpin';
import WhyIcon from 'components/WhyIcon';

import {
  DepositOutlineButton,
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

import { getEtherscanLink } from 'lightcone/api/localStorgeAPI';

const StatusFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin-right: 4px;
`;
class WithdrawalTable extends React.Component {
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
          <TextCompactTableHeader
            style={{
              paddingLeft: '14px',
            }}
          >
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
            <I s="Amount Requested" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'amount',
        width: '10%',
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Amount Withdrawn" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'realAmount',
        width: '10%',
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Fee" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'fee',
        width: '10%',
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Request Tx" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'txHash',
        width: '12%',
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Withdraw Tx" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'withdrawHash',
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
            <div
              style={{
                textAlign: 'left',
                paddingRight: '4px',
              }}
            >
              <I s="Status / Operations" />
            </div>
          </TextCompactTableHeader>
        ),
        dataIndex: 'status',
        width: '12%',
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
              <I s="Processing" /> <WhyIcon text="StatusProcessing" />
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
              <I s="Claimable" />
              <DepositOutlineButton
                style={{
                  marginLeft: '8px',
                  marginRight: '8px',
                }}
                onClick={() => this.props.claim(transaction.requestId)}
              >
                <I s="Claim" />
              </DepositOutlineButton>
            </div>
          </LargeTableRowFailed>
        );
      } else if (transaction.status === 'received') {
        status =
          this.props.blockNum - transaction.blockNum <= 30 ? (
            <LargeTableRowProcessing
              style={{ color: theme.orange, textAlign: 'left' }}
            >
              <StatusFontAwesomeIcon icon={faClock} />
              <div>
                <I s="Confirming" />(
                {Math.max(this.props.blockNum - transaction.blockNum, 0)} / 30)
                <WhyIcon text="StatusConfirming" />
              </div>
            </LargeTableRowProcessing>
          ) : (
            <LargeTableRowProcessing
              style={{ color: theme.highlight, textAlign: 'left' }}
            >
              <StatusFontAwesomeIcon icon={faCircleNotch} spin />
              <div>
                <I s="Processing" /> <WhyIcon text="StatusProcessing" />
              </div>
            </LargeTableRowProcessing>
          );
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
          <LargeTableRow>
            {transaction.amountInUI} {transaction.symbol}
          </LargeTableRow>
        ),
        realAmount: (
          <LargeTableRow>
            {transaction.realAmountInUI} {transaction.symbol}
          </LargeTableRow>
        ),
        fee: (
          <LargeTableRow
            style={{
              color: theme.textDim,
            }}
          >
            {transaction.feeInUI} ETH
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
        txHash: (
          <LargeTableRow>
            <a
              href={`${getEtherscanLink(this.props.chainId)}/tx/${
                transaction.txHash
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {transaction.txHashInUI}
            </a>
          </LargeTableRow>
        ),
        withdrawHash: (
          <LargeTableRow>
            <a
              href={`${getEtherscanLink(this.props.chainId)}/tx/${
                transaction.distributeHash
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {transaction.distributeHashInUI}
            </a>
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
  const { exchange, notifyCenter } = state;
  return { chainId: exchange.chainId, blockNum: notifyCenter.blockNum };
};

export default withTheme(connect(mapStateToProps, null)(WithdrawalTable));
