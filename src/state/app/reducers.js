import { mapKeys, mapValues } from 'lodash-es';

import { handleActions } from 'utils/store';

import Actions from './actions';

const initState = {
  auth: undefined,
  progressDialog: null,
  preferences: null,
  stats: {
    posts: {
      new: 0,
      modified: 0,
      scheduled: 0,
      approved: 0,
      sync: 0,
    },
  },
};

export default handleActions(
  (state) => state || initState,

  [Actions.showProgressDialog, (state, { title, message }) => ({ ...state, progressDialog: { title, message } })],
  [Actions.hideProgressDialog, (state) => ({ ...state, progressDialog: null })],

  [
    Actions.loginSuccess,
    (state, { data: { result: { user, token } = {} } = {} }) => ({ ...state, auth: { user, token } }),
  ],

  [
    Actions.registrationSuccess,
    (state, { data: { result: { user, token } = {} } = {} }) => ({ ...state, auth: { user, token } }),
  ],

  [
    Actions.checkLoginSuccess,
    (state, { data: { result: { user, token } = {} } = {} }) => ({ ...state, auth: { user, token } }),
  ],
  [Actions.checkLoginFailure, (state) => ({ ...state, auth: undefined })],

  [Actions.logoutCompleted, (state) => ({ ...state, auth: undefined })],
  [
    Actions.loadPreferencesSuccess,
    (state, { data: { result = [] } = {} }) => ({
      ...state,
      preferences: mapValues(
        mapKeys(result, ({ name }) => name),
        ({ value }) => value,
      ),
    }),
  ],
  [Actions.loadPreferencesFauilure, (state, { error, data }) => ({ ...state, preferences: { error, data } })],
);
