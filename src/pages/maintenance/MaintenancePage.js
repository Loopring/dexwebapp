import { Layout } from 'antd';
import { connect } from 'react-redux';
import { history } from 'redux/configureStore';
import { withTheme } from 'styled-components';
import AppLayout from 'AppLayout';
import I from 'components/I';
import React from 'react';
import config from 'lightcone/config';

const { Content } = Layout;

class MaintenancePage extends React.Component {
  componentDidMount() {
    const inMaintenanceMode = config.getMaintenanceMode();
    if (inMaintenanceMode === false) {
      history.push('/');
    }
  }

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
          >
            <div
              style={{
                width: '60%',
                minHeight: '50vh',
                margin: 'auto',
                marginTop: '20vh',
                backgroundSize: 'contain',
                backgroundPosition: 'bottom',
                backgroundImage: `url("./assets/images/${theme.imgDir}/404.png")`,
                backgroundRepeat: 'no-repeat',
                backgroundBlendMode: 'color-dodge',
                transform: 'rotate(' + rotation + 'deg)',
              }}
            >
              <div
                style={{
                  fontWeight: '600',
                  fontSize: '6rem',
                  marginTop: '0%',
                  marginLeft: '20%',
                  color: theme.primary,
                  userSelect: 'none',
                  transform: 'rotate(' + rotation2 + 'deg)',
                }}
              >
                <div
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '2rem',
                    fontWeight: 'normal',
                    width: '330px',
                    color: theme.textWhite,
                  }}
                >
                  <I s="maintenanceTitle" />
                </div>
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

export default withTheme(connect(mapStateToProps, null)(MaintenancePage));
