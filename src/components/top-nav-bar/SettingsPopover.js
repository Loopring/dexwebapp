import { connect } from "react-redux";
import I from "components/I";
import React from "react";
import styled, { withTheme } from "styled-components";

import { Button, Col, Popover, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdjust } from "@fortawesome/free-solid-svg-icons/faAdjust";
import { faBrush } from "@fortawesome/free-solid-svg-icons/faBrush";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import { faCoins } from "@fortawesome/free-solid-svg-icons/faCoins";
import { faGlobeAsia } from "@fortawesome/free-solid-svg-icons/faGlobeAsia";

import { faMoon } from "@fortawesome/free-solid-svg-icons/faMoon";
import { faSun } from "@fortawesome/free-solid-svg-icons/faSun";

import {
  selectCurrency,
  selectLanguage,
  selectTheme,
} from "redux/actions/UserPreferenceManager";
import { updateCmcLegal } from "redux/actions/CmcPrice";
import { withUserPreferences } from "components/UserPreferenceContext";

const OptionButton = styled(Button)`
  font-size: 0.8rem !important;
  font-weight: 600 !important;
  border: none !important;
  background-color: ${(props) => props.theme.buttonBackground}!important;
  margin: 16px 8px;
  padding: 0;
  border-radius: 4px;
  height: 24px;
  width: 24px;
  color: ${(props) => props.theme.textBigButton}!important;
  border: none !important;
  &[disabled],
  &:hover {
    border: none;
    background-color: ${(props) => props.theme.primary}!important;
  }
  &[disabled] {
    color: ${(props) => props.theme.textBigButton}!important;
  }
`;

var autoThemeJob = null;

class SettingsPopover extends React.Component {
  changeLanguage = (value) => {
    if (value === "en" || value === "zh") {
      this.props.selectLanguage(value);
    }
  };

  changeCurrency = (value) => {
    if (value === "CNY" || value === "USD") {
      this.props.updateCmcLegal(value);
      this.props.selectCurrency(value);
    }
  };

  selectTheme = (themeName) => {
    if (autoThemeJob) {
      clearTimeout(autoThemeJob);
      autoThemeJob = null;
    }

    this.props.selectTheme(themeName);

    if (themeName === "auto") {
      autoThemeJob = setTimeout(() => {
        this.selectTheme("auto");
      }, 30 * 60 * 1000); // 30 minutes
    }
  };

  render() {
    const theme = this.props.theme;
    const userPreferences = this.props.userPreferences;
    const themeName = userPreferences.themeName;
    const language = userPreferences.language;
    const currency = userPreferences.currency;
    const content = (
      <div style={{ minWidth: "360px" }}>
        <Row type="flex" justify="space-between">
          <Col span={4}>
            <FontAwesomeIcon
              icon={faGlobeAsia}
              style={{
                width: "24px",
                height: "24px",
                color: theme.textWhite,
              }}
            />
          </Col>
          <Col span={14}>
            <div
              style={{
                fontSize: "1rem",
                color: theme.textWhite,
              }}
            >
              <I s="Language" />
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: theme.textDim,
                margin: "8px 0px",
              }}
            >
              <I s="Change the default interface language" />
            </div>
          </Col>
          <Col span={2}>
            <OptionButton
              disabled={language === "en"}
              size="small"
              onClick={() => {
                this.changeLanguage("en");
              }}
            >
              En
            </OptionButton>
          </Col>
          <Col span={2}></Col>
          <Col span={2}>
            <OptionButton
              disabled={language === "zh"}
              size="small"
              onClick={() => {
                this.changeLanguage("zh");
              }}
            >
              中
            </OptionButton>
          </Col>
        </Row>
        <Row
          type="flex"
          style={{
            borderTop: "1px solid " + theme.seperator,
            paddingTop: "12px",
          }}
          justify="space-between"
        >
          <Col span={4}>
            <FontAwesomeIcon
              icon={faCoins}
              style={{
                width: "24px",
                height: "24px",
                color: theme.textWhite,
              }}
            />
          </Col>
          <Col span={14}>
            <div
              style={{
                fontSize: "1rem",
                color: theme.textWhite,
              }}
            >
              <I s="Currency" />
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: theme.textDim,
                margin: "8px 0px",
              }}
            >
              <I s="Change the default currency" />
            </div>
          </Col>
          <Col span={2}>
            <OptionButton
              style={{
                width: "36px",
              }}
              disabled={currency === "USD"}
              size="small"
              onClick={() => {
                this.changeCurrency("USD");
              }}
            >
              <I s="USD" />
            </OptionButton>
          </Col>
          <Col
            span={4}
            style={{
              textAlign: "right",
            }}
          >
            <OptionButton
              style={{
                width: "36px",
                marginRight: "-2px",
              }}
              disabled={currency === "CNY"}
              size="small"
              onClick={() => {
                this.changeCurrency("CNY");
              }}
            >
              <I s="CNY" />
            </OptionButton>
          </Col>
        </Row>
        <Row
          type="flex"
          style={{
            borderTop: "1px solid " + theme.seperator,
            paddingTop: "12px",
          }}
          justify="space-between"
        >
          <Col span={4}>
            <FontAwesomeIcon
              icon={faBrush}
              style={{
                width: "24px",
                height: "24px",
                color: theme.textWhite,
              }}
            />
          </Col>
          <Col span={14}>
            <div
              style={{
                fontSize: "1rem",
                color: theme.textWhite,
              }}
            >
              <I s="Theme" />
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: theme.textDim,
                margin: "8px 0px",
              }}
            >
              <I s="Choose between dark and light theme" />
            </div>
          </Col>
          <Col span={2}>
            <OptionButton
              disabled={themeName === "light"}
              size="small"
              icon={<FontAwesomeIcon icon={faSun} />}
              style={{
                borderRadius: "50%",
              }}
              onClick={() => {
                this.selectTheme("light");
              }}
            />
          </Col>
          <Col span={2} align="center">
            <OptionButton
              disabled={themeName === "dark"}
              size="small"
              icon={<FontAwesomeIcon icon={faMoon} />}
              style={{
                borderRadius: "50%",
              }}
              onClick={() => {
                this.selectTheme("dark");
              }}
            />
          </Col>
          <Col span={2}>
            <OptionButton
              disabled={themeName === "auto"}
              size="small"
              icon={<FontAwesomeIcon icon={faAdjust} />}
              style={{
                borderRadius: "50%",
              }}
              onClick={() => {
                this.selectTheme("auto");
              }}
            />
          </Col>
        </Row>
      </div>
    );
    return (
      <Popover
        placement={"bottomLeft"}
        mouseLeaveDelay={0.2}
        content={content}
        title={<I s="Settings" />}
        trigger="hover"
        visible={this.props.visible}
        onVisibleChange={this.props.onVisibleChange}
      >
        <FontAwesomeIcon
          icon={faCog}
          style={{
            width: "14px",
            height: "14px",
            marginLeft: "32px",
            marginBottom: "-6px",
          }}
        />
      </Popover>
    );
  }
}

const mapStateToProps = (state) => {
  const { pathname } = state.router.location;
  return {
    pathname,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectLanguage: (language) => dispatch(selectLanguage(language)),
    selectCurrency: (currency) => dispatch(selectCurrency(currency)),
    selectTheme: (themeName) => dispatch(selectTheme(themeName)),
    updateCmcLegal: (legal) => dispatch(updateCmcLegal(legal)),
  };
};

export default withUserPreferences(
  withTheme(connect(mapStateToProps, mapDispatchToProps)(SettingsPopover))
);
