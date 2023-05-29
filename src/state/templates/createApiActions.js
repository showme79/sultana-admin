import { createActions } from 'utils/store';

/**
 * Creates actions for CRUD handling
 * @example
 * export const BannersActions = createApiActions({
 *   namespace: 'banners',
 *   api: {
 *     loadItem: services.loadBanner,
 *     loadList: services.loadBanners,
 *     createItem: services.createBanner,
 *     updateItem: services.updateBanner,
 *     deleteItems: services.deleteBanners,
 *   },
 *   selectors: BannersSelectors,
 *   filterParamsMapperFn: ({ status, name, segment }) => ({
 *     status: (status !== 'ALL') ? status : undefined,
 *     'name~like': name ? `%${name || ''}%` : undefined,
 *     'segments~like': segment ? `%${segment}%` : undefined,
 *   }),
 * });
 */
const createApiActions = ({ namespace, api, selectors, filterParamsMapperFn }) => {
  const { getItems, getSort, getRange, getFilter } = selectors;

  const actions = createActions(
    {
      create: (userId) => ({ userId }),

      reset: null,

      loadItem: [
        (id) => (dispatch) => {
          dispatch(actions.reset());

          return api.loadItem({ id }).then((response) => dispatch(actions.loadItemSuccess(response, response.data)));
        },
      ],
      loadItemSuccess: (response, data) => ({ response, data }),

      loadList: [
        ({ filter, sort, range }) =>
          (dispatch) => {
            const filterParams = filterParamsMapperFn(filter, sort, range);

            return api
              .loadList({ filter: filterParams, sort, range })
              .then((response) => dispatch(actions.loadListSuccess(response, response.data, { filter, sort, range })));
          },
      ],
      loadListSuccess: (response, data, query) => ({ response, data, query }),

      saveItem: [
        (item) => (dispatch) => {
          const { id } = item;
          return api[id ? 'updateItem' : 'createItem']({ id, item }).then((response) =>
            dispatch(actions.saveItemSuccess(response, response.data)),
          );
        },
      ],
      saveItemSuccess: (response, data) => ({ response, data }),

      deleteItems: [
        (id) => (dispatch, getState) =>
          api.deleteItems({ id }).then((response) => {
            const { data: { result = [] } = {} } = response || {};
            const state = getState();
            const [items, sort, rangeOld, filter] = [
              getItems(state),
              getSort(state),
              getRange(state),
              getFilter(state),
            ];

            // update page when all items are deleted
            const range =
              items.length - result.length <= 0
                ? {
                    offset: Math.max(0, rangeOld.offset - rangeOld.limit),
                    limit: rangeOld.limit,
                  }
                : rangeOld;

            dispatch(actions.loadItems({ filter, sort, range }));
            return response;
          }),
      ],
    },
    namespace,
  );

  return actions;
};

export default createApiActions;
