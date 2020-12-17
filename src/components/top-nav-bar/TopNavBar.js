import { connect } from 'react-redux';
import React from 'react';
import styled, { withTheme } from 'styled-components';

import { Button, ConfigProvider, Menu } from 'antd';
import AppLayout from 'AppLayout';
import I from 'components/I';

import { history } from 'redux/configureStore';
import { tracker } from 'components/DefaultTracker';
import SiteLogo from 'components/top-nav-bar/SiteLogo';

import { fetchAllExchangeInfo } from 'redux/actions/ExchangeInfo';
import ConfirmLogoutModal from 'modals/LogoutModal';
import ConnectToWalletModal from 'modals/ConnectToWalletModal';
import DepositModal from 'modals/DepositModal';
import DexAccountBalanceService from 'components/services/DexAccountBalanceService';
import DexAccountOrderService from 'components/services/DexAccountOrderService';
import DexAccountService from 'components/services/DexAccountService';
import ExportAccountModal from 'modals/ExportAccountModal';
import LoginModal from 'modals/LoginModal';
import ReferralModal from 'modals/ReferralModal';
import WalletConnectIndicatorModal from 'modals/WalletConnectIndicatorModal';

import TransferModal from 'modals/TransferModal';
import WechatModal from 'modals/WechatModal';

import AuthereumService from 'components/services/wallet-services/AuthereumService';
import MetaMaskService from 'components/services/wallet-services/MetaMaskService';
import MewConnectService from 'components/services/wallet-services/MewConnectService';
import WalletConnectService from 'components/services/wallet-services/WalletConnectService';
import WalletLinkService from 'components/services/wallet-services/WalletLinkService';
import WalletService from 'components/services/wallet-services/WalletService';

import NewRegisterAccountModal from 'modals/NewRegisterAccountModal';
import ResetAccountKeyModal from 'modals/ResetAccountKeyModal';
import ResetApiKeyModal from 'modals/ResetApiKeyModal';
import WebSocketService from 'components/services/WebSocketService';
import WithdrawModal from 'modals/WithdrawModal';

import { fetchLegalPrice } from 'redux/actions/LegalPrice';

import { LOGGED_IN } from 'redux/actions/DexAccount';

import {
  getLastAccountPage,
  getLastOrderPage,
  getLastPoolPage,
  getLastTradePage,
} from 'lightcone/api/localStorgeAPI';
import config from 'lightcone/config';

import { NavButtonWrapper } from 'styles/Styles';

import EntranceButton from 'components/top-nav-bar/EntranceButton';

import { notifyError } from 'redux/actions/Notification';

import SettingsPopover from 'components/top-nav-bar/SettingsPopover';

const LoopringWalletButton = styled(Button)`
  color: ${(props) => props.theme.primary};
  cursor: pointer;
  margin-left: 6px;
  margin-right: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  background-color: ${(props) => props.theme.background} !important;

  &:hover {
    color: ${(props) => props.theme.lightblue} !important;
  }

  &: [disabled] {
    color: ${(props) => props.theme.textDim} !important;
  }
`;

const NavButton = styled(Button)`
  && {
    padding-left: 8px !important;
    padding-right: 8px !important;
    font-size: 1.2rem !important;
    font-weight: 600 !important;
    background-color: transparent !important;
    height: ${AppLayout.topNavBarHeight}!important;
    color: ${(props) =>
      props.active === 1 ? props.theme.textBright : props.theme.textDim};
    border: none !important;
    border-radius: 0 !important;
    border-bottom-style: solid !important;
    border-bottom-width: 3px !important;
    border-bottom-color: ${(props) =>
      props.active === 1
        ? props.theme.primary + '!important'
        : 'transparent!important'};
  }
  &:hover {
    color: ${(props) => props.theme.textBright}!important;
  }

  &[disabled],
  &[disabled]:hover {
    color: ${(props) => props.theme.textDim}!important;
  }
`;

const NavMenu = styled(Menu)`
  && {
    color: ${(props) => props.theme.textDim}!important;
    background: ${(props) => props.theme.background}!important;
  }
`;

class TopNavBar extends React.Component {
  state = {
    lastTradePage: getLastTradePage(),
    isSettingsVisible: false,
  };

  componentDidMount() {
    const inMaintenanceMode = config.getMaintenanceMode();
    if (inMaintenanceMode === false) {
      this.props.fetchAllExchangeInfo();
      this.mainFunctionToCallAPI();
    } else {
      history.push('/maintenance');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.pathname && this.props.pathname === '/invite') {
      notifyError(
        <span>
          <I s="IsNotInviteLink" />
        </span>,
        this.props.theme
      );
      history.push('/404');
      return;
    }
  }

  mainFunctionToCallAPI = () => {
    (async () => {
      try {
        this.props.fetchLegalPrice(
          this.props.legalPrice.legal,
          this.props.source
        );
      } catch (error) {
      } finally {
      }
    })();
  };

