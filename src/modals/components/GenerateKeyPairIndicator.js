import I from 'components/I';
import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';

import { getWalletType } from 'lightcone/api/localStorgeAPI';
import { withTheme } from 'styled-components';
import ModalIndicator from 'modals/components/ModalIndicator';
import WalletConnectIndicator from 'modals/components/WalletConnectIndicator';

class GenerateKeyPairIndicator extends React.Component {
  render() {
    const theme = this.props.theme;

    if (getWalletType() === 'MetaMask') {
      let tipIcons = [];
      let tips = [];

      if (this.props.approveTxCount === 1) {
        tipIcons = [];
        tips = [
          <div key="1">
            <I s={'metaMaskPendingTxTip'} />
          </div>,
        ];
      } else if (this.props.approveTxCount === 2) {
        tipIcons = [
          <div key="0"></div>,
          <div key="1">
            <FontAwesomeIcon
              icon={this.props.processingNum > 1 ? faCheck : faArrowRight}
              style={{
                marginRight: '8px',
                width: '20px',
                color:
                  this.props.processingNum > 1 ? theme.green : theme.primary,
              }}
            />
          </div>,
          <div key="2">
            <FontAwesomeIcon
              icon={this.props.processingNum === 2 ? faArrowRight : faClock}
              style={{
                marginRight: '8px',
                width: '20px',
                color:
                  this.props.processingNum === 2
                    ? theme.primary
                    : theme.textDim,
              }}
            />
          </div>,
        ];
        tips = [
          <div
            key="0"
            style={{
              marginLeft: '-28px',
            }}
          >
            <I s={'metaMaskPendingTxTip'} />
          </div>,
          <div key="1">
            <I s={'metaMaskPendingTxTip1'} />
          </div>,
          <div key="1">
            <I s={'metaMaskPendingTxTip2'} />
          </div>,
        ];
      }

      return (
        <ModalIndicator
          title={this.props.title}
          tipIcons={tipIcons}
          tips={tips}
          imageUrl={`/assets/images/${this.props.theme.imgDir}/metamask_pending.png`}
          marginTop="60px"
          textAlign={'left'}
        />
      );
    } else {
      return <WalletConnectIndicator />;
    }
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(GenerateKeyPairIndicator)
);
