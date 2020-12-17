import {
  MenuFontAwesomeIcon,
  SideBarButton,
  SideBarGroupLabel,
} from 'components/SideBarDrawer';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { history } from 'redux/configureStore';
import I from 'components/I';
import LegalTemplate from './components/LegalTemplate';
import React, { useContext } from 'react';

import styled, { ThemeContext } from 'styled-components';

const SideBarButtonAlt = styled(SideBarButton)`
  &[disabled],
  &[disabled]:hover {
    background-color: ${(props) => props.theme.foreground}!important;
    color: ${(props) => props.theme.textBright}!important;
  }
`;
const SideNavigation = ({ current }) => {
  const theme = useContext(ThemeContext);

  return (
    <div style={{ padding: '24px 0' }}>
      <SideBarGroupLabel>
        <I s="Legal Documents" />
      </SideBarGroupLabel>
      <SideBarButtonAlt
        disabled={current === 'terms'}
        onClick={() => history.push('/legal/terms')}
      >
        <MenuFontAwesomeIcon icon={faFileAlt} />
        <I s="Terms of Use" />
      </SideBarButtonAlt>

      <SideBarButtonAlt
        disabled={current === 'privacy'}
        onClick={() => history.push('/legal/privacy-policy')}
      >
        <MenuFontAwesomeIcon icon={faFileAlt} />
        <I s="Privacy Policy" />
      </SideBarButtonAlt>

      <SideBarButtonAlt
        disabled={current === 'cookie'}
        onClick={() => history.push('/legal/cookie-policy')}
      >
        <MenuFontAwesomeIcon icon={faFileAlt} />
        <I s="Cookie Policy" />
      </SideBarButtonAlt>

      <SideBarButtonAlt
        disabled={current === 'disclaimer'}
        onClick={() => history.push('/legal/disclaimer')}
      >
        <MenuFontAwesomeIcon icon={faFileAlt} />
        <I s="Disclaimer" />
      </SideBarButtonAlt>

      <div
        style={{
          fontSize: '0.8rem',

          color: theme.textDim,
          padingTop: '24px',
          margin: '24px',
        }}
      >
        <I s="NoChineseDocument" />
      </div>
    </div>
  );
};

const TermsPage = () => {
  return (
    <LegalTemplate
      navigation={<SideNavigation current="terms" />}
      src="https://app.termly.io/document/terms-of-use-for-website/a3ba9520-8d44-4f27-aafa-e8541c4fbe41"
    />
  );
};

const DisclaimerPage = () => {
  return (
    <LegalTemplate
      navigation={<SideNavigation current="disclaimer" />}
      src="https://app.termly.io/document/disclaimer/c2e3b92e-6bb5-4f42-9582-a887ceb92742"
    />
  );
};

const PrivacyPolicyPage = () => {
  return (
    <LegalTemplate
      navigation={<SideNavigation current="privacy" />}
      src="https://app.termly.io/document/privacy-policy/740b0507-cd76-496c-8109-5eb68fc24aba"
    />
  );
};

const CookiePolicyPage = () => {
  return (
    <LegalTemplate
      navigation={<SideNavigation current="cookie" />}
      src="https://app.termly.io/document/cookie-policy/b1750f23-1855-4923-9a4a-88904894b2c6"
    />
  );
};

export { TermsPage, DisclaimerPage, PrivacyPolicyPage, CookiePolicyPage };
