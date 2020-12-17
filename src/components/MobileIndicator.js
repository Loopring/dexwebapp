import { connect } from 'react-redux';
import React from 'react';

import { withTheme } from 'styled-components';
import AppLayout from 'AppLayout';
import I from 'components/I';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Layout } from 'antd';
import { faMobile } from '@fortawesome/free-solid-svg-icons/faMobile';

const { Content } = Layout;

class MobileIndicator extends React.Component {
  render() {
    return (
      <div>
        <div
          style={{
            height: AppLayout.borderWidth,
            backgroundColor: this.props.theme.border,
          }}
        />
        <Layout
          hasSider={true}
          style={{
            height: AppLayout.simpleSecondaryPageHeight,
          }}
        >
          <Content
            width="100%"
            style={{
              padding: '0',
              backgroundColor: this.props.theme.foreground,
              borderLeftStyle: 'none',
            }}
          >
            <div
              style={{
                margin: 'auto',
                fontSize: '0.9rem',
                fontWeight: 'normal',
                color: this.props.theme.textWhite,
              }}
            >
              <FontAwesomeIcon
                icon={faMobile}
                style={{
                  display: 'block',
                  margin: 'auto',
                  marginTop: '35%',
                  marginBottom: '40px',
                  color: this.props.theme.primary,
                }}
                size="5x"
              />
              <div
                style={{
                  display: 'block',
                  width: '280px',
                  margin: 'auto',
                  marginBottom: '40px',

                  color: this.props.theme.textDim,
                }}
              >
                <p style={{ color: this.props.theme.textWhite }}>
                  <I s="MobileNotSupportedNotice" />
                </p>
                <p>
                  <I s="MobileAppNotice" />
                </p>
                <p>
                  <I s="Stay tuned!" />
                </p>
              </div>
            </div>
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

export default withTheme(connect(mapStateToProps, null)(MobileIndicator));
