import { Section, TextPopupTitle } from 'modals/styles/Styles';
import { accountUpdate } from 'lightcone/api/LightconeAPI';
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

import * as fm from 'lightcone/common/formatter';

class ResetApiKeyModal extends React.Component {
  state = {
    loading: false,
  };

  title = (<I s="Active API Key" />);
  buttonLabel = (<I s="Active API Key" />);
  getInstructions = () => {
    return (
      <Section>
        <ul>
          {/* <li>
            <I s="ResetApiKeyInstruction_1" />
          </li>
          <li>
            <I s="ResetApiKeyInstruction_2" />
          </li> */}
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
        console.log('dexAccount', dexAccount);

        const validUntil = new Date().getTime() / 1000 + 3600 * 24 * 60;

        let publicKeyX = fm.clearHexPrefix(
          fm.toHex(fm.toBN(dexAccount.account.publicKeyX.toString('hex')))
        );
        console.log('publicKeyX', publicKeyX, publicKeyX.length);
        // TODO: How to set to 64 in a nice way.
        if (publicKeyX.length < 64) {
          const padding = new Array(64 - publicKeyX.length).fill(0);
          publicKeyX = padding.join('').toString() + publicKeyX;
        }
        console.log('publicKeyX', publicKeyX, publicKeyX.length);

        let publicKeyY = fm.clearHexPrefix(
          fm.toHex(fm.toBN(dexAccount.account.publicKeyY.toString('hex')))
        );
        console.log('publicKeyY', publicKeyY, publicKeyY.length);
        if (publicKeyY.length < 64) {
          const padding = new Array(64 - publicKeyY.length).fill(0);
          publicKeyY = padding.join('').toString() + publicKeyY;
        }
        console.log('publicKeyY', publicKeyY, publicKeyY.length);

        // offchainRequest是奇数， order是偶数
        const data = {
          owner: dexAccount.account.owner,
          exchange: this.props.exchange.exchangeAddress,
          feeToken: 0,
          maxFeeAmount: 4000000000000000,
          accountId: dexAccount.account.accountId,
          publicKeyX: '0x' + publicKeyX,
          publicKeyY: '0x' + publicKeyY,
          nonce: dexAccount.account.accountNonce,
          validUntil: Math.floor(validUntil),
        };

        console.log('data', data);

        const result = await window.wallet.accountUpdate(data);

        const apiKey = await accountUpdate(data, result.ecdsaSig);

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
  const { modalManager, dexAccount, exchange } = state;
  const isVisible = modalManager.isResetApiKeyModalVisible;
  return { isVisible, modalManager, dexAccount, exchange };
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
