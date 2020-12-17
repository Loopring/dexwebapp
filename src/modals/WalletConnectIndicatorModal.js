import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MyModal, TextPopupTitle } from 'modals/styles/Styles';
import I from 'components/I';
import React from 'react';

import { Spin } from 'antd';
import { connect } from 'react-redux';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { showWalletConnectIndicatorModal } from 'redux/actions/ModalManager';

import { withTheme } from 'styled-components';
import AppLayout from 'AppLayout';
import WalletConnectIndicator from 'modals/components/WalletConnectIndicator';
import WalletConnectIndicatorPlaceholder from 'modals/components/WalletConnectIndicatorPlaceholder';

class WalletConnectIndicatorModal extends React.Component {
  onClose = () => {
    this.props.closeModal();
  };

  render() {
    let indicator = <WalletConnectIndicator />;
    let title = <I s="WalletConnect" />;
    if (this.props.walletConnectIndicatorType === 'SWAP_ADD') {
      title = <I s="Add Liquidity" />;
    } else if (this.props.walletConnectIndicatorType === 'SWAP_REMOVE') {
      title = <I s="Remove Liquidity" />;
    }

    return (
      <MyModal
        centered
        width={AppLayout.modalWidth}
        title={<TextPopupTitle>{title}</TextPopupTitle>}
        footer={null}
        maskClosable={false}
        closeIcon={<FontAwesomeIcon icon={faTimes} />}
        visible={this.props.isVisible}
        onCancel={() => this.onClose()}
      >
        <Spin spinning={true} indicator={indicator}>
          <WalletConnectIndicatorPlaceholder isWalletConnectLoading={true} />
        </Spin>
      </MyModal>
    );
  }
}

const mapStateToProps = (state) => {
  const { modalManager } = state;
  const isVisible = modalManager.isWalletConnectIndicatorModalVisible;
  const walletConnectIndicatorType = modalManager.walletConnectIndicatorType;
  return {
    isVisible,
    walletConnectIndicatorType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(showWalletConnectIndicatorModal(false, '')),
    showWalletConnectIndicatorModal: (token) =>
      dispatch(showWalletConnectIndicatorModal(true, token)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(WalletConnectIndicatorModal)
);
