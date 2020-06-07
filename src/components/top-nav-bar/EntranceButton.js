import { Button, notification } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { faArrowAltCircleDown } from "@fortawesome/free-solid-svg-icons/faArrowAltCircleDown";
import { faArrowAltCircleUp } from "@fortawesome/free-solid-svg-icons/faArrowAltCircleUp";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import { faCode } from "@fortawesome/free-solid-svg-icons/faCode";
import { faCrown } from "@fortawesome/free-solid-svg-icons/faCrown";
import { faKey } from "@fortawesome/free-solid-svg-icons/faKey";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { faLockOpen } from "@fortawesome/free-solid-svg-icons/faLockOpen";
import { faPlug } from "@fortawesome/free-solid-svg-icons/faPlug";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons/faUserCircle";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons/faUserFriends";
import { faWaveSquare } from "@fortawesome/free-solid-svg-icons/faWaveSquare";
import { history } from "redux/configureStore";
import {
  loginModal,
  registerAccountModal,
  resetPasswordModal,
  showConnectToWalletModal,
  showDepositModal,
  showExportAccountModal,
  showLogoutModal,
  showReferralModal,
  showSideBar,
  showTransferModal,
  showWithdrawModal,
} from "redux/actions/ModalManager";
import I from "components/I";
import React from "react";
import WhyIcon from "components/WhyIcon";
import styled, { withTheme } from "styled-components";

import { ActionButton } from "styles/Styles";

import BaseEntranceButton from "components/top-nav-bar/BaseEntranceButton";

import { AddressAvatarButton } from "./side-bar/AddressAvatarButton";
import CommonLinks from "./side-bar/CommonLinks";
import MyAddressLinks from "./side-bar/MyAddressLinks";

import {
  LOGGED_IN,
  NOT_REGISTERED,
  REGISTERED,
  REGISTERING,
  RESETTING,
  UNDEFINED,
  WALLET_UNCONNECTED,
  updateAccount,
} from "redux/actions/DexAccount";
import { notifyWarning } from "redux/actions/Notification";

import {
  MenuFontAwesomeIcon,
  SideBarButton,
  SideBarDrawer,
  SideBarGroupLabel,
  SideBarGroupSeperator,
} from "../SideBarDrawer";

const SideBarDiv = styled.div`
  padding-top: 32px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;

const AccountToolTipDiv = styled.div`
  font-size: 0.9rem;
  margin: 32px;
  color: ${(props) => props.theme.textWhite};
`;

const SwitchWalletButton = styled(Button)`
  color: ${(props) => props.theme.primary};
  font-size: 0.9rem !important;
  font-weight: 400 !important;
  text-transform: none !important;
  background: transparent !important;
  border: none;
  margin-top: -12px !important;

  &:hover {
    color: ${(props) => props.theme.lightblue} !important;
  }

  &: [disabled] {
    color: ${(props) => props.theme.textDim} !important;
  }
