import { Col, Row } from 'antd';
import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

const RowStyled = styled(Row)`
  input.ant-input {
    font-weight: 400;
    font-size: 1.2rem;
  }

  .ant-input-affix-wrapper {
    border: none !important;
    padding: 0 !important;

    &:hover,
    &:focus {
      border: none !important;
    }
  }
`;

const SwapSection = ({
  leftComponent,
  rightComponent,
  leftColSpan = 12,
  rightColSpan = 12,
}) => {
  const theme = useContext(ThemeContext);
  return (
    <RowStyled
      gutter={0}
      style={{
        padding: '0 0',
        fontSize: '1rem',
      }}
    >
      <Col
        span={leftColSpan}
        style={{
          color: theme.textWhite,
        }}
      >
        {leftComponent}
      </Col>
      <Col
        span={rightColSpan}
        style={{
          textAlign: 'right',
          color: theme.textWhite,
        }}
      >
        {rightComponent}
      </Col>
    </RowStyled>
  );
};

export default SwapSection;
