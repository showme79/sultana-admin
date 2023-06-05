import { Segment, SortDirection, TagStatus } from 'consts';
import { updateItemById } from 'utils';
import { handleActions } from 'utils/store';

import Actions from './actions';

const initState = {
  /**
   * In case of tags retrieval error, this property stores the error object or `false` when no error found
   * @type {Boolean}
   */
  loadError: false,

  /**
   * In case of successful tag retrieval this property holds the filter parameter of the last successful query.
   * @type {Object}
   */
  filter: {
    name: '',
    status: 'ALL',
    segment: Segment.$ALL,
  },

  /**
   * In case of successful tag retrieval this property holds the sort parameter of the last successful query.
   * @type {Object}
   */
  sort: {
    key: 'createdAt',
    direction: SortDirection.DESC,
  },

  /**
   * In case of successful tag retrieval this property holds the range (from, count) parameters of the last successful query.
   * @type {Object}
   */
  range: null,

  /**
   * In case of successful tag retrieval this property holds the total number of tags items with the actual filter parameter.
   * @type {Object}
   */
  total: null,

  /**
   * In case of successful tag retrieval this property holds the array of retrieved tags
   * @type {Array[Tag]}
   */
  tags: [],

  /**
   * The tag object which is under edited by tag editor
   * @type {Tag}
   */
  tag: null,
};

export default handleActions(
  (state) => state || initState,

  [
    Actions.loadTagsSuccess,
    (state, { data, query } = {}) => {
      const { result: tags, total } = data || {};
      const { filter, sort, range } = query || {};

      return {
        ...state,
        loadError: false,
        filter,
        sort,
        range,
        total,
        tags,
      };
    },
  ],
  [
    Actions.loadTagSuccess,
    (state, { data: { result: tag } = {} } = {}) =>
      tag
        ? {
            ...state,
            tag,
            tags: updateItemById(state.tags, tag),
          }
        : state,
  ],
  [
    Actions.saveTagSuccess,
    (state, { data: { result: tag } = {} } = {}) =>
      tag
        ? {
            ...state,
            tag: state.tag && (state.tag.id === tag.id ? tag : null),
            tags: updateItemById(state.tags, tag),
          }
        : state,
  ],
  [Actions.resetTag, (state) => ({ ...state, tag: null })],
  [
    Actions.createTag,
    (state, { userId }) => ({
      ...state,
      tag: {
        name: '',
        status: TagStatus.NOT_APPROVED,
        createdBy: userId,
        updatedBy: userId,
      },
    }),
  ],
);
