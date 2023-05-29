import axios from 'axios';
import { isArray, isPlainObject, mapKeys } from 'lodash-es';

/**
 * Transforms a map of parameters to a ? and & separated URI encoded query string.
 *
 * @param  {Object} queryParams Map of parameters and values which needs to be transformed.
 * @return {[type]}             [description]
 */
const encodeQueryParams = (queryParams) => {
  if (!queryParams) {
    return '';
  }

  const paramList = Object.keys(queryParams).reduce((acc, name) => {
    const value = queryParams[name];
    if (value === undefined) {
      return acc;
    }

    const encodedName = encodeURIComponent(name);

    if (isArray(value)) {
      return [...acc, ...value.map((item) => `${encodedName}=${encodeURIComponent(item)}`)];
    }

    return [...acc, `${encodedName}=${encodeURIComponent(value)}`];
  }, []);

  return paramList.length ? `?${paramList.join('&')}` : '';
};

/**
 * Replaces parameters with values in a URL with URI encoding.
 *
 * @param {string} url    The URL which contains parameter variables in a curly brace (eg. /rest/foo/{fooId}/bar/{barId})
 * @param {Object} params Map of parameters and values which needs to be replaced.
 * @returns {string}      The resolved URL which contains the replaced parameters.
 */
export const replaceUrlParams = (url, params) =>
  Object.keys(params || {}).reduce((acc, key) => {
    const regexp = new RegExp(`\\{${key}\\}`, 'g');
    return acc.replace(regexp, encodeURIComponent(params[key]));
  }, url);

const processParam = (result, paramTypes, paramName, param) => {
  const { urlParams = {}, queryParams = {}, data } = result;

  const paramType = paramTypes[paramName] || 'url';

  let newData = data || (isArray(param) ? [] : {});
  if (paramType === 'data') {
    // inject the content of param into data
    newData = (isArray(newData) && [...newData, ...param]) ||
      (param instanceof window.FormData && param) || { ...data, ...param };
  } else if (paramType === 'body') {
    // inject param with its name into data
    newData = { ...newData, [paramName]: param };
  } else if (paramType === 'query+param') {
    newData = isPlainObject(param) ? mapKeys(param, (value, key) => `${paramName}.${key}`) : { [paramName]: param };
  } else if (paramType === 'url' || paramType === 'query' || paramType === 'query+param') {
    // in case of url and query parameters we calculate an object which will be merged to the parameter list
    newData = isPlainObject(param) ? param : { [paramName]: param };
  }
  return {
    urlParams: paramType === 'url' ? { ...urlParams, ...newData } : urlParams,
    queryParams: paramType === 'query' || paramType === 'query+param' ? { ...queryParams, ...newData } : queryParams,
    data: paramType === 'data' || paramType === 'body' ? newData : data,
  };
};

/**
 * Convert service option objects to API requesting functions
 *
 * @param {Object}  config              The service configuration object which will describe the service call behaviour.
 * @param {string}  [config.method=get] The HTTP method which the service will be invoked.
 * @param {string}  config.url          URL part concatenated after base url (e.g. /employee/{id}/group/{group_id}).
 * @param {?string} config.baseUrl      An URL prefix which will be inserted before each request.
 * @param {?Object} config.paramTypes   Should contain properties with string values
 *                                          the key is the name of the param, the value is the type, possible values are query, body, data
 *                                          params with query param type aren't required to list here
 * @returns {Function}
 * @param {?Object} options               Additional options which will be passed to the service call.
 */
const createService = (config) => {
  const axiosFn = (params, axiosConfig = {}) => {
    const method = (config.method || 'get').toLowerCase();
    const { urlParams, queryParams, data } = Object.keys(params || {}).reduce(
      (result, paramName) => ({
        ...processParam(result, config.paramTypes || {}, paramName, params[paramName]),
      }),
      {},
    );

    return axios({
      ...config,
      method,
      url: (config.baseUrl || '') + replaceUrlParams(config.url, urlParams) + encodeQueryParams(queryParams),
      data,
      ...axiosConfig,
    });
  };

  axiosFn.config = {};
  Object.keys(config).forEach((key) => {
    axiosFn.config[key] = config[key];
  });

  return axiosFn;
};

export default {
  createServices: (servicesCfg, baseCfg) => {
    const services = Object.keys(servicesCfg).reduce(
      (result, id) => ({
        ...result,
        [id]: createService({ id, ...(baseCfg || {}), ...servicesCfg[id] }),
      }),
      {},
    );

    return services;
  },
};
