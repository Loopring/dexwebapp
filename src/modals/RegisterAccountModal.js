import { ActionButton } from "styles/Styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, Spin } from "antd";
import { Instruction, Section, TextPopupTitle } from "modals/styles/Styles";
import { MyModal } from "./styles/Styles";
import { REGISTERING, updateAccount } from "redux/actions/DexAccount";
import { connect } from "react-redux";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons/faGraduationCap";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { fetchGasPrice } from "redux/actions/GasPrice";
import { fetchNonce } from "redux/actions/Nonce";
import { formatter } from "lightcone/common";
import {
  getReferralId,
  getWalletType,
  removeReferralId,
  setReferralId,
} from "lightcone/api/localStorgeAPI";
import { history } from "redux/configureStore";
import { notifyError, notifySuccess } from "redux/actions/Notification";
import { registerAccountModal } from "redux/actions/ModalManager";
import { setRefer } from "lightcone/api/LightconeAPI";
import { sleep } from "./components/utils";
import { withTheme } from "styled-components";
import { withUserPreferences } from "components/UserPreferenceContext";
import AppLayout from "AppLayout";
import I from "components/I";
import React from "react";
import WhyIcon from "components/WhyIcon";

import Group from "modals/components/Group";
import ModalIndicator from "modals/components/ModalIndicator";
import config from "lightcone/config";

class RegisterAccountModal extends React.Component {
  state = {
    isRegister: false,
    referrer: "",
    isInvited: false,
    loading: false,
    processingNum: 1,
  };

  title = (<I s="Register Account" />);
  buttonLabel = (<I s="Register Account" />);
  getInstructions = () => {
    const learnAccountKeysUrl =
      this.props.userPreferences.language === "zh"
        ? "https://loopring.org/#/post/new-approach-to-generating-layer-2-account-keys-cn"
        : "https://loopring.org/#/post/looprings-new-approach-to-generating-layer-2-account-keys";

    return (
      <Section>
        <Instruction>
          <I s="RegisterAccountInstruction_1" />
        </Instruction>
        <ul>
          <li>
            <I s="RegisterAccountInstruction_Timing" />
            <WhyIcon text="TimingWhy" />
          </li>
          <li>
            <I s="RegisterAccountInstruction_Fee_1" />
            {config.getFeeByType("deposit", this.props.exchange.onchainFees)
              ? config.fromWEI(
                  "ETH",
                  Number(
                    config.getFeeByType(
                      "create",
                      this.props.exchange.onchainFees
                    ).fee
                  ) +
                    config.getFeeByType(
                      "deposit",
                      this.props.exchange.onchainFees
                    ).fee,
                  this.props.exchange.tokens
                )
              : "-"}{" "}
            ETH
            <I s="RegisterAccountInstruction_Fee_2" />
            <WhyIcon text="RegisterAccountInstruction_FeeWhy" />
          </li>
        </ul>

        <div
          style={{
            textAlign: "center",
            color: this.props.theme.green,
            paddingBottom: "12px",
            borderBottom: "1px solid " + this.props.theme.seperator,
            marginTop: "24px",
            paddingTop: "12px",
            borderTop: "1px solid " + this.props.theme.seperator,
          }}
        >
          <FontAwesomeIcon
            style={{
              marginRight: "12px",
            }}
            size="2x"
            icon={faGraduationCap}
          />
          <a
            style={{ fontSize: "1rem", color: this.props.theme.green }}
            target="_blank"
            rel="noopener noreferrer"
            href={learnAccountKeysUrl}
          >
            <I s="LearnAccountKeys" />
          </a>
        </div>
      </Section>
    );
  };

