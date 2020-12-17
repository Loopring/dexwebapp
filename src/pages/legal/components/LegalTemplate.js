import { Layout } from 'antd';
import { Scroller } from 'styles/Styles';
import { connect } from 'react-redux';
import { withTheme } from 'styled-components';
import AppLayout from 'AppLayout';

import React from 'react';

const { Content, Sider } = Layout;

class LegalTemplate extends React.Component {
  render() {
    const theme = this.props.theme;
    return (
      <div>
        <Layout
          hasSider
          style={{
            height: AppLayout.simpleSecondaryPageHeight,
          }}
        >
          <Sider
            width={AppLayout.tradePanelWidth}
            style={{
              background: theme.sidePanelBackground,
              borderStyle: 'none',
            }}
            trigger={null}
            breakpoint="sm"
            collapsedWidth="0"
          >
            <Scroller
              style={{
                borderTop: '1px solid ' + theme.seperator,
              }}
            >
              {this.props.navigation}
            </Scroller>
          </Sider>
          <Content
            width="100%"
            style={{
              backgroundColor: theme.legalIframeBackground,
              borderStyle: 'none',
              padding: '0',
              margin: '0',
            }}
          >
            <iframe
              title="termly"
              src={this.props.src}
              frameBorder="0"
              style={{
                borderRadius: '2px',
                background: theme.legalIframeBackground,
                overflow: 'hidden',
                height: '100%',
                width: '100%',
              }}
            />
          </Content>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { layoutManager } = state;
  return { layoutManager };
};

export default withTheme(connect(mapStateToProps, null)(LegalTemplate));
