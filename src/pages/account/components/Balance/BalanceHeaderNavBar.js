import { Checkbox, Col, Row } from "antd";
import { LargeTableHeader, SearchInput } from "styles/Styles";
import { connect } from "react-redux";
import { updateHideLowBalanceAssets } from "redux/actions/MyAccountPage";
import { withTheme } from "styled-components";
import { withUserPreferences } from "components/UserPreferenceContext";
import I from "components/I";
import React from "react";

class BalanceHeaderNavBar extends React.PureComponent {
  clicked = (e) => {
    this.props.updateHideLowBalanceAssets(e.target.checked);
  };

  onSearchInputChange = (e) => {
    this.props.onSearchInputChange(e.target.value);
  };

  render() {
    // https://github.com/ant-design/ant-design/issues/5866
    const userPreferences = this.props.userPreferences;
    const language = userPreferences.language;
    let placeholder =
      language === "en" ? "Search asset symbol" : "搜索资产代码";
    return (
      <LargeTableHeader>
        <Row gutter={8}>
          <Col span={5}>
            <SearchInput
              style={{}}
              disabled={this.props.loading}
              placeholder={placeholder}
              onChange={this.onSearchInputChange}
            />
          </Col>
          <Col
            style={{
              maxWidth: "20px",
              minWidth: "20px",
            }}
          ></Col>
          <Col span={5}>
            <Checkbox
              style={{
                marginLeft: "4px",
                marginTop: "4px",
                marginBottom: "auto",
                textTransform: "none",
              }}
              onChange={this.clicked}
              defaultChecked={this.props.balances.hideLowBalanceAssets}
            >
              <I s="Hide zero-balance assets" />
            </Checkbox>
          </Col>
        </Row>
      </LargeTableHeader>
    );
  }
}

const mapStateToProps = (state) => {
  const { balances } = state;
  return { balances };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateHideLowBalanceAssets: (value) =>
      dispatch(updateHideLowBalanceAssets(value)),
  };
};

export default withUserPreferences(
  withTheme(connect(mapStateToProps, mapDispatchToProps)(BalanceHeaderNavBar))
);
