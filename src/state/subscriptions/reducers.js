import { SortDirection, SubscriptionStatus } from 'consts';
import { updateItemById } from 'utils';
import { handleActions } from 'utils/store';

import Actions from './actions';

const initState = {
  /**
   * In case of subscriptions retrieval error, this property stores the error object or `false` when no error found
   * @type {Boolean}
   */
  loadError: false,

  /**
   * In case of successful subscription retrieval this property holds the filter parameter of the last successful query.
   * @type {Object}
   */
  filter: undefined,

  /**
   * In case of successful subscription retrieval this property holds the sort parameter of the last successful query.
   * @type {Object}
   */
  sort: {
    key: 'createdAt',
    direction: SortDirection.DESC,
  },

  /**
   * In case of successful subscription retrieval this property holds the range (from, count) parameters of the last successful query.
   * @type {Object}
   */
  range: null,

  /**
   * In case of successful subscription retrieval this property holds the total number of subscriptions items with the actual filter parameter.
   * @type {Object}
   */
  total: null,

  /**
   * In case of successful subscription retrieval this property holds the array of retrieved subscriptions
   * @type {Array[subscription]}
   */
  subscriptions: [],

  /**
   * The subscription object which is under edited by subscription editor
   * @type {subscription}
   */
  subscription: null,
};

export default handleActions(
  (state) => state || initState,

  [
    Actions.loadSubscriptionsSuccess,
    (state, { data, query } = {}) => {
      const { result: subscriptions, total } = data || {};
      const { filter, sort, range } = query || {};

      return {
        ...state,
        loadError: false,
        filter,
        sort,
        range,
        total,
        subscriptions,
      };
    },
  ],

  [
    Actions.loadSubscriptionSuccess,
    (state, { data: { result: subscription } = {} } = {}) =>
      subscription
        ? {
            ...state,
            subscription,
            subscriptions: updateItemById(state.subscriptions, subscription),
          }
        : state,
  ],
  [
    Actions.saveSubscriptionSuccess,
    (state, { data: { result: subscription } = {} } = {}) =>
      subscription
        ? {
            ...state,
            subscription: state.subscription && (state.subscription.id === subscription.id ? subscription : null),
            subscriptions: updateItemById(state.subscriptions, subscription),
          }
        : state,
  ],
  [Actions.resetSubscription, (state) => ({ ...state, subscription: null })],
  [
    Actions.createSubscription,
    (state, { userId }) => ({
      ...state,
      subscription: {
        email: '',
        status: SubscriptionStatus.ACTIVE,
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
