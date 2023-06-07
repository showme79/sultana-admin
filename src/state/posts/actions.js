import { Segment } from 'consts';
import services from 'services';
import { createActions } from 'utils/store';

import { getFilter, getPosts, getRange, getSearch, getSort } from './selectors';

const actions = createActions(
  {
    createPost: (userId) => ({ userId }),

    resetPost: null,

    loadPost: [
      (postId) => (dispatch) => {
        dispatch(actions.resetPost());

        return services
          .loadPost({ postId })
          .then((response) => dispatch(actions.loadPostSuccess(response, response.data)));
      },
    ],
    lockPost: [
      (postId) => (dispatch) => {
        dispatch(actions.resetPost());

        return services
          .lockPost({ postId })
          .then((response) => dispatch(actions.loadPostSuccess(response, response.data)));
      },
    ],
    loadPostSuccess: (response, data) => ({ response, data }),

    loadPosts: [
      ({ search, filter, sort, range }) =>
        (dispatch) => {
          const filterParams = filter && {
            'priority~gt': filter.priority ? 0 : undefined,
            segment: filter.segment !== Segment.ALL ? filter.segment : undefined,
            status: filter.status !== 'ALL' ? filter.status : undefined,
          };
          return services
            .loadPosts({
              search,
              filter: filterParams,
              sort,
              range,
            })
            .then((response) =>
              dispatch(
                actions.loadPostsSuccess(response, response.data, {
                  search,
                  filter,
                  sort,
                  range,
                }),
              ),
            );
        },
    ],
    loadPostsSuccess: (response, data, query) => ({ response, data, query }),
    //  loadPostsFailure: (error, data) => ({ error, data }),

    savePost: [
      (post, unlock = false) =>
        (dispatch) => {
          const { id: postId } = post;
          return services[postId ? 'updatePost' : 'createPost']({ postId, post, unlock }).then((response) =>
            dispatch(actions.savePostSuccess(response, response.data)),
          );
        },
    ],
    unlockPost: [
      (postId) => (dispatch) => {
        dispatch(actions.resetPost());

        return services
          .unlockPost({ postId })
          .then((response) => dispatch(actions.savePostSuccess(response, response.data)));
      },
    ],
    savePostSuccess: (response, data) => ({ response, data }),

    deletePosts: [
      (id) => (dispatch, getState) =>
        services.deletePosts({ id }).then((response) => {
          const { data: { result = [] } = {} } = response || {};
          const state = getState();
          const [posts, sort, rangeOld, filter, search] = [
            getPosts(state),
            getSort(state),
            getRange(state),
            getFilter(state),
            getSearch(state),
          ];

          // update page when all items are deleted
          const range =
            posts.length - result.length <= 0
              ? {
                  offset: Math.max(0, rangeOld.offset - rangeOld.limit),
                  limit: rangeOld.limit,
                }
              : rangeOld;

          dispatch(
            actions.loadPosts({
              search,
              filter,
              sort,
              range,
            }),
          );
          return response;
        }),
    ],
  },
  'posts',
);

export default actions;