`;

class EntranceButton extends React.Component {
  state = {
    buttonType: "UNKNOWN",
  };

  defaultButton = (
    <BaseEntranceButton
      icon={faSpinner}
      spin
      title={
        <span style={{ color: this.props.theme.textDim }}>
          <I s="Loading..." />
        </span>
      }
      color={this.props.theme.textDim}
      backgroundcolor={this.props.theme.sidePanelBackground}
    />
  );
  pendingButtonJob = null;
  pendingButton = {
    type: this.state.buttonType,
    button: this.defaultButton,
  };

  getWalletAddress = () => {
    let walletAddress = "";
    if (
      typeof this.props.dexAccount.account !== "undefined" &&
      typeof this.props.dexAccount.account.address !== "undefined" &&
      window.wallet
    ) {
      walletAddress = this.props.dexAccount.account.address;
      walletAddress =
        walletAddress.substring(0, 7) + "..." + walletAddress.slice(-7);
    }
    return walletAddress;
  };

  showConnectToWalletModal = () => {
    this.props.showConnectToWalletModal(true);
    this.props.showSideBar(false);
  };

  showRegisterAccountModal = () => {
    this.props.registerAccountModal(true);
    this.props.showSideBar(false);
  };

  pressedExportAccountButton = () => {
    this.props.showExportAccountModal(true);
    this.props.showSideBar(false);
  };

  pressedLogoutButton = () => {
    this.props.showLogoutModal(true);
    this.props.showSideBar(false);
  };

  pressedDepositButton = () => {
    this.props.showDepositModal(true);
    this.props.showSideBar(false);
  };

  pressedWithdrawButton = () => {
    this.props.showWithdrawModal(true);
    this.props.showSideBar(false);
  };

  pressedTransferButton = () => {
    this.props.showTransferModal(true);
    this.props.showSideBar(false);
  };

  pressedResetPasswordButton = () => {
    this.props.resetPasswordModal(true);
    this.props.showSideBar(false);
  };

  pressedReferralButton = () => {
    this.props.showReferralModal(true);
    this.props.showSideBar(false);
  };

  showSideBar = () => {
    notification.destroy();
    this.props.showSideBar(true);
  };

  updateAccountStateInRedux(state) {
    const { dexAccount, updateAccount } = this.props;
    const { account } = dexAccount;
    updateAccount({
      ...account,
      state,
    });
  }

  // TODO: replace with debounce
  scheduleButtonUpdate(pendingButton) {
    if (this.pendingButton.type !== pendingButton.type) {
      this.pendingButton = pendingButton;
      clearTimeout(this.pendingButtonJob);

      this.pendingButtonJob = setTimeout(() => {
        this.setState({
          buttonType: pendingButton.type,
        });

        this.checkConnectWalletModal();
      }, pendingButton.timeout || 1500);
    }
  }

  checkConnectWalletModal() {
    setTimeout(() => {
      const { account } = this.props.dexAccount;
      if (this.props.pathname.startsWith("/invite/")) {
        if (
          account.state === WALLET_UNCONNECTED ||
          account.state === UNDEFINED
        ) {
          this.showConnectToWalletModal();
        } else if (account.state === NOT_REGISTERED) {
          this.showRegisterAccountModal();
        } else {
          history.push("/trade");
          notifyWarning(
            <span>
              <I s="AccountHasRegisteredInInviteLink" />
            </span>,
            this.props.theme
          );
        }
      }
    }, 3000);
  }

  createButtonAndDrawer(pendingButton) {
    return (
      <div>
        {pendingButton.button()}
        {pendingButton.drawerContent ? (
          <SideBarDrawer
            header={pendingButton.drawerHeader()}
            body={pendingButton.drawerContent()}
            footer={
              pendingButton.drawerFooter ? (
                pendingButton.drawerFooter()
              ) : (
                <div />
              )
            }
            onClose={() => this.props.showSideBar(false)}
            visible={this.props.isSideBarVisible}
          />
        ) : (
          <span />
        )}
      </div>
    );
  }

  render() {
    const { account } = this.props.dexAccount;
    let isDesiredNetwork = true;
    if (this.props.exchange.isInitialized && window.ethereum) {
      if (window.ethereum.networkVersion) {
        if (
          this.props.exchange.chainId !== Number(window.ethereum.networkVersion)
        ) {
          isDesiredNetwork = false;
        }
      }
      if (window.ethereum.networkId) {
        if (this.props.exchange.chainId !== Number(window.ethereum.chainId)) {
          isDesiredNetwork = false;
        }
      }
    }

    // console.log(
    //   'EntranceButton',
    //   account,
    //   this.props.exchange,
    //   window.ethereum,
    //   isDesiredNetwork
    // );

    if (account.state === WALLET_UNCONNECTED || account.state === UNDEFINED) {
      this.scheduleButtonUpdate({
        type: "WALLET_UNCONNECTED",
        timeout: 3000,
        button: () => (
          <BaseEntranceButton
            onMouseEnter={this.showSideBar}
            icon={faPlug}
            title={<I s="Connect Wallet" />}
            backgroundcolor={this.props.theme.primary}
            color={this.props.theme.textBigButton}
          />
        ),
        drawerHeader: () => {
          return (
            <BaseEntranceButton
              icon={faPlug}
              title={<I s="Connect Wallet" />}
              backgroundcolor={this.props.theme.background}
              color={this.props.theme.textWhite}
            />
          );
        },
        drawerContent: () => {
          return (
            <div>
              <SideBarDiv>
                <FontAwesomeIcon
                  style={{
                    color: this.props.theme.primary,
                  }}
                  size="3x"
                  icon={faPlug}
                />
                <AccountToolTipDiv>
                  <I s="ConnectToWeb3Tip" />
                </AccountToolTipDiv>

                <div style={{ margin: "16px" }}>
                  <ActionButton onClick={() => this.showConnectToWalletModal()}>
                    <I s="Connect Wallet" />
                  </ActionButton>
                </div>
              </SideBarDiv>

              <CommonLinks />
            </div>
          );
        },
      });
    } else if (isDesiredNetwork) {
      switch (account.state) {
        case WALLET_UNCONNECTED:
          break;

        case RESETTING:
          this.scheduleButtonUpdate({
            type: "RESETTING",
            button: () => (
              <BaseEntranceButton
                onMouseEnter={this.showSideBar}
                spin
                icon={faCircleNotch}
                color={this.props.theme.primary}
                backgroundcolor={this.props.theme.sidePanelBackground}
                title={<I s="Resetting Account Key..." />}
              />
            ),
            drawerHeader: () => {
              return (
                <AddressAvatarButton
                  fullAddress={this.props.dexAccount.account.address}
                  address={this.getWalletAddress()}
                />
              );
            },
            drawerContent: () => {
              return (
                <div>
                  <SideBarDiv>
                    <FontAwesomeIcon
                      style={{
                        color: this.props.theme.primary,
                      }}
                      spin
                      size="3x"
                      icon={faCircleNotch}
                    />
                    <AccountToolTipDiv>
                      <I s="AccountKeyResetNotification" />{" "}
                      <WhyIcon text="StatusProcessing" />
                    </AccountToolTipDiv>

                    <div style={{ margin: "16px" }}>
                      <ActionButton
                        buttonbackground={this.props.theme.primary}
                        onClick={this.pressedDepositButton}
                      >
                        <I s="Deposit" />
                      </ActionButton>
                      <SwitchWalletButton
                        style={{
                          marginTop: "16px",
                        }}
                        onClick={() => this.showConnectToWalletModal()}
                      >
                        <I s="Switch Wallet" />
                      </SwitchWalletButton>
                    </div>
                  </SideBarDiv>
                  <MyAddressLinks />

                  <SideBarGroupSeperator />
                  <SideBarGroupLabel>
                    <I s="MenuMyDexAccount" />
                  </SideBarGroupLabel>

                  <SideBarButton
                    key="deposit"
                    onClick={this.pressedDepositButton}
                  >
                    <MenuFontAwesomeIcon icon={faArrowAltCircleDown} />
                    <I s="Deposit" />
                  </SideBarButton>
                  <CommonLinks />
                </div>
              );
            },
          });
          break;

        case NOT_REGISTERED:
          this.scheduleButtonUpdate({
            type: "NOT_REGISTERED",
            button: () => (
              <BaseEntranceButton
                onMouseEnter={this.showSideBar}
                icon={faUserCircle}
                color={this.props.theme.textBigButton}
                backgroundcolor={this.props.theme.primary}
                title={this.getWalletAddress()}
              />
            ),
            drawerHeader: () => {
              return (
                <AddressAvatarButton
                  fullAddress={this.props.dexAccount.account.address}
                  address={this.getWalletAddress()}
                />
              );
            },
            drawerContent: () => {
              return (
                <div>
                  <SideBarDiv>
                    <FontAwesomeIcon
                      style={{
                        color: this.props.theme.primary,
                      }}
                      size="3x"
                      icon={faUserCircle}
                    />
                    <AccountToolTipDiv>
                      <I s="NoAccountTooltip" />
                    </AccountToolTipDiv>

                    <div style={{ margin: "16px" }}>
                      <ActionButton
                        onClick={() => this.showRegisterAccountModal()}
                      >
                        <I s="Register Account" />
                      </ActionButton>
                      <SwitchWalletButton
                        style={{
                          marginTop: "16px",
                        }}
                        onClick={() => this.showConnectToWalletModal()}
                      >
                        <I s="Switch Wallet" />
                      </SwitchWalletButton>
                    </div>
                  </SideBarDiv>
                  <MyAddressLinks />

                  <CommonLinks />
                </div>
              );
            },
          });
          break;

        case REGISTERING:
          // Lightcone API has the record for this address, however the browser doesn't have keys.
          this.scheduleButtonUpdate({
            type: "REGISTERING",
            button: () => (
              <BaseEntranceButton
                onMouseEnter={this.showSideBar}
                icon={faCircleNotch}
                spin
                title={<I s="Registering Account..." />}
                color={this.props.theme.primary}
                backgroundcolor={this.props.theme.sidePanelBackground}
              />
            ),
            drawerHeader: () => {
              return (
                <AddressAvatarButton
                  fullAddress={this.props.dexAccount.account.address}
                  address={this.getWalletAddress()}
                />
              );
            },
            drawerContent: () => {
              return (
                <div>
                  <SideBarDiv>
                    <FontAwesomeIcon
                      style={{
                        color: this.props.theme.primary,
                      }}
                      spin
                      size="3x"
                      icon={faCircleNotch}
                    />
                    <AccountToolTipDiv>
                      <I s="AccountBeingRegisteredNotification" />{" "}
                      <WhyIcon text="StatusProcessing" />
                    </AccountToolTipDiv>

                    <div style={{ margin: "16px" }}>
                      <ActionButton
                        buttonbackground={this.props.theme.primary}
                        onClick={this.pressedDepositButton}
                      >
                        <I s="Deposit" />
                      </ActionButton>
                      <SwitchWalletButton
                        style={{
                          marginTop: "16px",
                        }}
                        onClick={() => this.showConnectToWalletModal()}
                      >
                        <I s="Switch Wallet" />
                      </SwitchWalletButton>
                    </div>
                  </SideBarDiv>
                  <MyAddressLinks />

                  <SideBarGroupSeperator />
                  <SideBarGroupLabel>
                    <I s="MenuMyDexAccount" />
                  </SideBarGroupLabel>

                  <SideBarButton
                    key="deposit"
                    onClick={this.pressedDepositButton}
                  >
                    <MenuFontAwesomeIcon icon={faArrowAltCircleDown} />
                    <I s="Deposit" />
                  </SideBarButton>

                  <CommonLinks />
                </div>
              );
            },
          });
          break;
        case REGISTERED: {
          // Lightcone API has the record for this address, however the browser doesn't have keys.
          this.scheduleButtonUpdate({
            type: "REGISTERED",
            button: () => (
              <BaseEntranceButton
                onMouseEnter={this.showSideBar}
                icon={faLock}
                title={this.getWalletAddress()}
                color={this.props.theme.red}
                backgroundcolor={this.props.theme.sidePanelBackground}
              />
            ),
            drawerHeader: () => {
              return (
                <AddressAvatarButton
                  fullAddress={this.props.dexAccount.account.address}
                  address={this.getWalletAddress()}
                />
              );
            },
            drawerContent: () => {
              return (
                <div>
                  <SideBarDiv>
                    <FontAwesomeIcon
                      style={{
                        color: this.props.theme.red,
                      }}
                      size="3x"
                      icon={faLock}
                    />
                    <AccountToolTipDiv>
                      <I s="NeedLoginTooltip" />
                    </AccountToolTipDiv>

                    <div style={{ margin: "16px" }}>
                      <ActionButton
                        onClick={() => {
                          this.props.showLoginModal(true);
                          this.props.showSideBar(false);
                        }}
                      >
                        <I s="Login" />
                      </ActionButton>
                      <SwitchWalletButton
                        style={{
                          marginTop: "16px",
                        }}
                        onClick={() => this.showConnectToWalletModal()}
                      >
                        <I s="Switch Wallet" />
                      </SwitchWalletButton>
                    </div>
                  </SideBarDiv>

                  <MyAddressLinks />

                  <SideBarGroupSeperator />
                  <SideBarGroupLabel>
                    <I s="MenuMyDexAccount" />
                  </SideBarGroupLabel>

                  <SideBarButton
                    key="reset"
                    onClick={() => this.pressedResetPasswordButton()}
                  >
                    <MenuFontAwesomeIcon icon={faKey} />
                    <I s="Reset Account Key" />
                  </SideBarButton>

                  <CommonLinks />
                </div>
              );
            },
          });
          break;
        }
        case LOGGED_IN:
          const lastVIPAccountId = 1403;
          const iconColor =
            this.props.dexAccount.account.accountId <= lastVIPAccountId
              ? this.props.theme.orange
              : this.props.theme.primary;
          const icon =
            this.props.dexAccount.account.accountId <= lastVIPAccountId
              ? faCrown
              : faLockOpen;

          const vipBadge =
            this.props.dexAccount.account.accountId <= lastVIPAccountId ? (
              <div
                style={{
                  color: this.props.theme.orange,
                  fontSize: "0.75rem",
                  paddingTop: "4px",
                  fontWeight: "600",
                  userSelect: "none",
                }}
              >
                <I s="HonorVip" />
              </div>
            ) : (
              <span />
            );

          this.scheduleButtonUpdate({
            type: "LOGGED_IN",
            button: () => (
              <BaseEntranceButton
                onMouseEnter={this.showSideBar}
                icon={icon}
                title={this.getWalletAddress()}
                color={this.props.theme.primary}
                backgroundcolor={this.props.theme.sidePanelBackground}
              />
            ),

            drawerHeader: () => {
              return (
                <AddressAvatarButton
                  fullAddress={this.props.dexAccount.account.address}
                  address={this.getWalletAddress()}
                />
              );
            },

            drawerContent: () => {
              return (
                <div>
                  <SideBarDiv>
                    <FontAwesomeIcon
                      style={{
                        color: iconColor,
                      }}
                      size="3x"
                      icon={icon}
                    />
                    {vipBadge}
                    <AccountToolTipDiv>
                      <I s="YouHaveLoggedInTooltip" />
                    </AccountToolTipDiv>
                    <div style={{ margin: "12px" }}>
                      <ActionButton
                        buttonbackground={this.props.theme.red}
                        onClick={() => this.props.showLogoutModal(true)}
                      >
                        <I s="Logout" />
                      </ActionButton>
                      <SwitchWalletButton
                        style={{
                          marginTop: "16px",
                        }}
                        onClick={() => this.showConnectToWalletModal()}
                      >
                        <I s="Switch Wallet" />
                      </SwitchWalletButton>
                    </div>
                  </SideBarDiv>
                  <MyAddressLinks />

                  <SideBarGroupSeperator />
                  <SideBarGroupLabel>
                    <I s="MenuMyDexAccount" />
                  </SideBarGroupLabel>

                  <SideBarButton
                    key="deposit"
                    onClick={this.pressedDepositButton}
                  >
                    <MenuFontAwesomeIcon icon={faArrowAltCircleDown} />
                    <I s="Deposit" />
                  </SideBarButton>

                  <SideBarButton
                    key="withdraw"
                    onClick={this.pressedWithdrawButton}
                  >
                    <MenuFontAwesomeIcon icon={faArrowAltCircleUp} />
                    <I s="Withdraw" />
                  </SideBarButton>

                  <SideBarButton
                    key="transfer"
                    onClick={this.pressedTransferButton}
                  >
                    <MenuFontAwesomeIcon icon={faArrowAltCircleUp} />
                    <I s="Transfer" />
                  </SideBarButton>
                  <SideBarButton
                    key="reset"
                    onClick={() => this.pressedResetPasswordButton()}
                  >
                    <MenuFontAwesomeIcon icon={faKey} />
                    <I s="Reset Account Key" />
                  </SideBarButton>

                  <SideBarButton
                    key="export"
                    onClick={() => this.pressedExportAccountButton()}
                  >
                    <MenuFontAwesomeIcon icon={faCode} />
                    <I s="Export Account" />
                  </SideBarButton>

                  <SideBarButton
                    hoverbg={this.props.theme.orange}
                    colortxt={this.props.theme.orange}
                    key="referral"
                    onClick={() => this.pressedReferralButton()}
                  >
                    <MenuFontAwesomeIcon icon={faUserFriends} />
                    <I s="Referral Program" />
                  </SideBarButton>
                  <CommonLinks />
                </div>
              );
            },
          });

          break;

        default:
          console.error("unhandled account state ", account.state);
      }
    } else if (isDesiredNetwork === false) {
      const desiredNetwork = this.props.exchange.chainId;
      let netWorkName = "EthereumMainNet";
      if (desiredNetwork === 4) netWorkName = "EthereumRinkebyTestnet";
      else if (desiredNetwork === 5) netWorkName = "EthereumGörliTestNet";

      this.scheduleButtonUpdate({
        type: "WRONG_NETWORK",
        button: () => (
          <BaseEntranceButton
            onMouseEnter={this.showSideBar}
            backgroundcolor={this.props.theme.red}
            color={this.props.theme.textBigButton}
            icon={faWaveSquare}
            title={<I s="Wrong Network" />}
          />
        ),
        drawerHeader: () => {
          return (
            <BaseEntranceButton
              backgroundcolor={this.props.theme.background}
              color={this.props.theme.red}
              icon={faWaveSquare}
              title={<I s="Wrong Network" />}
            />
          );
        },
        drawerContent: () => {
          return (
            <div>
              <SideBarDiv>
                <FontAwesomeIcon
                  style={{
                    color: this.props.theme.red,
                  }}
                  size="3x"
                  icon={faWaveSquare}
                />
                <AccountToolTipDiv>
                  <span>
                    <I s="UnsupportedNetworkWarning" />
                    <I s={netWorkName} />
                  </span>
                </AccountToolTipDiv>
                <div style={{ margin: "12px" }}>
                  <ActionButton
                    buttonbackground={this.props.theme.red}
                    onClick={() => this.props.showLogoutModal(true)}
                  >
                    <I s="Logout" />
                  </ActionButton>
                  <SwitchWalletButton
                    style={{
                      marginTop: "16px",
                    }}
                    onClick={() => this.showConnectToWalletModal()}
                  >
                    <I s="Switch Wallet" />
                  </SwitchWalletButton>
                </div>
              </SideBarDiv>

              <CommonLinks />
            </div>
          );
        },
      });
    }

    return (
      <div>
        {this.state.buttonType === "UNKNOWN"
          ? this.defaultButton
          : this.createButtonAndDrawer(this.pendingButton)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { pathname } = state.router.location;
  const { dexAccount, exchange, modalManager } = state;
  const isSideBarVisible = modalManager.isSideBarVisible;

  return {
    pathname,
    dexAccount,
    exchange,
    isSideBarVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showExportAccountModal: (show) => dispatch(showExportAccountModal(show)),
    showLogoutModal: (show) => dispatch(showLogoutModal(show)),
    resetPasswordModal: (show) => dispatch(resetPasswordModal(show)),
    showReferralModal: (show) => dispatch(showReferralModal(show)),
    showDepositModal: (show) => dispatch(showDepositModal(show)),
    showTransferModal: (show) => dispatch(showTransferModal(show)),
    showWithdrawModal: (show) => dispatch(showWithdrawModal(show)),
    registerAccountModal: (show) => dispatch(registerAccountModal(show)),
    showLoginModal: (show) => dispatch(loginModal(show)),
    updateAccount: (account) => dispatch(updateAccount(account)),
    showSideBar: (show) => dispatch(showSideBar(show)),
    showConnectToWalletModal: (show) =>
      dispatch(showConnectToWalletModal(show)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(EntranceButton)
);
