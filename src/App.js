import { ConnectedRouter } from 'connected-react-router';
import { connect } from 'react-redux';

import { ThemeProvider } from 'styled-components';
import { TrackerProvider } from 'react-tracker';
import { history } from 'redux/configureStore';
import { tracker } from 'components/DefaultTracker';
import AntdFormStyles from 'styles/AntdFormStyles';
import AntdGlobalStyles from 'styles/AntdGlobalStyles';
import AntdModalStyles from 'styles/AntdModalStyles';
import AntdTableStyles from 'styles/AntdTableStyles';
import AppClassStyles from 'styles/AppClassStyles';
import BrowserGlobalStyles from 'styles/BrowserGlobalStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import UserPreferenceContext from 'components/UserPreferenceContext';
import WalletConnectStyles from 'styles/WalletConnectStyles';
import routes from 'routes';

class App extends React.Component {
  render() {
    return (
      <TrackerProvider tracker={tracker}>
        <UserPreferenceContext.Provider value={this.props.userPreferences}>
          <ThemeProvider theme={this.props.userPreferences.theme}>
            <BrowserGlobalStyles />
            <AntdGlobalStyles />
            <AntdTableStyles />
            <AntdFormStyles />
            <AntdModalStyles />
            <AppClassStyles />
            <WalletConnectStyles />
            <Suspense fallback={null}>
              <ConnectedRouter history={history}>{routes}</ConnectedRouter>
            </Suspense>
          </ThemeProvider>
        </UserPreferenceContext.Provider>
      </TrackerProvider>
    );
  }
}

App.propTypes = {
  history: PropTypes.object,
};

const mapStateToProps = (state) => {
  const { userPreferences } = state;
  return { userPreferences };
};

export default connect(mapStateToProps, null)(App);
