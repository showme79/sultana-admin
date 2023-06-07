import { Segment } from 'consts';
import services from 'services';
import { createActions } from 'utils/store';

import { getCategories, getFilter, getRange, getSort } from './selectors';

const actions = createActions(
  {
    createCategory: (userId) => ({ userId }),

    resetCategory: null,

    loadCategory: [
      (categoryId) => (dispatch) => {
        dispatch(actions.resetCategory());

        return services
          .loadCategory({ categoryId })
          .then((response) => dispatch(actions.loadCategorySuccess(response, response.data)));
      },
    ],
    loadCategorySuccess: (response, data) => ({ response, data }),

    loadCategories: [
      ({ filter, sort, range }) =>
        (dispatch) => {
          const filterParams = filter && {
            'name~like': `%${filter.name || ''}%`,
            'segments~like': filter.segment !== Segment.ALL ? `%${filter.segment}%` : undefined,
            status: filter.status !== 'ALL' ? filter.status : undefined,
          };

          return services
            .loadCategories({ filter: filterParams, sort, range })
            .then((response) =>
              dispatch(actions.loadCategoriesSuccess(response, response.data, { filter, sort, range })),
            );
        },
    ],
    loadCategoriesSuccess: (response, data, query) => ({ response, data, query }),

    saveCategory: [
      (category) => (dispatch) => {
        const { id: categoryId } = category;
        return services[categoryId ? 'updateCategory' : 'createCategory']({
          categoryId,
          category: { ...category, parentId: category.parentId || null },
        }).then((response) => dispatch(actions.saveCategorySuccess(response, response.data)));
      },
    ],
    saveCategorySuccess: (response, data) => ({ response, data }),

    deleteCategories: [
      (id) => (dispatch, getState) =>
        services.deleteCategories({ id }).then((response) => {
          const { data: { result = [] } = {} } = response || {};
          const state = getState();
          const [categories, sort, rangeOld, filter] = [
            getCategories(state),
            getSort(state),
            getRange(state),
            getFilter(state),
          ];

          // update page when all items are deleted
          const range =
            categories.length - result.length <= 0
              ? {
                  offset: Math.max(0, rangeOld.offset - rangeOld.limit),
                  limit: rangeOld.limit,
                }
              : rangeOld;

          dispatch(actions.loadCategories({ filter, sort, range }));
          return response;
        }),
    ],
  },
  'categories',
);

export default actions;
