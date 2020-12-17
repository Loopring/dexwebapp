import { showWechatModal } from 'redux/actions/ModalManager';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from 'AppLayout';
import I from 'components/I';
import React from 'react';
import styled from 'styled-components';

import { MyModal, Section, TextPopupTitle } from 'modals/styles/Styles';

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

const WechatModal = () => {
  const isVislble = useSelector(
    (state) => state.modalManager.isWechatModalVisible
  );
  const dispatch = useDispatch();

  function onClose() {
    dispatch(showWechatModal(false));
  }

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
      visible={isVislble}
      onCancel={() => onClose()}
    >
      <Section>
        <QrcodeTextDiv>
          <I s="Scan the QR code" />
        </QrcodeTextDiv>
        <QrcodeDiv>
          <img
            style={{
              width: '272px',
            }}
            src="/assets/images/wechat_qrcode.jpg"
            alt="wechat"
            draggable="false"
          />
        </QrcodeDiv>
      </Section>
    </MyModal>
  );
};

export default WechatModal;
