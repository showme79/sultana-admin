import { Role, SortDirection, UserStatus } from 'consts';
import { updateItemById } from 'utils';
import { handleActions } from 'utils/store';

import Actions from './actions';

const initState = {
  /**
   * In case of users retrieval error, this property stores the error object or `false` when no error found
   * @type {Boolean}
   */
  loadError: false,

  /**
   * In case of successful user retrieval this property holds the filter parameter of the last successful query.
   * @type {Object}
   */
  filter: undefined,

  /**
   * In case of successful user retrieval this property holds the sort parameter of the last successful query.
   * @type {Object}
   */
  sort: {
    key: 'createdAt',
    direction: SortDirection.DESC,
  },

  /**
   * In case of successful user retrieval this property holds the range (from, count) parameters of the last successful query.
   * @type {Object}
   */
  range: null,

  /**
   * In case of successful user retrieval this property holds the total number of users items with the actual filter parameter.
   * @type {Object}
   */
  total: null,

  /**
   * In case of successful user retrieval this property holds the array of retrieved users
   * @type {Array[User]}
   */
  users: [],

  /**
   * The user object which is under edited by user editor
   * @type {User}
   */
  user: null,
};

export default handleActions(
  (state) => state || initState,

  [
    Actions.loadUsersSuccess,
    (state, { data, query } = {}) => {
      const { result: users, total } = data || {};
      const { filter, sort, range } = query || {};

      return {
        ...state,
        loadError: false,
        filter,
        sort,
        range,
        total,
        users,
      };
    },
  ],

  [
    Actions.loadUserSuccess,
    (state, { data: { result: user } = {} } = {}) =>
      user
        ? {
            ...state,
            user,
            users: updateItemById(state.users, user),
          }
        : state,
  ],
  [
    Actions.saveUserSuccess,
    (state, { data: { result: user } = {} } = {}) =>
      user
        ? {
            ...state,
            user: state.user && (state.user.id === user.id ? user : null),
            users: updateItemById(state.users, user),
          }
        : state,
  ],
  [Actions.resetUser, (state) => ({ ...state, user: null })],
  [
    Actions.createUser,
    (state, { userId }) => ({
      ...state,
      user: {
        username: '',
        status: UserStatus.NEW,
        role: Role.WRITER,
        createdBy: userId,
        updatedBy: userId,
        profile: {
          lastName: '',
          firstName: '',
          createdBy: userId,
          updatedBy: userId,
        },
      },
    }),
  ],
);
