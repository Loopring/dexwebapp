import { connect } from 'react-redux';
import I from 'components/I';

import AssetDropdown from 'modals/components/AssetDropdown';

import { AssetDropdownMenuItem, LargeTableHeader } from 'styles/Styles';
import { updateMarketFilter } from 'redux/actions/MyOrderPage';
import { withTheme } from 'styled-components';
import React from 'react';

class Header extends React.PureComponent {
  render() {
    const { markets } = this.props.exchange;

    const marketsOptions = markets
      .filter((market) => market.enabled)
      .map((market, i) => {
        const menuItem = (
          <AssetDropdownMenuItem
            key={i}
            onClick={() => {
              this.props.updateMarketFilter(market.market);
            }}
            small={true}
          >
            <span>
              {' '}
              <I s={market.market} />{' '}
            </span>
          </AssetDropdownMenuItem>
        );

        return menuItem;
      });

    const menuItem = (
      <AssetDropdownMenuItem
        key={'all'}
        onClick={() => {
          this.props.updateMarketFilter('All');
        }}
        small={true}
      >
        <span>
          <I s="All Markets" />
        </span>
      </AssetDropdownMenuItem>
    );

    const options = [menuItem, ...marketsOptions];

    let selected = '';
    if (this.props.myOrderPage.marketFilter === 'All') {
      selected = <I s="All Markets" />;
    } else {
      selected = <I s={this.props.myOrderPage.marketFilter} />;
    }

    return (
      <LargeTableHeader>
        <div
          style={{
            width: '200px',
          }}
        >
          <AssetDropdown options={options} selected={selected} small={true} />
        </div>
      </LargeTableHeader>
    );
  }
}

const mapStateToProps = (state) => {
  const { myOrderPage, exchange } = state;
  return { myOrderPage, exchange };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMarketFilter: (marketFilter) =>
      dispatch(updateMarketFilter(marketFilter)),
  };
};

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(Header));