  componentDidMount() {
    this.setState({
      isRegister: true,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isVisible !== prevProps.isVisible) {
      if (this.props.isVisible === false) {
        this.reset();
      }

      if (this.props.isVisible === true) {
        // set referer
        this.setState({
          isRegister: true,
        });

        let refer_id = "";
        if (this.props.pathname) {
          if (this.props.pathname.startsWith("/invite/")) {
            refer_id = this.props.pathname.replace("/invite/", "");
          }
        } else if (this.props.pathname === "/invite") {
          refer_id = "";
        }

        const reg = new RegExp("^([1-9][0-9]{0,6})$");
        const localReferralId = getReferralId();
        const referrer = localReferralId ? localReferralId : refer_id;
        if (!Number.isNaN(refer_id) && reg.test(refer_id)) {
          setReferralId(refer_id);
        }
        this.setState({
          referrer: referrer,
          isInvited: !!referrer,
        });
      }
      if (
        this.props.isVisible === true &&
        this.props.dexAccount.account.address
      ) {
        (async () => {
          this.props.fetchNonce(this.props.dexAccount.account.address);
          this.props.fetchGasPrice();
        })();
      }
    }
  }

  onClose = () => {
    this.props.closeModal();
    this.reset();
  };

  reset() {
    this.setState({
      isRegister: false,
      referrer: "",
      loading: false,
    });
  }

  onProceed = () => {
    this.setState({
      loading: true,
    });
    const { exchange, nonce, gasPrice } = this.props;

    (async () => {
      try {
        const fee = formatter
          .toBig(config.getFeeByType("create", exchange.onchainFees).fee)
          .plus(config.getFeeByType("deposit", exchange.onchainFees).fee);

        const { keyPair } = await window.wallet.generateKeyPair(
          exchange.exchangeAddress,
          0
        );

        if (!keyPair || keyPair.secretKey === undefined) {
          throw new Error("Failed to generate keyPair.");
        }
        this.setState({
          processingNum: this.state.processingNum + 1,
        });
        // Add a delay for WalletConnect. Their server is not real time to response.
        // We can change 10 seconds to shorter
        if (getWalletType() === "WalletConnect") {
          await sleep(6000);
        }

        await window.wallet.createOrUpdateAccount(
          keyPair,
          {
            exchangeAddress: exchange.exchangeAddress,
            fee: fee.toString(),
            chainId: exchange.chainId,
            token: config.getTokenBySymbol("ETH", exchange.tokens),
            amount: "",
            permission: "",
            nonce: nonce.nonce,
            gasPrice: gasPrice.gasPrice,
          },
          true
        );

        const account = {
          address: window.wallet.address,
          publicKeyX: keyPair.publicKeyX,
          publicKeyY: keyPair.publicKeyY,
          accountKey: keyPair.secretKey,
          state: REGISTERING,
        };

        this.props.updateAccount(account);

        //setReferrer or  promotion code
        try {
          if (this.state.referrer) {
            const reg = new RegExp("^([1-9][0-9]{0,6})$");
            if (
              !Number.isNaN(this.state.referrer) &&
              reg.test(this.state.referrer)
            ) {
              await setRefer(
                {
                  address: window.wallet.address,
                  referrer: this.state.referrer,
                },
                keyPair
              );
              removeReferralId();
            } else {
              await setRefer(
                {
                  address: window.wallet.address,
                  promotionCode: this.state.referrer,
                },
                keyPair
              );
            }
          }
        } catch (e) {
          console.log(e);
          console.log("failed to set referrer or promotion code");
        }

        // If it's from invite, navigate to trade page
        if (this.props.pathname.startsWith("/invite/")) {
          history.push("/trade");
        }

        notifySuccess(
          <I s="AccountBeingRegisteredNotification" />,
          this.props.theme
        );
      } catch (err) {
        console.log(err);
        notifyError(
          <I s="AccountRegistrationFailedNotification" />,
          this.props.theme
        );
      } finally {
        this.setState({
          processingNum: 1,
        });

        this.onClose();
      }
    })();
  };

  onReferrerValueChange = (e) => {
    this.setState({
      referrer: e.target.value,
    });
  };

  render() {
    const { theme } = this.props;
    const { processingNum } = this.state;

    let indicator = (
      <ModalIndicator
        title={
          getWalletType() === "MetaMask"
            ? "metamaskConfirm"
            : "walletConnectConfirm"
        }
        tipIcons={[
          <div key="1">
            <FontAwesomeIcon
              icon={processingNum === 1 ? faArrowRight : faCheck}
              style={{
                marginRight: "8px",
                width: "20px",
                color: processingNum === 1 ? theme.primary : theme.green,
              }}
            />
          </div>,
          <div key="2">
            <FontAwesomeIcon
              icon={processingNum === 2 ? faArrowRight : faClock}
              style={{
                marginRight: "8px",
                width: "20px",
                color: processingNum === 2 ? theme.primary : theme.textDim,
              }}
            />
          </div>,
          <div key="3">
            <FontAwesomeIcon
              icon={faClock}
              style={{
                visibility: "hidden",
              }}
            />
          </div>,
        ]}
        tips={[
          <div key="1">
            <I s={"generateKeyPairTip"} />
          </div>,
          <div key="2">
            <I s={"registerTxTip"} />
          </div>,
          <I
            key="3"
            s={
              getWalletType() === "MetaMask"
                ? "metaMaskPendingTxTip"
                : "walletConnectPendingTxTip"
            }
          />,
        ]}
        imageUrl={
          getWalletType() === "MetaMask"
            ? `/assets/images/${theme.imgDir}/metamask_pending.png`
            : ""
        }
        marginTop="60px"
        textAlign={"left"}
      />
    );

    const indicatorPlaceholder = this.state.loading ? (
      <div
        style={{
          height: getWalletType() === "MetaMask" ? "115px" : "0px",
          display: "block",
        }}
      />
    ) : (
      <div />
    );

    return (
      <MyModal
        centered
        style={{ top: 40 }}
        width={AppLayout.modalWidth}
        title={<TextPopupTitle>{this.title}</TextPopupTitle>}
        footer={null}
        maskClosable={false}
        closeIcon={<FontAwesomeIcon icon={faTimes} />}
        visible={this.props.isVisible}
        onCancel={() => this.onClose()}
      >
        <Spin indicator={indicator} spinning={this.state.loading}>
          {indicatorPlaceholder}
          <Section>{this.getInstructions()}</Section>
          <Section>
            {this.state.isRegister && (
              <div
                style={{
                  paddingTop: "12px",
                  marginTop: "18px",
                }}
              >
                <Group label={<I s="Referral ID / Promotion Code" />}>
                  <Input
                    suffix={<span />}
                    style={{
                      color: theme.textWhite,
                    }}
                    value={
                      this.state.referrer
                        ? this.state.referrer.toUpperCase()
                        : this.state.referrer
                    }
                    onChange={this.onReferrerValueChange}
                    disabled={this.state.isInvited}
                  />
                </Group>
              </div>
            )}
          </Section>
          {this.props.showLoginModal &&
          this.props.dexAccount.account.state !== "LOGGED_IN" ? (
            <Section>
              <Group>
                <div style={{ height: "20px" }}>
                  <a
                    onClick={() => {
                      this.props.closeModal();
                      this.props.showLoginModal();
                    }}
                    style={{
                      float: "right",
                    }}
                  >
                    <I s="Try to login again?" />
                  </a>
                </div>
              </Group>
            </Section>
          ) : (
            <span />
          )}

          <Section>
            <ActionButton onClick={() => this.onProceed()}>
              {this.buttonLabel}
            </ActionButton>
          </Section>
        </Spin>
      </MyModal>
    );
  }
}

const mapStateToProps = (state) => {
  const { pathname } = state.router.location;

  const { dexAccount, modalManager, nonce, gasPrice, exchange } = state;
  const isVisible = modalManager.isRegisterAccountModalVisible;
  return {
    pathname,
    dexAccount,
    isVisible,
    modalManager,
    nonce,
    gasPrice,
    exchange,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(registerAccountModal(false)),
    updateAccount: (account) => dispatch(updateAccount(account)),
    fetchNonce: (address) => dispatch(fetchNonce(address)),
    fetchGasPrice: () => dispatch(fetchGasPrice()),
  };
};

export default withUserPreferences(
  withTheme(connect(mapStateToProps, mapDispatchToProps)(RegisterAccountModal))
);
