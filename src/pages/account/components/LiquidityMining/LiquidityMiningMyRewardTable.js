import { connect } from "react-redux";
import { withTheme } from "styled-components";
import I from "components/I";
import React from "react";

import { ConfigProvider, Pagination, Table } from "antd";

import Moment from "moment";
import TableLoadingSpin from "components/TableLoadingSpin";

import {
  LargeTableRow,
  SimpleTableContainer,
  TextCompactTableHeader,
} from "styles/Styles";
import EmptyTableIndicator from "components/EmptyTableIndicator";

class LiquidityMiningMyRewardTable extends React.Component {
  render() {
    const tokens = this.props.market.split("-");
    const quoteToken = tokens[1];

    const theme = this.props.theme;
    const customizeRenderEmpty = () => (
      <EmptyTableIndicator
        text={this.props.placeHolder}
        loading={this.props.loading}
        marginTop={"100px"}
      />
    );

    const columns = [
      {
        title: (
          <TextCompactTableHeader
            style={{
              paddingLeft: "14px",
            }}
          >
            <I s="Time" />
          </TextCompactTableHeader>
        ),
        dataIndex: "time",
        width: "70%",
      },
      {
        title: (
          <TextCompactTableHeader>
            <div
              style={{
                textAlign: "right",
                paddingRight: "14px",
                width: "100%",
              }}
            >
              <I s="Amount" /> ({quoteToken})
            </div>
          </TextCompactTableHeader>
        ),
        dataIndex: "amount",
      },
    ];

    const data = [];
    for (let i = 0; i < this.props.data.length; i++) {
      const reward = this.props.data[i];
      data.push({
        key: i,
        time: (
          <LargeTableRow
            style={{
              paddingLeft: "14px",
            }}
          >
            {Moment(reward["startAt"] - 3600000).format(theme.shortTimeFormat)}{" "}
            - {Moment(reward["startAt"]).format("HH:mm")}
          </LargeTableRow>
        ),
        market: <LargeTableRow>{reward["market"]}</LargeTableRow>,
        amount: (
          <LargeTableRow
            style={{
              textAlign: "right",
              paddingRight: "14px",
            }}
          >
            {reward["amount"]}
          </LargeTableRow>
        ),
      });
    }

    const hasPagination = this.props.total > this.props.limit;

    return (
      <div>
        <SimpleTableContainer
          style={{
            minHeight: "300px",
            background: theme.foreground,
          }}
        >
          <ConfigProvider
            renderEmpty={data.length === 0 && customizeRenderEmpty}
          >
            <TableLoadingSpin loading={this.props.loading}>
              <Table
                style={{
                  height: `${10 * 34 + 35}px`,
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
                  padding: "10px 0px 30px 0px",
                  background: theme.background,
                  textAlign: "center",
                }}
                size=""
                total={this.props.total}
                current={this.props.current}
                onChange={this.props.onChange}
                pageSize={this.props.limit}
                showLessItems={true}
              />
            ) : (
              <div />
            )}
          </ConfigProvider>
        </SimpleTableContainer>
      </div>
    );
  }
}

export default withTheme(connect(null, null)(LiquidityMiningMyRewardTable));
