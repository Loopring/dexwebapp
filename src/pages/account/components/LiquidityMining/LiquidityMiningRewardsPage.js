import { Col, Row } from 'antd';
import { LargeTableHeader } from 'styles/Styles';
import I from 'components/I';

import { Page } from 'pages/account/components/styles/Styles';
import { connect } from 'react-redux';
import { withTheme } from 'styled-components';
import { withUserPreferences } from 'components/UserPreferenceContext';

import React from 'react';

import { getLiquidityMiningConf } from 'lightcone/api/LiquidityMiningAPI';
import { history } from 'redux/configureStore';
import Header from 'pages/account/components/Header';
import LiquidityMiningDescription from './LiquidityMiningDescription';
import LiquidityMiningMyRewardPage from './LiquidityMiningMyRewardPage';

class LiquidityMiningRewardsPage extends React.Component {
  state = {
    configs: [],
  };

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    (async () => {
      try {
        let configs = await getLiquidityMiningConf();
        this.setState({
          configs,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }

  render() {
    if (this.props.exchange.isInitialized) {
      if (this.props.dexAccount.account.state === 'LOGGED_IN') {
        let colSpan = 0;
        if (this.state.configs.length > 0) {
          colSpan = 24.0 / this.state.configs.length;
        }

        return (
          <Page>
            <Header
              tokens={this.props.exchange.tokens}
              type={'liquidity-mining'}
            />
            <LargeTableHeader>
              <div
                style={{
                  height: '24px',
                  lineHeight: '24px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: this.props.theme.textWhite,
                }}
              >
                <I s="liquidity_mining_tools_instruction" />{' '}
                <a
                  style={{
                    fontSize: '0.95rem',
                  }}
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://github.com/Loopring/hummingbot"
                >
                  hummingbot
                </a>
                {', '}
                <a
                  style={{
                    fontSize: '0.95rem',
                  }}
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://github.com/Loopring/vnpy"
                >
                  vnpy
                </a>{' '}
                <I s="and" />{' '}
                <a
                  style={{
                    fontSize: '0.95rem',
                  }}
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://www.maker.autonio.foundation/"
                >
                  NIOX
                </a>
                <I s="." />
              </div>
              <div
                style={{
                  height: '24px',
                  lineHeight: '24px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: this.props.theme.textWhite,
                }}
              >
                <I s="liquidity_mining_info_instruction" />{' '}
                <a
                  style={{
                    fontSize: '0.95rem',
                  }}
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://alpha.defiprime.com/t/liquidity-mining-on-loopring-exchange/100"
                >
                  <I s="here" />
                </a>{' '}
                <I s="and" />{' '}
                <a
                  style={{
                    fontSize: '0.95rem',
                  }}
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://medium.com/loopring-protocol/loopring-exchange-liquidity-mining-competition-748917b277e6"
                >
                  <I s="here" />
                </a>
                <I s="." />
              </div>
            </LargeTableHeader>
            <Row
              gutter={{ xs: 8, sm: 16, md: 24 }}
              style={{
                marginTop: '0px',
                marginBottom: '20px',
              }}
            >
              {this.state.configs.map((config, index) => (
                <Col span={`${colSpan}`} key={index}>
                  <LiquidityMiningDescription
                    market={config.market}
                    config={config}
                  />
                </Col>
              ))}
            </Row>
            <Row
              gutter={{ xs: 8, sm: 16, md: 24 }}
              style={{
                marginTop: '0px',
                marginBottom: '20px',
              }}
            >
              {this.state.configs.map((config, index) => (
                <Col span={`${colSpan}`} key={index}>
                  <LiquidityMiningMyRewardPage
                    market={config.market}
                    config={config}
                  />
                </Col>
              ))}
            </Row>
          </Page>
        );
      } else {
        history.push('/liquidity-mining/ranking');
        return <div />;
      }
    } else {
      return <div />;
    }
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, exchange } = state;
  return { dexAccount, exchange };
};

export default withUserPreferences(
  withTheme(connect(mapStateToProps, null)(LiquidityMiningRewardsPage))
);
