import { PostStatus, Segment, SortDirection } from 'consts';
import { updateItemById } from 'utils';
import { handleActions } from 'utils/store';

import Actions from './actions';

const initState = {
  /**
   * In case of posts retrieval error, this property stores the error object or `false` when no error found
   * @type {Boolean}
   */
  loadError: false,

  /**
   * In case of successful post retrieval this property holds the search (full text search) parameter of the last successful query
   * @type {Object}
   */
  search: undefined,

  /**
   * In case of successful post retrieval this property holds the filter parameter of the last successful query.
   * @type {Object}
   */
  filter: undefined,

  /**
   * In case of successful post retrieval this property holds the sort parameter of the last successful query.
   * @type {Object}
   */
  sort: {
    key: 'approvedAt',
    direction: SortDirection.DESC,
  },

  /**
   * In case of successful post retrieval this property holds the range (from, count) parameters of the last successful query.
   * @type {Object}
   */
  range: null,

  /**
   * In case of successful post retrieval this property holds the total number of posts items with the actual filter parameter.
   * @type {Object}
   */
  total: null,

  /**
   * In case of successful post retrieval this property holds the array of retrieved posts
   * @type {Array[Post]}
   */
  posts: [],

  /**
   * The post object which is under edited by post editor
   * @type {Post}
   */
  post: null,
};

export default handleActions(
  (state) => state || initState,

  [
    Actions.loadPostsSuccess,
    (state, { data, query } = {}) => {
      const { result: posts, total } = data || {};
      const { search, filter, sort, range } = query || {};

      return {
        ...state,
        loadError: false,
        search,
        filter,
        sort,
        range,
        total,
        posts,
      };
    },
  ],
  //  [Actions.loadPostsFailure, (state, { error: loadError }) => ({ ...state, loadError })],

  [
    Actions.loadPostSuccess,
    (state, { data: { result: post } = {} } = {}) =>
      post
        ? {
            ...state,
            post,
            posts: updateItemById(state.posts, post),
          }
        : state,
  ],
  [
    Actions.savePostSuccess,
    (state, { data: { result: post } = {} } = {}) =>
      post
        ? {
            ...state,
            post: state.post && (!state.post.id || state.post.id === post.id ? post : null),
            posts: updateItemById(state.posts, post),
          }
        : state,
  ],
  [Actions.resetPost, (state) => ({ ...state, post: null })],
  [
    Actions.createPost,
    (state, { userId }) => ({
      ...state,
      post: {
        id: 0,
        title: '',
        lead: '',
        content: '',
        status: PostStatus.DRAFT,
        segment: Segment.FAMILY,
        createdBy: userId,
        updatedBy: userId,
      },
    }),
  ],
);
