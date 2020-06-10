import { Section, TextPopupTitle } from 'modals/styles/Styles';
import { applyApiKey } from 'lightcone/api/LightconeAPI';
import { connect } from 'react-redux';
import { loginModal, showResetApiKeyModal } from 'redux/actions/ModalManager';
import { notifyError, notifySuccess } from 'redux/actions/Notification';
import { updateAccount } from 'redux/actions/DexAccount';
import { withTheme } from 'styled-components';
import { withUserPreferences } from 'components/UserPreferenceContext';
import I from 'components/I';
import React from 'react';

import { ActionButton } from 'styles/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MyModal } from './styles/Styles';
import { Spin } from 'antd';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

import AppLayout from 'AppLayout';

class ResetApiKeyModal extends React.Component {
  state = {
    loading: false,
  };

  title = (<I s="Reset API Key" />);
  buttonLabel = (<I s="Reset API Key" />);
  getInstructions = () => {
    return (
      <Section>
        <ul>
          <li>
            <I s="ResetApiKeyInstruction_1" />
          </li>
          <li>
            <I s="ResetApiKeyInstruction_2" />
          </li>
        </ul>
      </Section>
    );
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.isVisible !== prevProps.isVisible &&
      this.props.isVisible === false
    ) {
      this.reset();
    }
  }

  onClose = () => {
    this.props.closeModal();
  };

  reset() {
    this.setState({
      loading: false,
    });
  }

  onProceed = () => {
    this.setState({
      loading: true,
    });
    const { dexAccount } = this.props;

    (async () => {
      try {
        const signed = await window.wallet.applyApiKey();
        const data = {
          accountId: dexAccount.account.accountId,
          publicKeyX: dexAccount.account.publicKeyX,
          publicKeyY: dexAccount.account.publicKeyY,
        };

        const apiKey = await applyApiKey(data, signed.signature);
        const account = {
          ...dexAccount.account,
          apiKey: apiKey,
        };
        this.props.updateAccount(account);

        notifySuccess(<I s="ApiKeyResetNotification" />, this.props.theme);
      } catch (err) {
        console.log(err);
        notifyError(<I s="ApiKeyResetFailedNotification" />, this.props.theme);
      } finally {
        this.onClose();
      }
    })();
  };

  render() {
    return (
      <MyModal
        centered
        style={{ top: 40 }}
        width={AppLayout.modalWidth}
        title={<TextPopupTitle>{this.title}</TextPopupTitle>}
        footer={null}
        maskClosable={false}
        closeIcon={<FontAwesomeIcon icon={faTimes} />}
        visible={this.props.isVisible}
        onCancel={() => this.onClose()}
      >
        <Spin spinning={this.state.loading}>
          <Section>{this.getInstructions()}</Section>
          <Section>
            <ActionButton onClick={() => this.onProceed()}>
              {this.buttonLabel}
            </ActionButton>
          </Section>
        </Spin>
      </MyModal>
    );
  }
}

const mapStateToProps = (state) => {
  const { modalManager, dexAccount } = state;
  const isVisible = modalManager.isResetApiKeyModalVisible;
  return { isVisible, modalManager, dexAccount };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showLoginModal: () => dispatch(loginModal(true)),
    closeModal: () => dispatch(showResetApiKeyModal(false)),
    updateAccount: (account) => dispatch(updateAccount(account)),
  };
};

export default withUserPreferences(
  withTheme(connect(mapStateToProps, mapDispatchToProps)(ResetApiKeyModal))
);
