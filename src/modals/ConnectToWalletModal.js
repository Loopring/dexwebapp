import { Col, Row, Spin } from "antd";
import { MyModal } from "./styles/Styles";
import { connect } from "react-redux";
import { showConnectToWalletModal } from "redux/actions/ModalManager";
import AppLayout from "AppLayout";
import I from "components/I";
import ModalIndicator from "modals/components/ModalIndicator";
import React from "react";

import styled, { withTheme } from "styled-components";

import { HighlightTextSpan } from "styles/Styles";
import { Section, TextPopupTitle } from "modals/styles/Styles";
import { connectToMetaMask } from "redux/actions/MetaMask";
import { connectToWalletConnect } from "redux/actions/WalletConnect";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

const WalletTypeDiv = styled.div`
  cursor: pointer;

  > img {
    width: auto;
    height: 45px;
    margin-top: 30px;
    margin-bottom: 15px;
  }

  > div:first-of-type {
    margin-bottom: 2px;

    > span {
      font-size: 1rem;
    }
  }

  &:hover {
    > div:first-of-type {
      > span {
        color: ${(props) => props.theme.textBright};
      }
    }
  }
`;

class ConnectToWalletModal extends React.Component {
  state = {
    loading: false,
  };

  onMetaMaskClick = () => {
    // Before connect to MetaMask, let's disconnect WalletConnect
    (async () => {
      try {
        await window.ethereum.close();
      } catch (error) {
      } finally {
        this.props.connectToMetaMask(true);
        this.props.closeModal();
      }
    })();
  };

  onWalletConnectClick = () => {
    // Before connect to WalletConnect, let's disconnect WalletConnect
    (async () => {
      try {
        await window.ethereum.close();
      } catch (error) {
      } finally {
        this.props.connectToWalletConnect(true);
        this.props.closeModal();
      }
    })();
  };

  onClose = () => {
    this.props.closeModal();
  };

  render() {
    return (
      <MyModal
        centered
        width={AppLayout.modalWidth}
        title={
          <TextPopupTitle>
            <I s="Connect Wallet" />
          </TextPopupTitle>
        }
        footer={null}
        maskClosable={false}
        closeIcon={<FontAwesomeIcon icon={faTimes} />}
        visible={this.props.isVislble}
        onCancel={() => this.onClose()}
      >
        <Spin
          spinning={this.state.loading}
          indicator={<ModalIndicator title="" marginTop="80px" />}
        >
          <Section
            style={{
              textAlign: "center",
            }}
          >
            <Row className="row">
              <Col span={12}>
                <WalletTypeDiv
                  onClick={() => {
                    this.onMetaMaskClick();
                  }}
                >
                  <img
                    src="/assets/images/MetaMask.svg"
                    alt="MetaMask"
                    draggable="false"
                  />
                  <div>
                    <HighlightTextSpan>MetaMask</HighlightTextSpan>
                  </div>
                </WalletTypeDiv>
              </Col>
              <Col span={12}>
                <WalletTypeDiv
                  onClick={() => {
                    this.onWalletConnectClick();
                  }}
                >
                  <img
                    src="/assets/images/WalletConnect.svg"
                    alt="WalletConnect"
                    draggable="false"
                  />
                  <div>
                    <HighlightTextSpan>WalletConnect</HighlightTextSpan>
                  </div>
                </WalletTypeDiv>
              </Col>
            </Row>
          </Section>
        </Spin>
      </MyModal>
    );
  }
}

const mapStateToProps = (state) => {
  const { modalManager } = state;
  const isVislble = modalManager.isConnectToWalletModalVisiable;
  return { isVislble };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectToMetaMask: (startConnecting) =>
      dispatch(connectToMetaMask(startConnecting)),
    connectToWalletConnect: (startConnecting) =>
      dispatch(connectToWalletConnect(startConnecting)),
    closeModal: () => dispatch(showConnectToWalletModal(false)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(ConnectToWalletModal)
);
