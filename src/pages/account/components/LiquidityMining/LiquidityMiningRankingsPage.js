import { Col, Row } from 'antd';
import { Page } from 'pages/account/components/styles/Styles';
import { connect } from 'react-redux';
import { withTheme } from 'styled-components';
import { withUserPreferences } from 'components/UserPreferenceContext';
import React from 'react';

import { getLiquidityMiningConf } from 'lightcone/api/LiquidityMiningAPI';
import LiquidityMiningDescription from './LiquidityMiningDescription';
import LiquidityMiningSubpage from './LiquidityMiningSubpage';

class LiquidityMiningRankingsPage extends React.Component {
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
    let colSpan = 0;
    if (this.state.configs.length > 0) {
      colSpan = 24.0 / this.state.configs.length;
    }

    return (
      <Page>
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
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          {this.state.configs.map((config, index) => (
            <Col span={`${colSpan}`} key={index}>
              <LiquidityMiningSubpage market={config.market} config={config} />
            </Col>
          ))}
        </Row>
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, exchange } = state;
  return { dexAccount, exchange };
};

export default withUserPreferences(
  withTheme(connect(mapStateToProps, null)(LiquidityMiningRankingsPage))
);
