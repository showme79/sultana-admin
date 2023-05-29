import axios from 'axios';
import { get } from 'lodash-es';

import { MsgType } from 'consts';
import { replaceVars } from 'utils';

import ToastsActions from './actions';

const mapMessagesToToasts = (messages) =>
  messages
    .filter((msg) => !msg.reference)
    .map(({ text, name, params, type }) => ({
      name,
      params,
      type: MsgType[type] || MsgType.INFO,
      text: replaceVars(text, params, get),
    }));

const hooks = {
  setupToastsAxiosHook: ({ dispatch }) => {
    const processToasts = (response, error) => {
      const data = response && response.data;
      const config = (response && response.config) || (error && error.config);
      const { skipToasts } = config;
      if (skipToasts) {
        return;
      }

      const messages = (data && data.messages) || [];

      // in case of fetch exception add an own error message
      if (error && !messages.length) {
        messages.unshift({
          text: `Hiba történt a kérés végrehajtásakor${
            error.message ? `: ${(error.message || '').toLowerCase()}` : ''
          }!`,
          type: MsgType.ERROR,
        });
      }

      if (!messages.length) {
        return;
      }

      dispatch(ToastsActions.addMessages(mapMessagesToToasts(messages)));
    };

    const hookAxiosRequest = (config) => {
      const { keepToasts, skipToasts } = config;
      if (!skipToasts && !keepToasts) {
        dispatch(ToastsActions.clearMessages());
      }

      return config;
    };

    const hookAxiosResponse = (response, error) => {
      processToasts(response, error);
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
