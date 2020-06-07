import { applyMiddleware, compose, createStore } from "redux";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import createRootReducer from "./reducers";
import thunk from "redux-thunk";

// Use createHashHistory if it's deployed to github
export const history = createBrowserHistory();

// Setting preloadedState is still behind setting initState in each reducer
export default function configureStore(preloadedState) {
  const composeEnhancer =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancer(applyMiddleware(thunk, routerMiddleware(history)))
  );

  // Hot reloading
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("./reducers", () => {
      store.replaceReducer(createRootReducer(history));
    });
  }

  return store;
}
