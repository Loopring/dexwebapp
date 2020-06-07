import { connect } from "react-redux";
import { showWechatModal } from "redux/actions/ModalManager";
import AppLayout from "AppLayout";
import I from "components/I";
import React from "react";

import styled, { withTheme } from "styled-components";

import { MyModal, Section, TextPopupTitle } from "modals/styles/Styles";

const QrcodeTextDiv = styled.div`
  padding-top: 22px;
  text-align: center;
  color: ${(props) => props.theme.textDim};
`;

const QrcodeDiv = styled.div`
  padding: 24px;
  width: 320px;
  margin: 40px auto;
  background: #ffffff;
`;

class WechatModal extends React.Component {
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
            <I s="WeChat" />
          </TextPopupTitle>
        }
        footer={null}
        closable={true}
        maskClosable={true}
        visible={this.props.isVislble}
        onCancel={() => this.onClose()}
      >
        <Section>
          <QrcodeTextDiv>
            <I s="Scan the QR code" />
          </QrcodeTextDiv>
          <QrcodeDiv>
            <img
              style={{
                width: "272px",
              }}
              src={require("./wechat_qrcode.jpg")}
              alt="wechat"
              draggable="false"
            />
          </QrcodeDiv>
        </Section>
      </MyModal>
    );
  }
}

const mapStateToProps = (state) => {
  const { modalManager } = state;
  const isVislble = modalManager.isWechatModalVisible;
  return { isVislble };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(showWechatModal(false)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(WechatModal)
);
