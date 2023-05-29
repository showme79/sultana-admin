import { DateTime } from 'luxon';

import { SortDirection } from 'consts';
import { updateItemById } from 'utils';
import { handleActions } from 'utils/store';

import Actions from './actions';

const initState = {
  /**
   * In case of polls retrieval error, this property stores the error object or `false` when no error found
   * @type {Boolean}
   */
  loadError: false,

  /**
   * In case of successful poll retrieval this property holds the filter parameter of the last successful query.
   * @type {Object}
   */
  filter: {
    name: '',
  },

  /**
   * In case of successful poll retrieval this property holds the sort parameter of the last successful query.
   * @type {Object}
   */
  sort: {
    key: 'createdAt',
    direction: SortDirection.DESC,
  },

  /**
   * In case of successful poll retrieval this property holds the range (from, count) parameters of the last successful query.
   * @type {Object}
   */
  range: null,

  /**
   * In case of successful poll retrieval this property holds the total number of polls items with the actual filter parameter.
   * @type {Object}
   */
  total: null,

  /**
   * In case of successful poll retrieval this property holds the array of retrieved polls
   * @type {Array[Poll]}
   */
  polls: [],

  /**
   * The poll object which is under edited by poll editor
   * @type {Poll}
   */
  poll: null,
};

export default handleActions(
  (state) => state || initState,

  [
    Actions.loadPollsSuccess,
    (state, { data, query } = {}) => {
      const { result: polls, total } = data || {};
      const { filter, sort, range } = query || {};

      return {
        ...state,
        loadError: false,
        filter,
        sort,
        range,
        total,
        polls,
      };
    },
  ],
  [
    Actions.loadPollSuccess,
    (state, { data: { result: poll } = {} } = {}) =>
      poll
        ? {
            ...state,
            poll,
            polls: updateItemById(state.polls, poll),
          }
        : state,
  ],
  [
    Actions.savePollSuccess,
    (state, { data: { result: poll } = {} } = {}) =>
      poll
        ? {
            ...state,
            poll: state.poll && (state.poll.id === poll.id ? poll : null),
            polls: updateItemById(state.polls, poll),
          }
        : state,
  ],
  [Actions.resetPoll, (state) => ({ ...state, poll: null })],
  [
    Actions.createPoll,
    (state, { userId }) => ({
      ...state,
      poll: {
        name: '',
        startDate: DateTime.local(),
        endDate: DateTime.local().plus({ days: 14 }),
        createdBy: userId,
        updatedBy: userId,
      },
    }),
  ],
);
