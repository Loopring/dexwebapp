import { Col, Row } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeContext } from 'styled-components';
import I from 'components/I';
import React, { useContext } from 'react';

import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';

const ModalIndicator = ({
  title,
  tipIcons,
  tips,
  marginTop,
  imageUrl,
  textAlign,
}) => {
  const theme = useContext(ThemeContext);
  const tips_ = tips || [];
  const marginTop_ = marginTop || '80px';
  const textAlign_ = textAlign || 'left';

  let tipsDiv;
  if (tipIcons && tips && tipIcons.length === tips.length) {
    tipsDiv = tips_.map((tip, i) => (
      <div
        style={{
          textAlign: textAlign_,
          margin: '16px',
        }}
        key={i}
      >
        <Row>
          <Col span={2}>{tipIcons[i]}</Col>
          <Col span={22}>{tip}</Col>
        </Row>
      </div>
    ));
  } else {
    tipsDiv = tips_.map((tip, i) => (
      <div
        style={{
          textAlign: textAlign_,
          margin: '16px',
        }}
        key={i}
      >
        {tip}
      </div>
    ));
  }

  return (
    <div>
      <FontAwesomeIcon
        icon={faCircleNotch}
        size="2x"
        spin
        style={{ margin: '20px', marginTop: marginTop_ }}
      />

      <div
        style={{
          margin: '16px',
          paddingLeft: '20px',
          paddingRight: '20px',
          color: theme.primary,
          fontSize: '1rem',
        }}
      >
        <I s={title} />
      </div>

      <div
        style={{
          fontSize: '0.85rem',
          color: theme.textWhite,
        }}
      >
        {tipsDiv}
      </div>

      {imageUrl ? (
        <div>
          <img
            alt="check metamask plugin icon"
            style={{
              userSelect: 'none',
              height: '80px',
              marginTop: '16px',
              filter: 'drop-shadow(0 10px 10px rgba(0, 0, 0, 0.2)',
            }}
            src={imageUrl}
          />
        </div>
      ) : (
        <span />
      )}
    </div>
  );
};

export default ModalIndicator;
