import { connect } from "react-redux";
import { withTheme } from "styled-components";
import I from "components/I";
import React from "react";

import { ConfigProvider, Pagination, Table } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons/faCrown";
import TableLoadingSpin from "components/TableLoadingSpin";

import {
  LargeTableRow,
  SimpleTableContainer,
  TextCompactTableHeader,
} from "styles/Styles";
import EmptyTableIndicator from "components/EmptyTableIndicator";

class LiquidityMiningTable extends React.Component {
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
            <I s="Ranking" />
          </TextCompactTableHeader>
        ),
        dataIndex: "rank",
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Account ID" />
          </TextCompactTableHeader>
        ),
        dataIndex: "accountId",
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
              <I s="Rewards" /> ({quoteToken})
            </div>
          </TextCompactTableHeader>
        ),
        dataIndex: "reward",
      },
    ];

    const data = [];
    for (let i = 0; i < this.props.data.length; i++) {
      const reward = this.props.data[i];
      const rewardNum = Number(reward["rank"]);
      const icon =
        rewardNum <= 3 ? (
          <FontAwesomeIcon
            icon={faCrown}
            style={{
              margin: "auto auto auto 4px",
              color: this.props.theme.orange,
            }}
          />
        ) : (
          <div />
        );
      data.push({
        key: i,
        rank: (
          <LargeTableRow
            style={{
              paddingLeft: "14px",
            }}
          >
            {rewardNum}
          </LargeTableRow>
        ),
        accountId: (
          <LargeTableRow>
            {reward["accountId"]} {icon}
          </LargeTableRow>
        ),
        reward: (
          <LargeTableRow
            style={{
              textAlign: "right",
              paddingRight: "14px",
            }}
          >
            {reward["reward"]}
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
          }}
        >
          <ConfigProvider
            renderEmpty={data.length === 0 && customizeRenderEmpty}
          >
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
                  padding: "30px 0px 30px 0px",
                  background: theme.background,
                  textAlign: "center",
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
      </div>
    );
  }
}

export default withTheme(connect(null, null)(LiquidityMiningTable));
