import { Col, Row } from "antd";
import { ThemeContext } from "styled-components";
import React, { useContext } from "react";

const LabelValue = ({ label, value, unit, onClick }) => {
  const theme = useContext(ThemeContext);
  return (
    <Row
      gutter={16}
      style={{
        padding: "4px 0",
        fontSize: "0.85rem",
      }}
    >
      <Col
        span={12}
        style={{
          color: theme.textDim,
        }}
      >
        {label}
      </Col>
      <Col
        span={12}
        style={{
          textAlign: "right",
          color: theme.textWhite,
          cursor: onClick ? "pointer" : "inherit",
        }}
        onClick={() => {
          if (onClick) {
            onClick();
          }
        }}
      >
        {value}

        {unit ? (
          <span
            style={{
              minWidth: "40px",
              textAlign: "right",
              userSelect: "none",
              paddingLeft: "4px",
            }}
          >
            {unit}
          </span>
        ) : (
          <span />
        )}
      </Col>
    </Row>
  );
};

export default LabelValue;
