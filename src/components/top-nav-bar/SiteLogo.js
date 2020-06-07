import { Tooltip } from "antd";
import { connect } from "react-redux";

import AppLayout from "AppLayout";
import I from "components/I";
import React from "react";

import { withTheme } from "styled-components";

import config from "lightcone/config";

import SettingsPopover from "components/top-nav-bar/SettingsPopover";

class SiteLogo extends React.Component {
  state = {
    isSettingsVisible: false,
  };

  handleSettingsVisibleChange = (isSettingsVisible) => {
    this.setState({ isSettingsVisible });
  };

  render() {
    const theme = this.props.theme;
    return (
      <div
        style={{
          paddingLeft: "4px",
          fontWeight: 700,
          fontSize: "0.9rem",
          color: theme.textWhite,
          height: AppLayout.topNavBarHeight,
          lineHeight: AppLayout.topNavBarHeight,
          userSelect: "none",
        }}
      >
        <div>
          <img
            src="/assets/images/logo.svg"
            alt="Loopring"
            draggable="false"
            style={{
              width: "100px",
              height: "auto",
              marginLeft: "-8px",
              paddingRight: "8px",
              paddingBottom: "4px",
              userSelect: "none",
            }}
            onClick={() => {
              this.props.pushToTradePage();
            }}
          />
          <Tooltip
            style={{
              width: "400px",
            }}
            mouseEnterDelay={2}
            title={
              <div>
                <div>LAST_COMMIT={process.env.COMMITHASH}</div>
                <div>DEPLOYED={process.env.TIME}</div>
                <div>RELAYER={config.getRelayerHost()}</div>
              </div>
            }
          >
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 400,
                marginRight: "32px",
                minWidth: "50px",
                display: "inline-block",
                color: theme.primary,
              }}
            >
              <I s={this.props.subtitle} />
            </span>
          </Tooltip>

          <span
            style={{
              display: this.props.showSettingIcon ? "inline-block" : "none",
            }}
          >
            <SettingsPopover
              visible={this.state.isSettingsVisible}
              onVisibleChange={this.handleSettingsVisibleChange}
            />
          </span>
        </div>
      </div>
    );
  }
}

SiteLogo.defaultProps = {
  subtitle: "Beta1",
};

const mapStateToProps = (state) => {
  const { pathname } = state.router.location;
  return {
    pathname,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(SiteLogo)
);
