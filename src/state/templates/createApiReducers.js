import { merge } from 'lodash-es';

import { SortDirection } from 'consts';
import { updateItemById } from 'utils';
import { handleActions } from 'utils/store';

/**
 * Creates reducers for CRUD handling
 * @example
 * export const banners = createApiReducers({ actions: BannersActions });
 */
const createApiReducers = ({ actions, initState = {} }) => {
  const initStateFinal = merge(
    {
      /**
       * In case of item retrieval error, this property stores the error object or `false` when no error found
       * @type {Boolean}
       */
      loadError: false,

      /**
       * In case of successful retrieval this property holds the filter parameter of the last successful query.
       * @type {Object}
       */
      filter: {
        name: '',
      },

      /**
       * In case of successful retrieval this property holds the sort parameter of the last successful query.
       * @type {Object}
       */
      sort: {
        key: 'name',
        direction: SortDirection.ASC,
      },

      /**
       * In case of successful retrieval this property holds the range (from, count) parameters of the last successful query.
       * @type {Object}
       */
      range: null,

      /**
       * In case of successful retrieval this property holds the total number of items with the actual filter parameter.
       * @type {Object}
       */
      total: null,

      /**
       * In case of successful retrieval this property holds the array of retrieved items
       * @type {Array[Model]}
       */
      items: [],

      /**
       * The item which is under edited by the editor
       * @type {Model}
       */
      item: null,
    },
    initState,
  );

  return handleActions(
    (state) => state || initStateFinal,

    [
      actions.loadListSuccess,
      (state, { data, query } = {}) => {
        const { result: items, total } = data || {};
        const { filter, sort, range } = query || {};

        return {
          ...state,
          loadError: false,
          filter,
          sort,
          range,
          total,
          items,
        };
      },
    ],

    [
      actions.loadItemSuccess,
      (state, { data: { result: item } = {} } = {}) =>
        item
          ? {
              ...state,
              item,
              items: updateItemById(state.items, item),
            }
          : state,
    ],
    [
      actions.saveItemSuccess,
      (state, { data: { result: item } = {} } = {}) =>
        item
          ? {
              ...state,
              item: state.item && (state.item.id === item.id ? item : null),
              items: updateItemById(state.items, item),
            }
          : state,
    ],
    [actions.reset, (state) => ({ ...state, item: null })],
    [
      actions.create,
      (state, { userId }) => ({
        ...state,
        item: {
          createdBy: userId,
          updatedBy: userId,
        },
      }),
    ],
  );
};

export default createApiReducers;
