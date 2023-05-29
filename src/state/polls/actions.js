import services from 'services';
import { createActions } from 'utils/store';

import { getFilter, getPolls, getRange, getSort } from './selectors';

const actions = createActions(
  {
    createPoll: (userId) => ({ userId }),

    resetPoll: null,

    loadPoll: [
      (pollId) => (dispatch) => {
        dispatch(actions.resetPoll());

        return services
          .loadPoll({ pollId })
          .then((response) => dispatch(actions.loadPollSuccess(response, response.data)));
      },
    ],
    loadPollSuccess: (response, data) => ({ response, data }),

    loadPolls: [
      ({ filter, sort, range }) =>
        (dispatch) => {
          const filterParams = {
            'name~like': `%${filter.name || ''}%`,
          };

          return services
            .loadPolls({ filter: filterParams, sort, range })
            .then((response) => dispatch(actions.loadPollsSuccess(response, response.data, { filter, sort, range })));
        },
    ],
    loadPollsSuccess: (response, data, query) => ({ response, data, query }),

    savePoll: [
      (poll) => (dispatch) => {
        const { id: pollId } = poll;
        return services[pollId ? 'updatePoll' : 'createPoll']({ pollId, poll }).then((response) =>
          dispatch(actions.savePollSuccess(response, response.data)),
        );
      },
    ],
    savePollSuccess: (response, data) => ({ response, data }),

    deletePolls: [
      (id) => (dispatch, getState) =>
        services.deletePolls({ id }).then((response) => {
          const { data: { result = [] } = {} } = response || {};
          const state = getState();
          const [polls, sort, rangeOld, filter] = [getPolls(state), getSort(state), getRange(state), getFilter(state)];

          // update page when all items are deleted
          const range =
            polls.length - result.length <= 0
              ? {
                  offset: Math.max(0, rangeOld.offset - rangeOld.limit),
                  limit: rangeOld.limit,
                }
              : rangeOld;

          dispatch(actions.loadPolls({ filter, sort, range }));
          return response;
        }),
    ],
  },
  'polls',
);

export default actions;
