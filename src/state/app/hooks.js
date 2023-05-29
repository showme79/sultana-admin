import axios from 'axios';
import { isFunction, isObject, isString } from 'lodash-es';

import AppActions from './actions';

const hooks = {
  setupProgressDialogAxiosHook: ({ state, dispatch }) => {
    /**
     * Shows a progress dialog depending on the `progress` property of the given config parameter.
     * @param  {Object}                 config          The axios request configuration object.
     * @param  {String|Function|Object} config.progress An extra config parameter which defines the behaviour of dialog handling:
     *                                                  If it is a `String` the `showProgressDialog` action will be called with an object having an `message`
     *                                                  property.
     *                                                  If it is an `Object` the `showProgressDialog` action will be called with the specified object.
     *                                                  If it is a `Function` the function will be called with (dispatch, config, show = true) arguments.
     * @return {Object}                 It can optionaly return a new config axios object. When no object specified the original config will be used;
     */
    const showDialog = (config) => {
      const { progress } = config;

      if (isFunction(progress)) {
        return progress(dispatch, config, true);
      }

      if (isString(progress)) {
        dispatch(AppActions.showProgressDialog({ message: progress }));
      } else if (isObject(progress)) {
        dispatch(AppActions.showProgressDialog(progress));
      }

      return null;
    };

    /**
     * Hides a progress dialog depending on the `progress` property of the given config parameter.
     * @param  {Object}                 config          The axios request configuration object.
     * @param  {Function} config.progress An extra config parameter which defines the behaviour of dialog handling:
     *                                                  If it is a `String` or `Object` the `hideProgressDialog` action will be called with an object having
     *                                                  a `message` property.
     *                                                  If it is a `Function` the function will be called with (dispatch, config, show = false) arguments.
     * @return {Object}                 It can optionaly return a new config axios object. When no object specified the original config will be used;
     */
    const hideDialog = (config) => {
      const { progress } = config;

      if (isFunction(progress)) {
        return progress(dispatch, config, false);
      }
      if (isString(progress) || isObject(progress)) {
        dispatch(AppActions.hideProgressDialog());
      }
      return null;
    };

    const hookAxiosRequest = (config) => {
      // updated config with authentication token when available
      const auth = state && state.app.auth && state.app.auth;
      const headers = auth && auth.token ? { Authorization: `Bearer ${auth.token}` } : null;
      const updatedConfig = headers
        ? {
            Accept: '*/*',
            'Content-Type': 'application/json; charset=utf-8',
            headers,
            ...config,
          }
        : config;

      return showDialog(updatedConfig) || updatedConfig;
    };

    const hookAxiosResponse = (response, error) => {
      const config = (response && response.config) || (error && error.config);
      hideDialog(config);
      return error ? Promise.reject(error) : response;
    };

    axios.interceptors.request.use(hookAxiosRequest);
    axios.interceptors.response.use(
      (response) => hookAxiosResponse(response),
      (error) => hookAxiosResponse(error.response, error),
    );
  },
};

export default hooks;
