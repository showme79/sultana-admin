import services from 'services';
import { createActions } from 'utils/store';

import { getFilter, getRange, getSort, getSubscriptions } from './selectors';

const actions = createActions(
  {
    createSubscription: (subscriptionId) => ({ subscriptionId }),

    resetSubscription: null,

    loadSubscription: [
      (subscriptionId) => (dispatch) => {
        dispatch(actions.resetSubscription());

        return services
          .loadSubscription({ subscriptionId })
          .then((response) => dispatch(actions.loadSubscriptionSuccess(response, response.data)));
      },
    ],
    loadSubscriptionSuccess: (response, data) => ({ response, data }),

    loadSubscriptions: [
      ({ filter, sort, range }) =>
        (dispatch) => {
          const { email, status, type } = filter || {};
          const filterParams = {
            type: type !== 'ALL' ? type : undefined,
            status: status !== 'ALL' ? status : undefined,
            'email~like': `%${email || ''}%`,
          };

          return services
            .loadSubscriptions({ filter: filterParams, sort, range })
            .then((response) =>
              dispatch(actions.loadSubscriptionsSuccess(response, response.data, { filter, sort, range })),
            );
        },
    ],
    loadSubscriptionsSuccess: (response, data, query) => ({ response, data, query }),

    saveSubscription: [
      (subscription) => (dispatch) => {
        const { id: subscriptionId } = subscription;
        return services[subscriptionId ? 'updateSubscription' : 'createSubscription']({
          subscriptionId,
          subscription,
        }).then((response) => dispatch(actions.saveSubscriptionSuccess(response, response.data)));
      },
    ],
    saveSubscriptionSuccess: (response, data) => ({ response, data }),

    deleteSubscriptions: [
      (id) => (dispatch, getState) =>
        services.deleteSubscriptions({ id }).then((response) => {
          const { data: { result = [] } = {} } = response || {};
          const state = getState();
          const [subscriptions, sort, rangeOld, filter] = [
            getSubscriptions(state),
            getSort(state),
            getRange(state),
            getFilter(state),
          ];

          // update page when all items are deleted
          const range =
            subscriptions.length - result.length <= 0
              ? {
                  offset: Math.max(0, rangeOld.offset - rangeOld.limit),
                  limit: rangeOld.limit,
                }
              : rangeOld;

          dispatch(actions.loadSubscriptions({ filter, sort, range }));
          return response;
        }),
    ],
  },
  'subscriptions',
);

export default actions;
