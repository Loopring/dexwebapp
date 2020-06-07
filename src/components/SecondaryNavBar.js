import { history } from "redux/configureStore";
import I from "components/I";
import React, { useContext } from "react";

import { Button } from "antd";
import {
  saveLastAccountPage,
  saveLastOrderPage,
} from "lightcone/api/localStorgeAPI";
import styled, { ThemeContext } from "styled-components";

const NavButtonWrapper = styled(Button)`
  background-color: transparent !important;
  height: 46px !important;
  margin-right: 10px !important;
  margin-left: 10px !important;
  color: ${(props) => props.theme.textDim}!important;
  border-width: 0 !important;
  border-style: none !important;
  font-weight: 600 !important;
  font-size: 0.9rem !important;

  &:hover {
    color: ${(props) => props.theme.primary}!important;
  }
  &[disabled] {
    cursor: pointer !important;
    color: ${(props) => props.theme.primary}!important;
  }
`;

const NavButton = ({ selected, id, label, href }) => {
  return (
    <NavButtonWrapper
      disabled={selected === id}
      onClick={() => {
        history.push(href);

        if (href.includes("orders")) {
          saveLastOrderPage(id);
        } else if (href.includes("account")) {
          saveLastAccountPage(id);
        }
      }}
    >
      {label}
    </NavButtonWrapper>
  );
};

const SecondaryNavBar = ({ selected, subPages }) => {
  const theme = useContext(ThemeContext);
  return (
    <div
      style={{
        paddingLeft: "260px",
        paddingRight: "60px",
        paddingBottom: "0px",
        borderWidth: "0px",
        backgroundColor: theme.secondaryNavbarBackground,
      }}
    >
      <Button.Group
        style={{
          borderRadius: "0px",
          borderWidth: "0px",
          paddingBottom: "0px",
        }}
      >
        {subPages.map((config, i) => (
          <NavButton
            key={i}
            selected={selected}
            id={config.id}
            href={config.url}
            label={<I s={config.label} />}
          />
        ))}
      </Button.Group>
    </div>
  );
};

export default SecondaryNavBar;
