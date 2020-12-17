import { Layout } from 'antd';
import { connect } from 'react-redux';
import { withTheme } from 'styled-components';
import AppLayout from 'AppLayout';

import React from 'react';
const { Content } = Layout;

class SwapPage extends React.Component {
  render() {
    const theme = this.props.theme;
    const rotation = -Math.random() * 45;
    const rotation2 = -rotation;
    return (
      <div>
        <div
          style={{
            height: AppLayout.borderWidth,
            backgroundColor: theme.seperator,
          }}
        />
        <Layout
          hasSider={false}
          style={{
            height: AppLayout.simpleSecondaryPageHeight,
          }}
        >
          <Content
            width="100%"
            style={{
              paddingTop: '0px',
              backgroundColor: theme.foreground,
              borderLeftStyle: 'none',
            }}
          ></Content>
        </Layout>
      </div>
    );
  }
}

export default withTheme(connect(null, null)(SwapPage));
