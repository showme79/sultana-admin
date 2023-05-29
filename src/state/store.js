import { includes } from 'lodash-es';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import { appHooks, toastsHooks } from 'state/hooks';
import * as reducers from 'state/reducers';
import ConsoleLogger from 'utils/logger/ConsoleLogger';

export const createAppStore = () => {
  const rootReducer = combineReducers(reducers);

  // avoid logging actions specified here
  const nonLoggingActions = [
    // TODO: add actions id here
  ];

  const reduxLogger = createLogger({
    predicate: (getState, action) => !includes(nonLoggingActions, action.type),
    collapsed: true,
    logger: new ConsoleLogger(),
  });

  const middlewares = [thunk, reduxLogger];
  const enhancers = [applyMiddleware(...middlewares)];

  const store = createStore(rootReducer, compose(...enhancers));

  // setup hooks for axios actions
  appHooks.setupProgressDialogAxiosHook(store);
  toastsHooks.setupToastsAxiosHook(store);

  store.asyncReducers = {}; // async reducer registry

  return store;
};

export default createAppStore();
