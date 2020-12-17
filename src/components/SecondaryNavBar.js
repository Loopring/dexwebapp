import { connect } from 'react-redux';
import { history } from 'redux/configureStore';
import { tracker } from 'components/DefaultTracker';
import { withUserPreferences } from 'components/UserPreferenceContext';
import I from 'components/I';
import React from 'react';
import styled, { withTheme } from 'styled-components';

import { Button } from 'antd';
import {
  saveLastAccountPage,
  saveLastOrderPage,
} from 'lightcone/api/localStorgeAPI';

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

        if (href.includes('orders')) {
          saveLastOrderPage(id);
        } else if (href.includes('account')) {
          saveLastAccountPage(id);
        }

        tracker.trackEvent({
          type: 'LOCATION_CHANGE',
          data: {
            location: href,
          },
        });
      }}
    >
      {label}
    </NavButtonWrapper>
  );
};

class SecondaryNavBar extends React.Component {
  render() {
    // Hide some pages if the account is not logged in.
    let subPages = [];
    if (this.props.subPages && this.props.exchange.isInitialized) {
      for (let i = 0; i < this.props.subPages.length; i++) {
        if (this.props.dexAccount.account.state !== 'LOGGED_IN') {
          if (this.props.subPages[i].url === '/liquidity-mining/rewards') {
            continue;
          }
        }
        subPages.push(this.props.subPages[i]);
      }
    }

    return (
      <div
        style={{
          paddingLeft: '260px',
          paddingRight: '60px',
          paddingBottom: '0px',
          borderWidth: '0px',
          height: '46px',
          backgroundColor: this.props.theme.secondaryNavbarBackground,
        }}
      >
        <Button.Group
          style={{
            borderRadius: '0px',
            borderWidth: '0px',
            paddingBottom: '0px',
          }}
        >
          {subPages.map((config, i) => (
            <NavButton
              key={i}
              selected={this.props.selected}
              id={config.id}
              href={config.url}
              label={<I s={config.label} />}
            />
          ))}
        </Button.Group>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { dexAccount, exchange } = state;
  return { dexAccount, exchange };
};

export default withUserPreferences(
  withTheme(connect(mapStateToProps, null)(SecondaryNavBar))
);
