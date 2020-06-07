import { Col, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeContext } from "styled-components";
import I from "components/I";
import React, { useContext } from "react";

import { faCircleNotch } from "@fortawesome/free-solid-svg-icons/faCircleNotch";

const WalletConnectIndicator = () => {
  const theme = useContext(ThemeContext);
  return (
    <Row
      style={{
        marginTop: "10px",
      }}
    >
      <Col span={4}>
        <div
          style={{
            textAlign: "right",
            marginRight: "4px",
          }}
        >
          <img
            alt="check walletconnect plugin icon"
            style={{
              userSelect: "none",
              height: "45px",
              marginTop: "16px",
              filter: "drop-shadow(0 10px 10px rgba(0, 0, 0, 0.2)",
            }}
            src="/assets/images/WalletConnect.svg"
          />
        </div>
      </Col>
      <Col span={20}>
        <div>
          <div
            style={{
              textAlign: "left",
              margin: "20px 0px 0px 16px",
              fontSize: "1rem",
              color: theme.textWhite,
            }}
          >
            <I s="walletConnectConfirm" />
          </div>

          <div
            style={{
              fontSize: "1rem",
              color: theme.primary,
            }}
          >
            <div
              style={{
                textAlign: "left",
                margin: "4px 0px 0px 16px",
              }}
            >
              <I s={"walletConnectPendingTxTip"} />
              <FontAwesomeIcon
                icon={faCircleNotch}
                size="1x"
                spin
                style={{ color: theme.primary, marginLeft: "8px" }}
              />
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default WalletConnectIndicator;
