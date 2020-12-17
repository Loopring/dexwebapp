import { Button, Drawer, Layout } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppLayout from 'AppLayout';
import React, { useContext } from 'react';

import styled, { ThemeContext } from 'styled-components';

const { Content } = Layout;

const SideBarGroupLabel = styled.div`
  color: ${(props) => props.theme.textDim};
  font-size: 0.85rem;
  font-weight: 600;
  padding-left: 20px;
  margin-top: 12px;
  margin-bottom: 8px;
`;

const SideBarGroupSeperator = styled.div`
  color: ${(props) => props.theme.textDim};
  height: 1px;
  background: ${(props) => props.theme.seperator};
  margin-top: 12px;
  margin-bottom: 12px;
  width: 100%;
`;

const SideBarButton = styled(Button)`
  background-color: transparent !important;
  font-size: 0.95rem !important;
  border: none !important;
  width: 100% !important;
  text-align: left !important;
  padding: inherit 24px !important;
  border-radius: 0 !important;
  height: 40px !important;
  line-height: 1rem !important;
  color: ${(props) =>
    props.colortxt ? props.colortxt : props.theme.textSidebarMenu}!important;

  &:hover {
    background: ${(props) =>
      props.hoverbg ? props.hoverbg : props.theme.primary}!important;
    color: ${(props) => props.theme.textBigButton}!important;
  }

  &[disabled],
  &[disabled]:hover {
    background-color: transparent !important;
    color: ${(props) => props.theme.inputPlaceHolderColor}!important;
  }
`;

const MenuFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin-left: 0;
  margin-right: 4px;
  min-width: 24px;
  text-align: center;
  display: inline-block；
  opacity: 0.85;
`;

const SideBarDrawer = ({ header, body, footer, onClose, visible }) => {
  const theme = useContext(ThemeContext);
  return (
    <Drawer
      width={241}
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
      drawerStyle={{
        fontSize: '0.85rem',
        background: theme.sidePanelBackground,
      }}
      bodyStyle={{
        padding: '0',
      }}
      headerStyle={{
        height: 0,
      }}
    >
      <Layout
        onMouseLeave={onClose}
        style={{
          background: 'transparent',
          height: '100vh',
        }}
      >
        <div
          style={{
            background: theme.popupHeaderBackground,
            textAlign: 'center',
            width: '100%',
            height: AppLayout.topNavBarHeight,
            lineHeight: AppLayout.topNavBarHeight,
          }}
        >
          {header}
        </div>
        <Content>{body}</Content>
      </Layout>
    </Drawer>
  );
};

export {
  MenuFontAwesomeIcon,
  SideBarGroupSeperator,
  SideBarGroupLabel,
  SideBarButton,
  SideBarDrawer,
};
