import { ThemeContext } from 'styled-components';
import I from 'components/I';
import React, { useContext } from 'react';

import { ConfigProvider, Pagination, Table } from 'antd';

import Moment from 'moment';
import TableLoadingSpin from 'components/TableLoadingSpin';

import {
  LargeTableRow,
  SimpleTableContainer,
  TextCompactTableHeader,
} from 'styles/Styles';
import EmptyTableIndicator from 'components/EmptyTableIndicator';

const CommisionRewardMyRewardTable = ({
  placeHolder,
  loading,
  data,
  total,
  limit,
  current,
  onChange,
}) => {
  const theme = useContext(ThemeContext);
  const customizeRenderEmpty = () => (
    <EmptyTableIndicator
      text={placeHolder}
      loading={loading}
      marginTop={'100px'}
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
          <I s="Time" />
        </TextCompactTableHeader>
      ),
      dataIndex: 'time',
      width: '40%',
    },
    {
      title: (
        <TextCompactTableHeader>
          <div
            style={{
              textAlign: 'right',
              paddingRight: '14px',
              width: '100%',
            }}
          >
            <I s="Amount" />
          </div>
        </TextCompactTableHeader>
      ),
      dataIndex: 'amount',
    },
  ];

  const dataSource = [];
  for (let i = 0; i < data.length; i++) {
    const reward = data[i];
    dataSource.push({
      key: i,
      time: (
        <LargeTableRow
          style={{
            paddingLeft: '14px',
          }}
        >
          {Moment(reward['startAt']).format(theme.shortTimeFormat)} -{' '}
          {Moment(reward['startAt'] + 3600000).format('HH:mm')}
        </LargeTableRow>
      ),
      market: <LargeTableRow>{reward['market']}</LargeTableRow>,
      amount: (
        <LargeTableRow
          style={{
            textAlign: 'right',
            paddingRight: '14px',
          }}
        >
          {reward['amount']}
        </LargeTableRow>
      ),
    });
  }

  const hasPagination = total > limit;

  return (
    <div>
      <SimpleTableContainer
        style={{
          minHeight: '300px',
          background: theme.foreground,
        }}
      >
        <ConfigProvider
          renderEmpty={dataSource.length === 0 && customizeRenderEmpty}
        >
          <TableLoadingSpin loading={loading}>
            <Table
              style={{
                height: `${10 * 34 + 35}px`,
              }}
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              scroll={{
                y: `${dataSource.length * 34}px`,
              }}
            />
          </TableLoadingSpin>
          {hasPagination ? (
            <Pagination
              style={{
                padding: '10px 0px 30px 0px',
                background: theme.background,
                textAlign: 'center',
              }}
              size=""
              total={total}
              current={current}
              onChange={onChange}
              pageSize={limit}
              showLessItems={true}
            />
          ) : (
            <div />
          )}
        </ConfigProvider>
      </SimpleTableContainer>
    </div>
  );
};

export default CommisionRewardMyRewardTable;
