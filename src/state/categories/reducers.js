import { SortDirection } from 'consts';
import { updateItemById } from 'utils';
import { handleActions } from 'utils/store';

import Actions from './actions';

const initState = {
  /**
   * In case of categories retrieval error, this property stores the error object or `false` when no error found
   * @type {Boolean}
   */
  loadError: false,

  /**
   * In case of successful category retrieval this property holds the filter parameter of the last successful query.
   * @type {Object}
   */
  filter: undefined,

  /**
   * In case of successful category retrieval this property holds the sort parameter of the last successful query.
   * @type {Object}
   */
  sort: {
    key: 'realSequence',
    direction: SortDirection.ASC,
  },

  /**
   * In case of successful category retrieval this property holds the range (from, count) parameters of the last successful query.
   * @type {Object}
   */
  range: null,

  /**
   * In case of successful category retrieval this property holds the total number of categories items with the actual filter parameter.
   * @type {Object}
   */
  total: null,

  /**
   * In case of successful category retrieval this property holds the array of retrieved categories
   * @type {Array[Category]}
   */
  categories: [],

  /**
   * The category object which is under edited by category editor
   * @type {Category}
   */
  category: null,
};

export default handleActions(
  (state) => state || initState,

  [
    Actions.loadCategoriesSuccess,
    (state, { data, query } = {}) => {
      const { result: categories, total } = data || {};
      const { filter, sort, range } = query || {};

      return {
        ...state,
        loadError: false,
        filter,
        sort,
        range,
        total,
        categories,
      };
    },
  ],

  [
    Actions.loadCategorySuccess,
    (state, { data: { result: category } = {} } = {}) =>
      category
        ? {
            ...state,
            category,
            categories: updateItemById(state.categories, category),
          }
        : state,
  ],
  [
    Actions.saveCategorySuccess,
    (state, { data: { result: category } = {} } = {}) =>
      category
        ? {
            ...state,
            category: state.category && (state.category.id === category.id ? category : null),
            categories: updateItemById(state.categories, category),
          }
        : state,
  ],
  [Actions.resetCategory, (state) => ({ ...state, category: null })],
  [
    Actions.createCategory,
    (state, { userId }) => ({
      ...state,
      category: {
        name: '',
        color: null,
        parentId: null,
        createdBy: userId,
        updatedBy: userId,
      },
    }),
  ],
);
