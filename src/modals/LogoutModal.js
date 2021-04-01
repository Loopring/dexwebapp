import { Button, Spin } from 'antd';
import { MyModal } from './styles/Styles';
import { connect } from 'react-redux';
import { logoutAll } from 'redux/actions/DexAccount';
import { showLogoutModal } from 'redux/actions/ModalManager';
import AppLayout from 'AppLayout';
import I from 'components/I';
import ModalIndicator from 'modals/components/ModalIndicator';
import React from 'react';

import styled, { withTheme } from 'styled-components';

import { Instruction, Section, TextPopupTitle } from 'modals/styles/Styles';

const MyButton = styled(Button)`
  font-size: 1rem !important;
  font-weight: 600 !important;
  height: 40px !important;
  width: 190px;
  border-style: none !important;
  border-radius: 20px !important;
  color: ${(props) => props.theme.textBigButton}!important;
  text-transform: uppercase !important;
  transition: 1s !important;
`;

const ConfirmButton = styled(MyButton)`
  margin-right: 10px;
  background: ${(props) => props.theme.red}!important;
`;

const CancelButton = styled(MyButton)`
  margin-left: 10px;
  background: ${(props) => props.theme.primary}!important;
`;

class LogoutModal extends React.Component {
  state = {
    loading: false,
  };

  onClick = () => {
    this.setState({ loading: true });
    // If it's WalletConnect, close provider session.
    // so that next time it will require QR code.
    if (window.wallet && window.wallet.walletType === 'WalletConnect') {
      (async () => {
        try {
          if (window.ethereum.close) {
            await window.ethereum.close();
          }
          this.props.logoutAll();
        } catch (error) {
          console.log(error);
        }
      })();
    } else if (window.wallet && window.wallet.walletType === 'MetaMask') {
      this.props.logoutAll();
    }

    setTimeout(() => {
      this.onClose();
      this.setState({ loading: false });
    }, 2000);
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
            <I s="Lock" />
          </TextPopupTitle>
        }
        footer={null}
        closable={false}
        maskClosable={false}
        visible={this.props.isVisible}
        onCancel={() => this.onClose()}
      >
        <Spin
          spinning={this.state.loading}
          indicator={<ModalIndicator title="Locking..." marginTop="30px" />}
        >
          <Section>
            <Instruction>
              <I s="LogoutInstruct_1" />
            </Instruction>
            <Instruction>
              <I s="LogoutInstruct_2" />
            </Instruction>
          </Section>
          <Section
            style={{
              textAlign: 'center',
            }}
          >
            <ConfirmButton onClick={() => this.onClick()}>
              <I s="Yes, lock my layer-2." />
            </ConfirmButton>
            <CancelButton onClick={() => this.onClose()}>
              <I s="Cancel" />
            </CancelButton>
          </Section>
        </Spin>
      </MyModal>
    );
  }
}

const mapStateToProps = (state) => {
  const { modalManager, dexAccount } = state;
  const isVisible = modalManager.isLogoutModalVisible;
  const address = dexAccount.account.address;
  return { isVisible, address };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(showLogoutModal(false)),
    logoutAll: () => dispatch(logoutAll()),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(LogoutModal)
);
