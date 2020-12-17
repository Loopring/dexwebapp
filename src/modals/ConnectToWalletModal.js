import { Col, Row } from 'antd';
import { MyModal } from './styles/Styles';
import { showConnectToWalletModal } from 'redux/actions/ModalManager';

import { useDispatch, useSelector } from 'react-redux';
import I from 'components/I';
import React from 'react';
import styled from 'styled-components';

import { HighlightTextSpan } from 'styles/Styles';
import { Section, TextPopupTitle } from 'modals/styles/Styles';
import { connectToAuthereum } from 'redux/actions/Authereum';
import { connectToMetaMask } from 'redux/actions/MetaMask';
import {
  connectToMewConnect,
  connectToMewConnectComplete,
} from 'redux/actions/MewConnect';
import { connectToWalletConnect } from 'redux/actions/WalletConnect';
import { connectToWalletLink } from 'redux/actions/WalletLink';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

import { tracker } from 'components/DefaultTracker';

const WalletTypeDiv = styled.div`
  cursor: pointer;

  > img {
    width: auto;
    height: 45px;
    margin-top: 30px;
    margin-bottom: 15px;
    filter: drop-shadow(0 10px 10px rgba(0, 0, 0, 0.2));
  }

  > div:first-of-type {
    margin-bottom: 2px;

    > span {
      font-size: 1rem;
    }
  }
`;

const ConnectToWalletModal = () => {
  const isVislble = useSelector(
    (state) => state.modalManager.isConnectToWalletModalVisiable
  );
  const dispatch = useDispatch();

  function onMetaMaskClick() {
    tracker.trackEvent({
      type: 'SELECT_WALLET',
      data: {
        type: 'MetaMask',
      },
    });
    // Before connect to MetaMask, let's disconnect WalletConnect
    (async () => {
      try {
        if (window.wallet.walletType === 'MetaMask') {
          await window.ethereum.disconnect();
        } else {
          await window.provider.close();
        }
      } catch (error) {
      } finally {
        dispatch(connectToMetaMask(true));
        dispatch(showConnectToWalletModal(false));
      }
    })();
  }

  function onWalletConnectClick() {
    tracker.trackEvent({
      type: 'SELECT_WALLET',
      data: {
        type: 'WalletConnect',
      },
    });
    // Before connect to WalletConnect, let's disconnect WalletConnect
    (async () => {
      try {
        if (window.wallet.walletType === 'MetaMask') {
          await window.ethereum.disconnect();
        } else {
          await window.provider.close();
        }
      } catch (error) {
      } finally {
        dispatch(connectToWalletConnect(true));
        dispatch(showConnectToWalletModal(false));
      }
    })();
  }

  function onMewConnectClick() {
    dispatch(connectToMewConnectComplete());
    tracker.trackEvent({
      type: 'SELECT_WALLET',
      data: {
        type: 'MewConnect',
      },
    });
    // Before connect, let's disconnect WalletConnect
    (async () => {
      try {
        if (window.wallet.walletType === 'MetaMask') {
          await window.ethereum.disconnect();
        } else {
          await window.provider.close();
        }
      } catch (error) {
      } finally {
        dispatch(connectToMewConnect(true));
        dispatch(showConnectToWalletModal(false));
      }
    })();
  }

  function onAuthereumClick() {
    // Before connect, let's disconnect Authereum
    (async () => {
      try {
        // await window.provider.close();
      } catch (error) {
      } finally {
        dispatch(connectToAuthereum(true));
        dispatch(showConnectToWalletModal(false));
      }
    })();
  }

  function onWalletLinkClick() {
    // Before connect, let's disconnect WalletLink
    (async () => {
      try {
        // await window.provider.close();
      } catch (error) {
      } finally {
        dispatch(connectToWalletLink(true));
        dispatch(showConnectToWalletModal(false));
      }
    })();
  }

  function onClose() {
    dispatch(showConnectToWalletModal(false));
  }

  return (
    <MyModal
      centered
      // width={'600px'}
      width={'540px'}
      title={
        <TextPopupTitle>
          <I s="Connect Wallet" />
        </TextPopupTitle>
      }
      footer={null}
      maskClosable={false}
      closeIcon={<FontAwesomeIcon icon={faTimes} />}
      visible={isVislble}
      onCancel={() => onClose()}
    >
      <Section
        style={{
          textAlign: 'center',
          marginBottom: '24px',
        }}
      >
        <Row className="row">
          <Col span={12}>
            <WalletTypeDiv
              onClick={() => {
                onMetaMaskClick();
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
          {/* <Col span={8}>
            <WalletTypeDiv
              onClick={() => {
                onMewConnectClick();
              }}
            >
              <img
                src="/assets/images/mewconnect.svg"
                alt="MewConnect"
                draggable="false"
              />
              <div>
                <HighlightTextSpan>
                  <I s="MEW Wallet" />
                </HighlightTextSpan>
              </div>
            </WalletTypeDiv>
          </Col> */}
          <Col span={12}>
            <WalletTypeDiv
              onClick={() => {
                onWalletConnectClick();
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
        {/* <Row
          className="row"
          style={{
            marginTop: '20px',
          }}
        >
          <Col span={8}>
            <WalletTypeDiv
              onClick={() => {
                onAuthereumClick();
              }}
            >
              <img
                src="/assets/images/authereum.svg"
                alt="Authereum"
                draggable="false"
              />
              <div>
                <HighlightTextSpan>
                  <I s="Authereum" />
                </HighlightTextSpan>
              </div>
            </WalletTypeDiv>
          </Col>
          <Col span={8}>
            <WalletTypeDiv
              onClick={() => {
                onWalletLinkClick();
              }}
            >
              <img
                src="/assets/images/wallet-link.png"
                alt="Coinbase Wallet"
                draggable="false"
              />
              <div>
                <HighlightTextSpan>
                  <I s="Coinbase Wallet" />
                </HighlightTextSpan>
              </div>
            </WalletTypeDiv>
          </Col>
        </Row> */}
      </Section>
    </MyModal>
  );
};

export default ConnectToWalletModal;
