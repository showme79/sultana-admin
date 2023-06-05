import {
  isArrayLike,
  isFunction,
  isNil,
  isObject,
  isPlainObject,
  isString,
  map,
  mapValues,
  memoize,
  reduce,
  set,
} from 'lodash-es';
import PropTypes from 'prop-types';

import { ImageWidths, MediaType, SortDirection } from 'consts';
import { baseUrl } from 'services';

export { decodeHtml, fromJson, processSurvey, replaceVars, sleep, toBoolean } from '@showme79/sultana-common';

export const upperSnakeCase = (str) => (str && str.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase()) || str;

/**
 * Checks if the given value is empty. Empty values are `undefined`, `null`, empty array, empty string, object with no own property.
 *
 * @param  {Any} value The value to test for emptiness.
 * @return {boolean}   `true` if the given value is empty otherwise `false`.
 */
export const isEmpty = (value) =>
  isNil(value) || (isArrayLike(value) && !value.length) || (isObject(value) && !Object.keys(value).length) || false;

/**
 * Returns the sign of the specified value.
 *
 * @param  {Number} value  The value which sign should be returned.
 * @param  {boolean} force Set it to `true` if sign must be returned in case of zero-value.
 * @return {String}        Depending on the sign of value it can be '+`, '-' or empty string when value is zero and `force` is not enabled.
 */
export const sign = (value, force) => {
  if (value < 0) {
    return '-';
  }
  if (value > 0) {
    return '+';
  }
  return force ? '+' : '';
};

export const checkPropTypes = (data, propType) => {
  if (propType) {
    PropTypes.checkPropTypes({ data: propType }, { data }, 'data', 'api');
  }

  return data;
};

const appendMessageWithReference = (messages, { ref, text }) =>
  ref ? { ...messages, [ref]: [...(messages[ref] || []), text] } : messages;

export const mapApiErrorsToFormErrors = (data) => {
  const { messages } = data || {};

  return messages ? messages.reduce(appendMessageWithReference, {}) : {};
};

export const calculateSort = (sortKey, sortDirection, column) => {
  const { id: sortKeyDefault, sortDirection: sortDirectionDefault = SortDirection.ASC, sortable } = column;
  const key = isString(sortable) ? sortable : sortKeyDefault;
  const direction =
    (sortKey === key && (sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC)) ||
    sortDirectionDefault;
  return { key, direction };
};

export const evalFnValue = (fnValue, ...fnArgs) => (isFunction(fnValue) ? fnValue(...fnArgs) : fnValue);

export const getDisplayName = (user, showUsername = true, empty = '') => {
  if (!user) {
    return empty;
  }

  const { profile, profile: { displayName, firstName, lastName } = {} } = user;
  const username = showUsername ? user.username : '';
  if (!profile) {
    return username;
  }

  return displayName || `${lastName || ''} ${firstName || ''}`.trim() || username;
};

export const updateItemById = (items, newItem) => {
  const { id } = newItem;
  if (!id) {
    return items;
  }

  const idx = items.findIndex((tag) => tag.id === id);
  return idx < 0 ? [newItem, ...items] : [...items.slice(0, idx), newItem, ...items.slice(idx + 1)];
};

export const calcRowsPerPage = (range, defatultLimit = 25) => (range && range.limit) || defatultLimit;

export const calcPageNumber = (range, defaultPage = 0, defatultLimit = 25) =>
  (range && (range.offset || 0) / (range.limit || defatultLimit)) || defaultPage;

export const getImageUrl = (media, imageWidth) => {
  const id = isPlainObject(media) ? media.id : media;
  const width = ImageWidths[imageWidth];
  return `${baseUrl}/image/${id}${width ? `?w=${width}` : ''}`;
};

export const MediaUrlMap = {
  [MediaType.IMAGE]: getImageUrl,
  [MediaType.VIDEO]: '/resources/icons/media-video.png',
  [MediaType.AUDIO]: '/resources/icons/media-audio.png',
  [MediaType.OTHER]: '/resources/icons/media-other.png',
};

export const getMediaUrl = (media, options) => {
  const url = MediaUrlMap[media.type || MediaType.OTHER] || MediaUrlMap[MediaType.OTHER];
  return isFunction(url) ? url(media, options) : url;
};

export const getPreviewUrl = (post) => `/cikk/${encodeURIComponent(post.slug)}?preview=true`;

export const mapItemsToCheckbox = (items, defaultItems, allItems) => {
  const checkedItems = isString(items) ? items.split(',').filter((item) => allItems[item]) : defaultItems;
  return reduce(
    checkedItems,
    (acc, item) => set(acc, item, true),
    mapValues(allItems, () => false),
  );
};

export const mapCheckboxToItems = (values) => reduce(values, (acc, value, name) => (value ? [...acc, name] : acc), []);

export const createDeferredService = memoize((service) => (args) => service(...args));

export const createPromiseService = memoize(
  (service) =>
    ({ params, config }) =>
      service(params, config),
);

export const getSelectItems = (items, texts, { all = true, special = false } = {}) =>
  map(items, (item) => ({ id: item, name: texts[item] })).filter(
    ({ id }) => (all || id !== items.ALL) && (special || id[0] !== '$'),
  );

export const getSegmentFilterItems = ({ Segment, SegmentText, ...opts }) => getSelectItems(Segment, SegmentText, opts);
