import { Role, rowsPerPageOptions } from 'consts';

import { getUserId, hasRole } from '../app/selectors';

/**
 * Creates API selectors for CRUD operations
 * @example
 * ```
 * export const BannersSelectors = createApiSelectors({ namespace: 'banners' });
 * ```
 */
const createApiSelectors = ({ namespace }) => ({
  getLoadError: ({ [namespace]: { loadError } }) => loadError,

  getItem: ({ [namespace]: { item } }) => item,
  getItems: ({ [namespace]: { items } }) => items,
  getItemsTotal: ({ [namespace]: { total } }) => total,

  getSort: ({ [namespace]: { sort } }) => sort,
  getSortKey: ({
    [namespace]: {
      sort: { key },
    },
  }) => key,
  getSortDirection: ({
    [namespace]: {
      sort: { direction },
    },
  }) => direction,

  getRange: ({ [namespace]: { range } }) => range || { offset: 0, limit: rowsPerPageOptions[0] },
  getPageNumber: ({ [namespace]: { range } }) =>
    (range && (range.offset || 0) / (range.limit || rowsPerPageOptions[0])) || 0,
  getRowsPerPage: ({ [namespace]: { range } }) => (range && range.limit) || rowsPerPageOptions[0],

  getFilter: ({ [namespace]: { filter } }) => filter,

  getRights: (state) => {
    const isEditor = hasRole(Role.$EDITORS)(state);
    const isSuper = hasRole(Role.$SUPERS)(state);
    const userId = getUserId(state);
    return {
      CREATE: isEditor,
      VIEW: isEditor,
      EDIT: (item) => item.createdBy === userId || isSuper,
      DELETE: (item) => item.createdBy === userId || isSuper,
      DELETE_SELECTED: isEditor,
    };
  },
});

export default createApiSelectors;
