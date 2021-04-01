import { Modal, Spin } from 'antd';

import { connect } from 'react-redux';

import * as fm from 'lightcone/common/formatter';
import { showExportAccountModal } from 'redux/actions/ModalManager';
import AppLayout from 'AppLayout';
import I from 'components/I';
import React from 'react';
import styled, { withTheme } from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { notifyError } from 'redux/actions/Notification';
import GenerateKeyPairIndicator from 'modals/components/GenerateKeyPairIndicator';
import GenerateKeyPairIndicatorPlaceholder from 'modals/components/GenerateKeyPairIndicatorPalceholder';

const PrettyPrintJson = (data) => {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

const ExportedDiv = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 0.85rem;
  padding: 8px 8px;
  background: ${(props) => props.theme.foreground};
  color: ${(props) => props.theme.textDim}
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.inputBorderColor};
  &:hover {
    color: ${(props) => props.theme.textWhite}
  }
  &::selection, &::-moz-selection{
    background-color: ${(props) => props.theme.primary}
  }
`;

class ExportAccountModal extends React.Component {
  state = {
    loading: true,
  };

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.isVisible && this.props.isVisible) {
      (async () => {
        try {
          const valid = await window.wallet.verify(
            this.props.exchangeAddress,
            Math.max(this.props.dexAccount.account.accountNonce - 1)
          );
          if (valid) {
            this.setState({
              loading: false,
            });
          } else {
            this.onClose();
            notifyError(<I s="Authorization failed!" />, this.props.theme);
          }
        } catch (e) {
          this.onClose();
          console.error(e);
          notifyError(<I s="Authorization failed!" />, this.props.theme);
        }
      })();
    }
  }

  onClose = () => {
    this.props.showExportAccountModal(false);
    this.setState({
      loading: true,
    });
  };

  render() {
    const theme = this.props.theme;
    var container = null;
    const { dexAccount } = this.props;
    if (dexAccount.account && dexAccount.account.accountId) {
      var json = {};
      json['exchangeName'] = 'Loopring Exchange v2';
      json['exchangeAddress'] = this.props.exchangeAddress;
      json['exchangeId'] = this.props.exchangeId;
      json['accountAddress'] = window.wallet ? window.wallet.address : '';
      json['accountId'] = this.props.dexAccount.account.accountId;
      json['apiKey'] = this.props.dexAccount.account.apiKey;
      json['publicKeyX'] = this.props.dexAccount.account.publicKeyX;
      json['publicKeyY'] = this.props.dexAccount.account.publicKeyY;
      json['privateKey'] = dexAccount.account.accountKey
        ? fm.toHex(fm.toBig(dexAccount.account.accountKey))
        : '';

      container = (
        <div
          style={{
            color: theme.textWhite,
            display: this.state.loading ? 'none' : 'block',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              color: theme.red,
              marginTop: '20px',
            }}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
            <div
              style={{
                textAlign: 'left',
                marginTop: '20px',
                fontSize: '0.9rem',
              }}
            >
              <I s="exportAccountWarning" />
            </div>
          </div>
          <ExportedDiv>{PrettyPrintJson(json)}</ExportedDiv>
        </div>
      );
    }

    let indicator = <div />;

    // indicatorPlaceholder is used to set the height of a modal dynamically.
    let indicatorPlaceholder = <div />;
    if (this.state.loading) {
      indicator = <GenerateKeyPairIndicator title={'Verifying...'} />;
      indicatorPlaceholder = <GenerateKeyPairIndicatorPlaceholder />;
    }

    return (
      <Modal
        width={AppLayout.modalWidth}
        title={
          <span
            style={{
              color: theme.textWhite,
              fontWeight: '600',
              fontSize: '1.2rem',
              userSelect: 'none',
            }}
          >
            <I s="Export Account" />
          </span>
        }
        footer={null}
        maskClosable={false}
        closeIcon={<FontAwesomeIcon icon={faTimes} />}
        visible={this.props.modalManager.isExportAccountModalVisible}
        onOk={this.onClose}
        onCancel={this.onClose}
      >
        <Spin spinning={this.state.loading} indicator={indicator}>
          {indicatorPlaceholder}
          {container}
        </Spin>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  const { modalManager, dexAccount, exchange } = state;
  const isVisible = modalManager.isExportAccountModalVisible;
  return {
    modalManager,
    dexAccount,
    isVisible,
    exchangeId: exchange.exchangeId,
    exchangeAddress: exchange.exchangeAddress,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showExportAccountModal: (show) => dispatch(showExportAccountModal(show)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(ExportAccountModal)
);
