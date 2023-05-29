import services from 'services';
import { createActions } from 'utils/store';

const actions = createActions(
  {
    showProgressDialog: (options) => ({ title: options.title || 'Információ', message: options.message || '' }),
    hideProgressDialog: null,

    checkLogin: [
      () => (dispatch) =>
        services
          .checkLogin()
          .then((response) => dispatch(actions.checkLoginSuccess(response, response.data)))
          .catch((error) =>
            dispatch(actions.checkLoginFauilure(error, (error.response && error.response.data) || null)),
          ),
    ],
    checkLoginSuccess: (response, data) => ({ response, data }),
    checkLoginFauilure: (error, data) => ({ error, data }),

    registration: [
      (username, password) => (dispatch) =>
        services
          .registration({ username, password })
          .then((response) => dispatch(actions.registrationSuccess(response, response.data))),
    ],
    registrationSuccess: (response, data) => ({ response, data }),
    registrationFauilure: (error, data) => ({ error, data }),

    login: [
      (username, password) => (dispatch) =>
        services
          .login({ username, password })
          .then((response) => dispatch(actions.loginSuccess(response, response.data))),
    ],
    loginSuccess: (response, data) => ({ response, data }),
    loginFauilure: (error, data) => ({ error, data }),

    logout: [
      () => (dispatch) =>
        services
          .logout()
          .then((/* (response, data) */) => dispatch(actions.logoutCompleted()))
          .catch((/* error, data */) => dispatch(actions.logoutCompleted())), // we logout as success anyway
    ],
    logoutCompleted: (response, data) => ({ response, data }),

    loadStats: () => (dispatch) =>
      services.loadStats().then((response, data) => dispatch(actions.loadStatsCompleted(data))),

    loadPreferences: [
      () => (dispatch) =>
        services
          .loadPreferences()
          .then((response) => dispatch(actions.loadPreferencesSuccess(response, response.data)))
          .catch((error) =>
            dispatch(actions.loadPreferencesFauilure(error, (error.response && error.response.data) || null)),
          ),
    ],
    loadPreferencesSuccess: (response, data) => ({ response, data }),
    loadPreferencesFauilure: (error, data) => ({ error, data }),
  },
  'app',
);

export default actions;