  pushToTradePage = () => {
    const lastTradePage = getLastTradePage();
    if (lastTradePage) {
      const options = this.props.markets.filter(
        (market) => market.enabled && market.market === lastTradePage
      );
      if (options.length > 0) {
        history.push('/trade/' + lastTradePage);
        return;
      }
    }
    history.push('/trade/' + this.props.currentMarket);
  };

  pushToSwapPage = () => {
    history.push('/swap');
  };

  handleSettingsVisibleChange = (isSettingsVisible) => {
    this.setState({ isSettingsVisible });

    tracker.trackEvent({
      type: 'LOCATION_CHANGE',
      data: {
        location: 'settings-popover',
        visible: isSettingsVisible,
      },
    });
  };

  render() {
    const theme = this.props.theme;
    const { account } = this.props.dexAccount;

    const onMaintenancePage = this.props.pathname.includes('/maintenance');
    const onTradePage =
      this.props.pathname.includes('/trade/') ||
      this.props.pathname.includes('/invite');
    const disableTopTabs =
      this.props.pathname.includes('/document/') ||
      this.props.pathname.includes('/legal/') ||
      this.props.pathname.includes('/support/');

    const usesidepanelbackground =
      onTradePage || disableTopTabs ? 'true' : 'false';
    return (
      <div>
        <ConfigProvider>
          <div
            className="desktop-layout"
            style={{
              borderTopStyle: 'none',
              borderBottomStyle: 'none',
            }}
            ref={(menuButton) => (this._settingsButtonElement = menuButton)}
          >
            <NewRegisterAccountModal refer_id={this.state.refer_id} />
            <LoginModal />
            <DepositModal />
            <TransferModal />
            <ResetAccountKeyModal />
            <ResetApiKeyModal />
            <WithdrawModal />
            <MetaMaskService />
            <WalletConnectService />
            <MewConnectService />
            <AuthereumService />
            <WalletService />
            <WalletLinkService />
            <DexAccountBalanceService />
            <DexAccountOrderService />
            <DexAccountService />
            <WebSocketService {...this.props} />

            <WechatModal />
            <ReferralModal />
            <ConfirmLogoutModal />
            <ConnectToWalletModal />
            <ExportAccountModal />
            <WalletConnectIndicatorModal />
            {/* <SwapSelectTokenModal /> */}

            <NavMenu
              mode="horizontal"
              style={{
                borderBottomColor: 'transparent',
              }}
            >
              <NavButtonWrapper
                key="logo"
                usesidepanelbackground={usesidepanelbackground}
                style={{
                  width: `calc(${AppLayout.tradePanelWidth})`,
                  height: AppLayout.topNavBarHeight,
                  marginLeft: '0px',
                }}
              >
                <SiteLogo pushToPage={this.pushToSwapPage} />
              </NavButtonWrapper>

              {onMaintenancePage === false && (
                <NavButtonWrapper key="swap" disabled={disableTopTabs}>
                  <NavButton
                    active={this.props.pathname.includes('swap') ? 1 : 0}
                    onClick={() => {
                      history.push('/swap');
                    }}
                  >
                    <I s="Swap" />
                  </NavButton>
                </NavButtonWrapper>
              )}

              {onMaintenancePage === false && (
                <NavButtonWrapper key="pool" disabled={disableTopTabs}>
                  <NavButton
                    active={this.props.pathname.includes('pool') ? 1 : 0}
                    onClick={() => {
                      if (getLastPoolPage() === '') {
                        history.push('/pool');
                      } else {
                        history.push(`/pool/${getLastPoolPage()}`);
                      }
                    }}
                  >
                    <I s="Pool" />
                  </NavButton>
                </NavButtonWrapper>
              )}

              {/* {onMaintenancePage === false && (
                <NavButtonWrapper
                  key="liquidity-mining"
                  disabled={disableTopTabs}
                >
                  <NavButton
                    active={
                      this.props.pathname.includes('liquidity-mining') ? 1 : 0
                    }
                    onClick={() => {
                      history.push('/liquidity-mining/rewards');
                    }}
                  >
                    <I s="Liquidity Mining" />
                  </NavButton>
                </NavButtonWrapper>
              )} */}

              {onMaintenancePage === false && (
                <NavButtonWrapper key="trade" disabled={disableTopTabs}>
                  <NavButton
                    active={onTradePage ? 1 : 0}
                    onClick={() => {
                      this.pushToTradePage();
                    }}
                  >
                    <I s="Trade" />
                  </NavButton>
                </NavButtonWrapper>
              )}

              {onMaintenancePage === false && (
                <NavButtonWrapper key="orders" disabled={disableTopTabs}>
                  <NavButton
                    active={this.props.pathname.includes('orders') ? 1 : 0}
                    onClick={() => {
                      history.push(`/orders/${getLastOrderPage()}`);
                    }}
                    disabled={account.state !== LOGGED_IN}
                  >
                    <I s="Orders" />
                  </NavButton>
                </NavButtonWrapper>
              )}
              {onMaintenancePage === false && (
                <NavButtonWrapper key="account" disabled={disableTopTabs}>
                  <NavButton
                    active={this.props.pathname.includes('account') ? 1 : 0}
                    onClick={() => {
                      history.push(`/account/${getLastAccountPage()}`);
                    }}
                    disabled={account.state !== LOGGED_IN}
                  >
                    <I s="Account" />
                  </NavButton>
                </NavButtonWrapper>
              )}

              {onMaintenancePage === false && (
                <NavButtonWrapper
                  key="entrance-button"
                  style={{
                    float: 'right',
                    paddingLeft: '0px',
                    paddingRight: '0px',
                    height: '50px',
                  }}
                >
                  <EntranceButton />
                </NavButtonWrapper>
              )}

              {onMaintenancePage === false && (
                <NavButtonWrapper
                  key="entrance-button-setting-popover"
                  style={{
                    float: 'right',
                    paddingLeft: '0px',
                    paddingRight: '0px',
                    height: '50px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                    }}
                  >
                    <SettingsPopover
                      visible={this.state.isSettingsVisible}
                      onVisibleChange={this.handleSettingsVisibleChange}
                    />
                  </span>
                </NavButtonWrapper>
              )}

              <NavButtonWrapper
                key="loopring-wallet-button"
                style={{
                  float: 'right',
                  paddingLeft: '0px',
                  paddingRight: '0px',
                  height: '50px',
                }}
              >
                <div
                  style={{
                    cursor: 'default',
                    display: 'flex',

                    alignItems: 'center',
                    justifyContent: 'center',
                    height: AppLayout.topNavBarHeight,
                  }}
                >
                  <LoopringWalletButton
                    style={{
                      paddingLeft: '1px',
                    }}
                    onClick={() => {
                      window.open('https://loopring.io', '_blank');
                    }}
                  >
                    <I s="Loopring Wallet" />
                  </LoopringWalletButton>
                </div>
              </NavButtonWrapper>

              <NavButtonWrapper
                key="loopring-3-1-button"
                style={{
                  float: 'right',
                  paddingLeft: '0px',
                  paddingRight: '0px',
                  height: '50px',
                }}
              >
                <div
                  style={{
                    cursor: 'default',
                    display: 'flex',

                    alignItems: 'center',
                    justifyContent: 'center',
                    height: AppLayout.topNavBarHeight,
                  }}
                >
                  <LoopringWalletButton
                    style={{
                      paddingRight: '0px',
                    }}
                    onClick={() => {
                      window.open('https://v1.loopring.io', '_blank');
                    }}
                  >
                    <I s="Go to Loopring v1" />
                  </LoopringWalletButton>
                </div>
              </NavButtonWrapper>
            </NavMenu>
          </div>

          <div className="mobile-layout">
            <NavMenu mode="horizontal">
              <NavButtonWrapper
                key="logo"
                style={{
                  height: AppLayout.topNavBarHeight,
                  background: theme.background + '!important',
                  borderRightStyle: 'solid',
                  borderRightWidth: '1px',
                  borderRightColor: theme.foreground,
                }}
              >
                <SiteLogo pushToPage={this.pushToSwapPage} />
              </NavButtonWrapper>
              {onMaintenancePage === false && (
                <NavButtonWrapper key="swap" disabled={disableTopTabs}>
                  <NavButton
                    active={this.props.pathname.includes('swap') ? 1 : 0}
                    onClick={() => {
                      history.push('/swap');
                    }}
                  >
                    <I s="Swap" />
                  </NavButton>
                </NavButtonWrapper>
              )}

              {onMaintenancePage === false && (
                <NavButtonWrapper key="pool" disabled={disableTopTabs}>
                  <NavButton
                    active={this.props.pathname.includes('pool') ? 1 : 0}
                    onClick={() => {
                      if (getLastPoolPage() === '') {
                        history.push('/pool');
                      } else {
                        history.push(`/pool/${getLastPoolPage()}`);
                      }
                    }}
                  >
                    <I s="Pool" />
                  </NavButton>
                </NavButtonWrapper>
              )}
            </NavMenu>
          </div>
        </ConfigProvider>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { pathname } = state.router.location;
  const { dexAccount, legalPrice, currentMarket, exchange } = state;
  return {
    pathname,
    dexAccount,
    legalPrice,
    currentMarket: currentMarket.current,
    markets: exchange.markets,
    source: exchange.legalPriceSource,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLegalPrice: (legal, source) =>
      dispatch(fetchLegalPrice(legal, source)),
    fetchAllExchangeInfo: () => dispatch(fetchAllExchangeInfo()),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(TopNavBar)
);
