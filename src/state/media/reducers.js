import { SortDirection } from 'consts';
import { updateItemById } from 'utils';
import { handleActions } from 'utils/store';

import Actions from './actions';

const initState = {
  /**
   * In case of media list retrieval error, this property stores the error object or `false` when no error found
   * @type {Boolean}
   */
  loadError: false,

  /**
   * In case of successful media retrieval this property holds the search (full text search) parameter of the last successful query
   * @type {String}
   */
  search: '',

  /**
   * In case of successful media retrieval this property holds the filter parameter of the last successful query.
   * @type {Object}
   */
  filter: {
    type: 'ALL',
  },

  /**
   * In case of successful media retrieval this property holds the sort parameter of the last successful query.
   * @type {Object}
   */
  sort: {
    key: 'createdAt',
    direction: SortDirection.DESC,
  },

  /**
   * In case of successful media retrieval this property holds the range (from, count) parameters of the last successful query.
   * @type {Object}
   */
  range: null,

  /**
   * In case of successful media retrieval this property holds the total number of media items with the actual filter parameter.
   * @type {Object}
   */
  total: null,

  /**
   * In case of successful media retrieval this property holds the array of retrieved media list
   * @type {Array[Media]}
   */
  mediaList: [],

  /**
   * The media object which is under edited by media editor
   * @type {Media}
   */
  media: null,
};

export default handleActions(
  (state) => state || initState,

  [
    Actions.loadMediaListSuccess,
    (state, { data, query } = {}) => {
      const { result: mediaList, total } = data || {};
      const { search, filter, sort, range } = query || {};

      return {
        ...state,
        loadError: false,
        search,
        filter,
        sort,
        range,
        total,
        mediaList,
      };
    },
  ],
  [
    Actions.loadMediaSuccess,
    (state, { data: { result: media } = {} } = {}) =>
      media
        ? {
            ...state,
            media,
            mediaList: updateItemById(state.mediaList, media),
          }
        : state,
  ],
  [
    Actions.saveMediaSuccess,
    (state, { data: { result: media } = {} } = {}) =>
      media
        ? {
            ...state,
            media: state.media.id === media.id,
            mediaList: updateItemById(state.mediaList, media),
          }
        : state,
  ],
  [Actions.resetMedia, (state) => ({ ...state, media: null })],
  [
    Actions.createMedia,
    (state, { userId }) => ({
      ...state,
      media: {
        title: '',
        createdBy: userId,
        updatedBy: userId,
      },
    }),
  ],
);
