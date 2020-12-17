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
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';

const SideBarButtonAlt = styled(SideBarButton)`
  &[disabled],
  &[disabled]:hover {
    background-color: ${(props) => props.theme.foreground}!important;
    color: ${(props) => props.theme.textBright}!important;
  }
`;
const SideNavigation = ({ current }) => {
  return (
    <div style={{ padding: '24px 0' }}>
      <SideBarGroupLabel>
        <I s="Documentation" />
      </SideBarGroupLabel>
      <SideBarButtonAlt
        disabled={current === 'fees'}
        onClick={() => history.push('/document/fees')}
      >
        <MenuFontAwesomeIcon icon={faFileAlt} />
        <I s="Fee Schedule" />
      </SideBarButtonAlt>
    </div>
  );
};

const FeesPage = () => {
  return (
    <MakrdownPage
      navigation={<SideNavigation current="fees" />}
      fileName="Fees.md"
    />
  );
};

const ListingPage = () => {
  return (
    <MakrdownPage
      navigation={<SideNavigation current="listing" />}
      fileName="Listing.md"
    />
  );
};

const Beta1RewardsPage = () => {
  return (
    <MakrdownPage
      navigation={<SideNavigation current="beta1" />}
      fileName="Beta1Rewards.md"
    />
  );
};

export { FeesPage, ListingPage, Beta1RewardsPage };
