import { Descriptions } from 'antd';
import { connect } from 'react-redux';
import I from 'components/I';
import Moment from 'moment';
import React from 'react';
import config from 'lightcone/config';
import styled, { withTheme } from 'styled-components';

const MarketLabel = styled.div`
  color: ${(props) => props.theme.textBright};
  font-size: 0.9rem;
  font-weight: 600;
  padding-bottom: 10px;
`;

const BackgroundDiv = styled.div`
  background: ${(props) => props.theme.foreground};
  padding: 14px;

  .ant-descriptions-item > span:first-of-type {
    width: 85px;
  }
`;

class LiquidityMiningDescription extends React.Component {
  render() {
    const theme = this.props.theme;
    const tokens = this.props.exchange.tokens;
    const tokenId = this.props.config.tokenId;
    const token = config.getTokenByTokenId(tokenId, tokens);
    const amount = config.fromWEI(
      token.symbol,
      this.props.config.amount,
      tokens,
      {
        precision: 0,
      }
    );

    const rewardTokenId = this.props.config.rewardTokenId;
    const rewardToken = config.getTokenByTokenId(rewardTokenId, tokens);

    return (
      <BackgroundDiv>
        <Descriptions column={1} title={`${this.props.market}`} size={'small'}>
          <Descriptions.Item label={<I s="Reward" />}>
            {amount} {token.symbol}
          </Descriptions.Item>
          <Descriptions.Item label={<I s="Reward Token" />}>
            {rewardToken ? rewardToken.symbol : ''}
          </Descriptions.Item>
          <Descriptions.Item label={<I s="Max Spread" />}>
            {this.props.config.maxSpread > 0
              ? `${this.props.config.maxSpread * 100}%`
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label={<I s="Activity Time" />}>
            {Moment(this.props.config.rangeFrom).format(theme.timeFormat)} -{' '}
            {Moment(this.props.config.rangeTo).format(theme.timeFormat)}
          </Descriptions.Item>
        </Descriptions>
      </BackgroundDiv>
    );
  }
}

const mapStateToProps = (state) => {
  const { exchange } = state;
  return { exchange };
};

export default withTheme(
  connect(mapStateToProps, null)(LiquidityMiningDescription)
);
