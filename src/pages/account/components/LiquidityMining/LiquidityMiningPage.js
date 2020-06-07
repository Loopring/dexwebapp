import { connect } from "react-redux";

import { withTheme } from "styled-components";

import { Col, Row } from "antd";
import React from "react";

import LiquidityMiningHeader from "./LiquidityMiningHeader";
import LiquidityMiningMyRewardPage from "./LiquidityMiningMyRewardPage";
import LiquidityMiningSubpage from "./LiquidityMiningSubpage";

class LiquidityMiningPage extends React.Component {
  render() {
    return (
      <div
        style={{
          maxWidth: "1200px",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "40px",
        }}
      >
        <LiquidityMiningHeader tokens={this.props.exchange.tokens} />
        <Row
          gutter={{ xs: 8, sm: 16, md: 24 }}
          style={{
            marginTop: "40px",
            marginBottom: "20px",
          }}
        >
          <Col span={12}>
            <LiquidityMiningMyRewardPage market={"LRC-USDT"} />
          </Col>
          <Col span={12}>
            <LiquidityMiningMyRewardPage market={"ETH-USDT"} />
          </Col>
          {/* <Col span={8}>
            <LiquidityMiningMyRewardPage market={'KEEP-USDT'} />
          </Col> */}
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col span={12}>
            <LiquidityMiningSubpage market={"LRC-USDT"} />
          </Col>
          <Col span={12}>
            <LiquidityMiningSubpage market={"ETH-USDT"} />
          </Col>
          {/* <Col span={8}>
            <LiquidityMiningSubpage market={'KEEP-USDT'} />
          </Col> */}
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, exchange } = state;
  return { dexAccount, exchange };
};

export default withTheme(connect(mapStateToProps, null)(LiquidityMiningPage));
