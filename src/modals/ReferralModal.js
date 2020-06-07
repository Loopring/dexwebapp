import { Button } from "antd";
import { connect } from "react-redux";
import { showReferralModal } from "redux/actions/ModalManager";
import AppLayout from "AppLayout";
import Group from "modals/components/Group";
import I from "components/I";
import React from "react";

import styled, { withTheme } from "styled-components";

import {
  AddressDiv,
  Instruction,
  MyModal,
  Section,
  TextPopupTitle,
} from "modals/styles/Styles";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { notifySuccess } from "redux/actions/Notification";

const MyButton = styled(Button)`
  font-size: 1rem !important;
  font-weight: 600 !important;
  height: 40px !important;
  width: 100%;
  border-style: none !important;
  border-radius: 20px !important;
  color: ${(props) => props.theme.textBigButton}!important;
  text-transform: uppercase !important;
  transition: 1s !important;
`;

const CopyButton = styled(MyButton)`
  margin-right: 20px;
  background: ${(props) => props.theme.primary}!important;
`;

class ReferralModal extends React.Component {
  onClose = () => {
    this.props.closeModal();
  };

  render() {
    const { account } = this.props.dexAccount;
    const referralLink = `${window.location.host}/invite/${account.accountId}`;

    return (
      <MyModal
        centered
        width={AppLayout.modalWidth}
        title={
          <TextPopupTitle>
            <I s="Referral" />
          </TextPopupTitle>
        }
        footer={null}
        closable={true}
        maskClosable={true}
        visible={this.props.isVislble}
        onCancel={() => this.onClose()}
      >
        <Section>
          <Instruction>
            <I s="Referral_Instruct_1" />
          </Instruction>
          <Group label={<I s="Referral Link" />}>
            <AddressDiv>{referralLink}</AddressDiv>
          </Group>
        </Section>
        <Section
          style={{
            textAlign: "center",
          }}
        >
          <CopyToClipboard text={referralLink}>
            <CopyButton
              onClick={() => {
                notifySuccess(<I s="CopyReferralLink" />, this.props.theme);
              }}
            >
              <I s="Copy" />
            </CopyButton>
          </CopyToClipboard>
        </Section>
      </MyModal>
    );
  }
}

const mapStateToProps = (state) => {
  const { modalManager, dexAccount } = state;
  const isVislble = modalManager.isReferralModalVisible;
  return { isVislble, dexAccount };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(showReferralModal(false)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(ReferralModal)
);
