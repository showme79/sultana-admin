import services from 'services';
import { createActions } from 'utils/store';

import { getFilter, getRange, getSort, getUsers } from './selectors';

const actions = createActions(
  {
    createUser: (userId) => ({ userId }),

    resetUser: null,

    loadUser: [
      (userId) => (dispatch) => {
        dispatch(actions.resetUser());

        return services
          .loadUser({ userId })
          .then((response) => dispatch(actions.loadUserSuccess(response, response.data)));
      },
    ],
    loadUserSuccess: (response, data) => ({ response, data }),

    loadUsers: [
      ({ filter, sort, range }) =>
        (dispatch) => {
          const { username, status } = filter || {};
          const filterParams = {
            status: status !== 'ALL' ? status : undefined,
            username,
          };

          return services
            .loadUsers({ filter: filterParams, sort, range })
            .then((response) => dispatch(actions.loadUsersSuccess(response, response.data, { filter, sort, range })));
        },
    ],
    loadUsersSuccess: (response, data, query) => ({ response, data, query }),

    saveUser: [
      (user) => (dispatch) => {
        const { id: userId } = user;
        return services[userId ? 'updateUser' : 'createUser']({ userId, user }).then((response) =>
          dispatch(actions.saveUserSuccess(response, response.data)),
        );
      },
    ],
    saveUserSuccess: (response, data) => ({ response, data }),

    deleteUsers: [
      (id) => (dispatch, getState) =>
        services.deleteUsers({ id }).then((response) => {
          const { data: { result = [] } = {} } = response || {};
          const state = getState();
          const [users, sort, rangeOld, filter] = [getUsers(state), getSort(state), getRange(state), getFilter(state)];

          // update page when all items are deleted
          const range =
            users.length - result.length <= 0
              ? {
                  offset: Math.max(0, rangeOld.offset - rangeOld.limit),
                  limit: rangeOld.limit,
                }
              : rangeOld;

          dispatch(actions.loadUsers({ filter, sort, range }));
          return response;
        }),
    ],
  },
  'users',
);

export default actions;
