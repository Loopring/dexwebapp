import { connect } from "react-redux";
import { withTheme } from "styled-components";
import { withUserPreferences } from "components/UserPreferenceContext";
import I from "components/I";
import React from "react";

import {
  MenuFontAwesomeIcon,
  SideBarButton,
  SideBarGroupLabel,
  SideBarGroupSeperator,
} from "../../SideBarDrawer";

import { showSideBar, showWechatModal } from "redux/actions/ModalManager";

import { faBug } from "@fortawesome/free-solid-svg-icons/faBug";
import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons/faClipboardCheck";
import { faDiscord } from "@fortawesome/free-brands-svg-icons/faDiscord";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons/faDollarSign";
import { faFile } from "@fortawesome/free-solid-svg-icons/faFile";

import { faFileSignature } from "@fortawesome/free-solid-svg-icons/faFileSignature";
import { faMagnet } from "@fortawesome/free-solid-svg-icons/faMagnet";
import { faPencilRuler } from "@fortawesome/free-solid-svg-icons/faPencilRuler";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import { faRulerCombined } from "@fortawesome/free-solid-svg-icons/faRulerCombined";
import { faTelegram } from "@fortawesome/free-brands-svg-icons/faTelegram";
import { faTrophy } from "@fortawesome/free-solid-svg-icons/faTrophy";
import { faWeixin } from "@fortawesome/free-brands-svg-icons/faWeixin";

import { getEtherscanLink } from "lightcone/api/localStorgeAPI";

class CommonLinks extends React.Component {
  render() {
    const userPreferences = this.props.userPreferences;

    return (
      <div>
        <SideBarGroupSeperator />
        <SideBarGroupLabel>
          <I s="LRC" />
        </SideBarGroupLabel>

        <SideBarButton
          key="staking"
          onClick={() => window.open("https://staking.loopring.org", "_blank")}
        >
          <MenuFontAwesomeIcon icon={faMagnet} />
          <I s="Staking" />
        </SideBarButton>

        <SideBarGroupSeperator />
        <SideBarGroupLabel>
          <I s="MenuSupportGroup" />
        </SideBarGroupLabel>

        <SideBarButton
          key="faq"
          onClick={() => {
            window.open(
              "https://medium.com/loopring-protocol/loopring-exchange-faq-196d6c40f6cf",
              "_blank"
            );
          }}
        >
          <MenuFontAwesomeIcon icon={faQuestionCircle} />
          <I s="FAQ" />
        </SideBarButton>

        <SideBarButton
          key="wechat"
          onClick={() => {
            this.props.showSideBar(false);
            this.props.showWechatModal(true);
          }}
        >
          <MenuFontAwesomeIcon icon={faWeixin} />
          <I s="WeChat" />
        </SideBarButton>

        <SideBarButton
          key="telegram"
          onClick={() => {
            if (userPreferences.language === "zh") {
              window.open("https://t.me/loopringfans", "_blank");
            } else {
              window.open("https://t.me/loopring_en", "_blank");
            }
          }}
        >
          <MenuFontAwesomeIcon icon={faTelegram} />
          <I s="Telegram" />
        </SideBarButton>

        <SideBarButton
          key="discord"
          onClick={() => {
            window.open("https://discordapp.com/invite/KkYccYp", "_blank");
          }}
        >
          <MenuFontAwesomeIcon icon={faDiscord} />
          <I s="Discord" />
        </SideBarButton>

        <SideBarButton
          key="bug"
          onClick={() => {
            window.open(
              "https://github.com/Loopring/dexwebapp/issues/new",
              "_blank"
            );
          }}
        >
          <MenuFontAwesomeIcon icon={faBug} />
          <I s="Bug Report" />
        </SideBarButton>

        <SideBarGroupSeperator />
        <SideBarGroupLabel>
          <I s="MenuTechnicalResourcesGroup" />
        </SideBarGroupLabel>

        <SideBarButton
          key="api"
          onClick={() => {
            if (userPreferences.language === "zh") {
              window.open("https://docs.loopring.io/zh-hans/", "_blank");
            } else {
              window.open("https://docs.loopring.io/en/", "_blank");
            }
          }}
        >
          <MenuFontAwesomeIcon icon={faFile} />
          <I s="Exchange API" />
        </SideBarButton>

        <SideBarButton
          key="dexcongtract"
          onClick={() => {
            const addr =
              this.props.chainId === 1
                ? "loopringio.eth"
                : this.props.exchangeAddres;
            window.open(
              `${getEtherscanLink(this.props.chainId)}/address/${addr}`,
              "_blank"
            );
          }}
        >
          <MenuFontAwesomeIcon icon={faPencilRuler} />
          <I s="DEX Smart Contract (Beta1)" />
        </SideBarButton>

        <SideBarButton
          key="loopring"
          onClick={() => window.open("https://loopring.org", "_blank")}
        >
          <MenuFontAwesomeIcon icon={faRulerCombined} />
          <I s="Loopring Protocol" />
        </SideBarButton>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { exchange } = state;
  return {
    chainId: exchange.chainId,
    exchangeAddress: exchange.exchangeAddres,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showSideBar: (show) => dispatch(showSideBar(show)),
    showWechatModal: (show) => dispatch(showWechatModal(show)),
  };
};

export default withUserPreferences(
  withTheme(connect(mapStateToProps, mapDispatchToProps)(CommonLinks))
);
