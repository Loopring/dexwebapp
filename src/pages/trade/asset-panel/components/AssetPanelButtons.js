import { connect } from "react-redux";
import I from "components/I";
import React from "react";

import { LOGGED_IN } from "redux/actions/DexAccount";
import styled, { withTheme } from "styled-components";

import { Button, Col, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faArrowAltCircleDown } from "@fortawesome/free-solid-svg-icons/faArrowAltCircleDown";
import { faArrowAltCircleUp } from "@fortawesome/free-solid-svg-icons/faArrowAltCircleUp";
import {
  showDepositModal,
  showWithdrawModal,
} from "redux/actions/ModalManager";

const MyButton = styled(Button)`
  color: ${(props) => props.theme.textWhite}!important;
  border: 1px solid ${(props) => props.theme.inputBorderColor}!important;
  height: 36px;
  border-radius: 2px;
  font-weight: 600;
  font-size: 0.85rem;
  background: transparent !important;
  margin: auto;
  padding: 0;

  &:hover {
    color: ${(props) => props.theme.textBright}!important;
    border: 1px solid ${(props) => props.theme.inputBorderActiveColor}!important;
  }
`;
class AssetPanelButtons extends React.Component {
  render() {
    const theme = this.props.theme;
    const { dexAccount, market } = this.props;

    // If account doesn't login, disable buttons
    let isButtonsDisable = true;
    if (
      typeof window.wallet !== "undefined" &&
      !!dexAccount &&
      !!dexAccount.account
    ) {
      if (
        dexAccount.account.accountKey &&
        dexAccount.account &&
        dexAccount.account.accountId
      ) {
        isButtonsDisable = false;
      }
    }

    let buttons = (
      <div>
        <Row
          className="row1"
          gutter={4}
          style={{
            color: theme.textWhite,
            paddingTop: "0px", // Overwrite the value in row1
          }}
        >
          <Col className="columnLeft" span={12} style={{}}>
            <MyButton
              block
              onClick={() => {
                this.props.showDepositModal(
                  true,
                  market.currentMarket.baseTokenSymbol
                );
              }}
              disabled={
                isButtonsDisable || !this.props.metaMask.isDesiredNetwork
              }
            >
              <FontAwesomeIcon
                style={{ marginRight: "4px" }}
                color={theme.green}
                icon={faArrowAltCircleDown}
              />

              <I s="Deposit" />
            </MyButton>
          </Col>
          <Col className="columnRight" span={12}>
            <MyButton
              block
              onClick={() => {
                this.props.showWithdrawModal(
                  true,
                  market.currentMarket.baseTokenSymbol
                );
              }}
              disabled={
                isButtonsDisable ||
                this.props.dexAccount.account.state !== LOGGED_IN ||
                !this.props.metaMask.isDesiredNetwork
              }
            >
              <FontAwesomeIcon
                style={{ marginRight: "4px" }}
                color={theme.red}
                icon={faArrowAltCircleUp}
              />

              <I s="Withdraw" />
            </MyButton>
          </Col>
        </Row>
      </div>
    );

    return <div style={{}}>{buttons}</div>;
  }
}

const mapStateToProps = (state) => {
  const { balances, dexAccount, metaMask, market } = state;
  return { balances, dexAccount, metaMask, market };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showDepositModal: (show, token) => dispatch(showDepositModal(show, token)),
    showWithdrawModal: (show, token) =>
      dispatch(showWithdrawModal(show, token)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(AssetPanelButtons)
);
