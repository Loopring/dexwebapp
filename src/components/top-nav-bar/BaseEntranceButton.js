import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ThemeContext } from "styled-components";

import React, { useContext } from "react";

import AppLayout from "AppLayout";

const BaseEntranceButton = ({
  icon,
  spin,
  title,
  color,
  backgroundcolor,
  onMouseEnter,
}) => {
  const theme = useContext(ThemeContext);
  return (
    <div
      style={{
        cursor: "default",
        display: "flex",

        alignItems: "center",
        justifyContent: "center",
        height: AppLayout.topNavBarHeight,
      }}
    >
      <div onMouseEnter={onMouseEnter}>
        <Button
          disabled
          style={{
            cursor: "pointer",
            borderRadius: "4px",
            marginRight: "12px",
            marginLeft: "12px",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: "600",
            minWidth: "164px",
            color: color || theme.textWhite,
            backgroundColor: backgroundcolor,
          }}
        >
          <FontAwesomeIcon
            style={{
              width: "14px",
              height: "14px",
              marginRight: "12px",
            }}
            icon={icon}
            spin={spin || false}
          />
          <span>{title}</span>
        </Button>
      </div>
    </div>
  );
};

export default BaseEntranceButton;
