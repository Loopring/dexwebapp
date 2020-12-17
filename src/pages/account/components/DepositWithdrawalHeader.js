import { connect } from 'react-redux';
import I from 'components/I';
import config from 'lightcone/config';

import {
  ActionButton,
  AssetDropdownMenuItem,
  LargeTableHeader,
} from 'styles/Styles';
import AssetDropdown from 'modals/components/AssetDropdown';

import { Col, Row } from 'antd';
import { updateTokenFilter } from 'redux/actions/MyAccountPage';
import React from 'react';
import styled, { withTheme } from 'styled-components';

import {
  showDepositModal,
  showTransferModal,
  showWithdrawModal,
} from 'redux/actions/ModalManager';

const TransferOutlineLargeButton = styled(ActionButton)`
  font-size: 0.85rem !important;
  font-weight: 600 !important;
  height: 32px !important;
  padding-left: 18px !important;
  padding-right: 18px !important;
  border-radius: 4px !important;
`;

class DepositWithdrawalHeader extends React.PureComponent {
  render() {
    const { tokens } = this.props.exchange;

    const tokensOptions = tokens
      .filter((token) => token.enabled)
      .map((token, i) => {
        const menuItem = (
          <AssetDropdownMenuItem
            key={i}
            onClick={() => {
              this.props.updateTokenFilter(token.symbol);
            }}
            small={true}
          >
            <span>
              {token.symbol} - <I s={token.name} />
            </span>
          </AssetDropdownMenuItem>
        );

        return menuItem;
      });

    const menuItem = (
      <AssetDropdownMenuItem
        key={'all'}
        onClick={() => {
          this.props.updateTokenFilter('All');
        }}
        small={true}
      >
        <span>
          <I s="All Tokens" />
        </span>
      </AssetDropdownMenuItem>
    );

    const options = [menuItem, ...tokensOptions];

    let selected = '';
    if (this.props.balances.tokenFilter === 'All') {
      selected = <I s="All Tokens" />;
    } else {
      let token = config.getTokenBySymbol(
        this.props.balances.tokenFilter,
        tokens
      );
      selected = (
        <span>
          {token.symbol} - <I s={token.name} />
        </span>
      );
    }

    let button = <div />;
    if (this.props.type === 'transfer') {
      button = (
        <TransferOutlineLargeButton
          onClick={() => {
            if (this.props.balances.tokenFilter === 'All') {
              this.props.showTransferModal();
            } else {
              this.props.showTransferModal(this.props.balances.tokenFilter);
            }
          }}
        >
          <I s="Transfer" />
        </TransferOutlineLargeButton>
      );
    } else if (this.props.type === 'deposit') {
      button = (
        <TransferOutlineLargeButton
          buttonbackground={this.props.theme.buyPrimary}
          onClick={() => {
            if (this.props.balances.tokenFilter === 'All') {
              this.props.showDepositModal();
            } else {
              this.props.showDepositModal(this.props.balances.tokenFilter);
            }
          }}
        >
          <I s="Deposit" />
        </TransferOutlineLargeButton>
      );
    } else if (this.props.type === 'withdrawals') {
      button = (
        <TransferOutlineLargeButton
          buttonbackground={this.props.theme.sellPrimary}
          onClick={() => {
            if (this.props.balances.tokenFilter === 'All') {
              this.props.showWithdrawModal();
            } else {
              this.props.showWithdrawModal(this.props.balances.tokenFilter);
            }
          }}
        >
          <I s="Withdraw" />
        </TransferOutlineLargeButton>
      );
    }

    return (
      <LargeTableHeader>
        <Row>
          <Col>
            <div
              style={{
                width: '200px',
              }}
            >
              <AssetDropdown
                options={options}
                selected={selected}
                size={'small'}
              />
            </div>
          </Col>
          <Col>
            <div
              style={{
                textAlign: 'left',
                marginLeft: '20px',
              }}
            >
              {button}
            </div>
          </Col>
        </Row>
      </LargeTableHeader>
    );
  }
}

const mapStateToProps = (state) => {
  const { balances, exchange } = state;
  return { balances, exchange };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTokenFilter: (tokenFilter) =>
      dispatch(updateTokenFilter(tokenFilter)),
    showTransferModal: (token) => dispatch(showTransferModal(true, token)),
    showDepositModal: (token) => dispatch(showDepositModal(true, token)),
    showWithdrawModal: (token) => dispatch(showWithdrawModal(true, token)),
  };
};

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(DepositWithdrawalHeader)
);
