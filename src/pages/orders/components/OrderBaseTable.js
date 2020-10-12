import { connect } from "react-redux";
import I from "components/I";
import React from "react";

import { withTheme } from "styled-components";

import { ConfigProvider, Pagination, Table } from "antd";
import TableLoadingSpin from "components/TableLoadingSpin";

import {
  CancelOrderButton,
  LargeTableContainer,
  LargeTableRow,
  LargeTableRowFailed,
  LargeTableRowProcessed,
  LargeTableRowStatus,
  TextCompactTableHeader,
} from "styles/Styles";

import { cancelOrders } from "lightcone/api/v1/orders";
import { notifyError, notifySuccess } from "redux/actions/Notification";
import EmptyTableIndicator from "components/EmptyTableIndicator";
import Moment from "moment";

class OrderBaseTable extends React.Component {
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
        notifyError(<I s="Failed to cancel your order." />, this.props.theme);
      }
    })();
  };

  render() {
    const theme = this.props.theme;
    const customizeRenderEmpty = () => (
      <EmptyTableIndicator
        text={"NoHistoryOrders"}
        loading={this.props.loading}
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
            <I s="CreatedAt" />
          </TextCompactTableHeader>
        ),
        dataIndex: "createdAt",
        width: 180,
      },
      {
        title: (
          <TextCompactTableHeader
            style={{
              paddingLeft: "14px",
            }}
          >
            <I s="Market" />
          </TextCompactTableHeader>
        ),
        dataIndex: "market",
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Side" />
          </TextCompactTableHeader>
        ),
        dataIndex: "side",
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Fill Amount" />
          </TextCompactTableHeader>
        ),
        dataIndex: "fillAmount",
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Fill Pctg" />
          </TextCompactTableHeader>
        ),
        dataIndex: "filled",
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Amount" />
          </TextCompactTableHeader>
        ),
        dataIndex: "size",
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Order Price" />
          </TextCompactTableHeader>
        ),
        dataIndex: "price",
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Order Total" />
          </TextCompactTableHeader>
        ),
        dataIndex: "total",
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Fee" />
          </TextCompactTableHeader>
        ),
        dataIndex: "fee",
      },
      {
        title: (
          <TextCompactTableHeader
            style={{
              width: "100%",
              textAlign: "center",
              paddingRight: "14px",
            }}
          >
            <I s="Status / Operations" />
          </TextCompactTableHeader>
        ),
        dataIndex: "status",
      },
    ];

    const data = [];
    for (let i = 0; i < this.props.data.length; i++) {
      const order = this.props.data[i];

      var status = "-";
      if (order.status === "processing" || order.status === "waiting") {
        status = (
          <LargeTableRowStatus
            style={{
              textAlign: "left",
            }}
          >
            <CancelOrderButton
              onClick={(e) => {
                e.preventDefault();
                this.onClickCancel(order);
              }}
            >
              <I s="Cancel" />
            </CancelOrderButton>
          </LargeTableRowStatus>
        );
      } else if (order.status === "processed") {
        status = (
          <LargeTableRowProcessed
            style={{
              textAlign: "left",
            }}
          >
            <div>
              <I s="Filled" />
            </div>
          </LargeTableRowProcessed>
        );
      } else if (order.status === "failed") {
        status = (
          <LargeTableRowFailed
            style={{
              textAlign: "left",
            }}
          >
            <div>
              <I s="Failed" />
            </div>
          </LargeTableRowFailed>
        );
      } else if (
        order.status === "cancelling" ||
        order.status === "cancelled"
      ) {
        status = (
          <LargeTableRowStatus
            style={{
              textAlign: "left",
            }}
          >
            <div>
              <I s="Cancelled" />
            </div>
          </LargeTableRowStatus>
        );
      } else if (order.status === "expired") {
        status = (
          <LargeTableRowStatus>
            <div>
              <I s="Expired" />
            </div>
          </LargeTableRowStatus>
        );
      }
      data.push({
        key: i,
        side: (
          <LargeTableRow
            style={{
              color:
                order.side === "BUY" ? theme.buyPrimary : theme.sellPrimary,
            }}
          >
            {order.side === "BUY" ? <I s="Buy" /> : <I s="Sell" />}
          </LargeTableRow>
        ),
        market: (
          <LargeTableRow
            style={{
              paddingLeft: "14px",
            }}
          >
            <a href={`../trade/${order.market}`}>{order.market} </a>
          </LargeTableRow>
        ),
        size: <LargeTableRow>{order.sizeInString} </LargeTableRow>,
        filled: (
          <LargeTableRow
            style={{
              color: theme.textWhite,
            }}
          >
            {order.filled}
          </LargeTableRow>
        ),
        fillAmount: <LargeTableRow>{order.filledSizeInString} </LargeTableRow>,
        price: (
          <LargeTableRow
            style={{
              color:
                order.side === "BUY" ? theme.buyPrimary : theme.sellPrimary,
            }}
          >
            {order.price}
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
            {order.feeInString}{" "}
            {order.feeInString !== "-"
              ? order.side === "BUY"
                ? order.market.split("-")[0]
                : order.market.split("-")[1]
              : ""}
          </LargeTableRow>
        ),
        createdAt: (
          <LargeTableRow
            style={{
              paddingLeft: "14px",
              color: theme.textDim,
            }}
          >
            {Moment(order.createdAt).format(theme.timeFormat)}
          </LargeTableRow>
        ),
        status: (
          <div
            style={{
              textAlign: "center",
              paddingRight: "14px",
            }}
          >
            {status}
          </div>
        ),
      });
    }

    const hasPagination = this.props.total > this.props.limit;

    return (
      <LargeTableContainer>
        <ConfigProvider renderEmpty={data.length === 0 && customizeRenderEmpty}>
          <TableLoadingSpin loading={this.props.loading}>
            <Table
              style={{
                borderStyle: "none",
                borderWidth: "0px",
                height: `${data.length * 34 + 35}px`,
                minHeight: "500px",
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
      </LargeTableContainer>
    );
  }
}

OrderBaseTable.defaultProps = {
  loading: false,
};

const mapStateToProps = (state) => {
  const { dexAccount } = state;
  return { dexAccount };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(OrderBaseTable)
);
