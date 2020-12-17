import { history } from 'redux/configureStore';
import I from 'components/I';
import MakrdownPage from 'components/MarkdownPage';
import React from 'react';

import styled from 'styled-components';

import {
  MenuFontAwesomeIcon,
  SideBarButton,
  SideBarGroupLabel,
} from 'components/SideBarDrawer';
import { faServer } from '@fortawesome/free-solid-svg-icons/faServer';

const SideBarButtonAlt = styled(SideBarButton)`
  &[disabled],
  &[disabled]:hover {
    background-color: ${(props) => props.theme.foreground}!important;
    color: ${(props) => props.theme.textBright}!important;
  }
`;

const TokenSideBarButtonAlt = styled(SideBarButtonAlt)`
  padding-left: 20px;
`;

const SideNavigation = ({ current }) => {
  return (
    <div style={{ padding: '24px 0' }}>
      <SideBarGroupLabel>
        <I s="Support" />
      </SideBarGroupLabel>

      <SideBarButtonAlt
        disabled={current === 'system-status'}
        onClick={() => history.push('/support/system-status')}
      >
        <MenuFontAwesomeIcon icon={faServer} />
        <I s="System Status" />
      </SideBarButtonAlt>

      <SideBarGroupLabel>
        <I s="Digital Asset List" />
      </SideBarGroupLabel>

      <TokenSideBarButtonAlt
        disabled={current === 'eth'}
        onClick={() => history.push('/support/eth')}
      >
        <I s="ETH - Ethereum" />
      </TokenSideBarButtonAlt>

      <TokenSideBarButtonAlt
        disabled={current === 'lrc'}
        onClick={() => history.push('/support/lrc')}
      >
        <I s="LRC - Loopring" />
      </TokenSideBarButtonAlt>

      <TokenSideBarButtonAlt
        disabled={current === 'usdt'}
        onClick={() => history.push('/support/usdt')}
      >
        <I s="USDT - Tether USD" />
      </TokenSideBarButtonAlt>

      <TokenSideBarButtonAlt
        disabled={current === 'dai'}
        onClick={() => history.push('/support/dai')}
      >
        <I s="DAI - Dai Stablecoin" />
      </TokenSideBarButtonAlt>

      <TokenSideBarButtonAlt
        disabled={current === 'link'}
        onClick={() => history.push('/support/link')}
      >
        <I s="LINK - ChainLink" />
      </TokenSideBarButtonAlt>
    </div>
  );
};

const SystenStatusPage = () => {
  return (
    <MakrdownPage
      navigation={<SideNavigation current="system-status" />}
      fileName="SystemStatus.md"
    />
  );
};

const SupportEthPage = () => {
  return (
    <MakrdownPage
      navigation={<SideNavigation current="eth" />}
      fileName="asset_list/ETH.md"
    />
  );
};

const SupportLrcPage = () => {
  return (
    <MakrdownPage
      navigation={<SideNavigation current="lrc" />}
      fileName="asset_list/LRC.md"
    />
  );
};

const SupportUsdtPage = () => {
  return (
    <MakrdownPage
      navigation={<SideNavigation current="usdt" />}
      fileName="asset_list/USDT.md"
    />
  );
};

const SupportDaiPage = () => {
  return (
    <MakrdownPage
      navigation={<SideNavigation current="dai" />}
      fileName="asset_list/DAI.md"
    />
  );
};

const SupportLinkPage = () => {
  return (
    <MakrdownPage
      navigation={<SideNavigation current="link" />}
      fileName="asset_list/LINK.md"
    />
  );
};

export {
  SystenStatusPage,
  SupportEthPage,
  SupportLrcPage,
  SupportUsdtPage,
  SupportDaiPage,
  SupportLinkPage,
};
