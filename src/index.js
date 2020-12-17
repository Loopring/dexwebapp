import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from 'redux/configureStore';

import App from './App';

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={configureStore()}>
        <App />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};

render();

// Hot reloading
if (module.hot) {
  // Reload components
  module.hot.accept('./App', () => {
    render();
  });
}
