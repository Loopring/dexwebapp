import { Col, Row } from 'antd';
import { ThemeContext } from 'styled-components';
import React, { useContext } from 'react';

const SwapLabelValue = ({
  labelLeft,
  labelRight,
  leftColSpan = 5,
  rightColSpan = 19,
  color,
}) => {
  const theme = useContext(ThemeContext);
  if (typeof color === 'undefined') {
    color = theme.textDim2;
  }
  return (
    <Row
      gutter={16}
      style={{
        padding: '0 0',
        fontSize: '1rem',
      }}
    >
      <Col
        span={leftColSpan}
        style={{
          color,
        }}
      >
        {labelLeft}
      </Col>
      <Col
        span={rightColSpan}
        style={{
          textAlign: 'right',
          color,
        }}
      >
        {labelRight}
      </Col>
    </Row>
  );
};

export default SwapLabelValue;
