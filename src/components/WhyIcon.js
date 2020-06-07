import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeContext } from "styled-components";
import { Tooltip } from "antd";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import I from "components/I";
import React, { useContext } from "react";

const WhyIcon = ({ text, color, description }) => {
  const theme = useContext(ThemeContext);
  let title = (
    <div>
      <div>
        <I s={text} />
      </div>
      {description && (
        <div
          style={{
            paddingTop: "8px",
          }}
        >
          <I s={description} />
        </div>
      )}
    </div>
  );

  return (
    <Tooltip placement="bottom" title={title}>
      <FontAwesomeIcon
        style={{
          color: color ? color : theme.primary,
          marginLeft: "8px",
          height: "11px",
          width: "11px",
        }}
        icon={faQuestionCircle}
      />
    </Tooltip>
  );
};

export default WhyIcon;
