import { Role, rowsPerPageOptions } from 'consts';

import { getUserId, hasRole } from '../app/selectors';

export const getLoadError = ({ categories: { loadError } }) => loadError;

export const getCategory = ({ categories: { category } }) => category;
export const getCategories = ({ categories: { categories } }) => categories;
export const getCategoriesTotal = ({ categories: { total } }) => total;

export const getSort = ({ categories: { sort } }) => sort;
export const getSortKey = ({
  categories: {
    sort: { key },
  },
}) => key;
export const getSortDirection = ({
  categories: {
    sort: { direction },
  },
}) => direction;

export const getRange = ({ categories: { range } }) => range || { offset: 0, limit: rowsPerPageOptions[0] };
export const getPageNumber = ({ categories: { range } }) =>
  (range && (range.offset || 0) / (range.limit || rowsPerPageOptions[0])) || 0;
export const getRowsPerPage = ({ categories: { range } }) => (range && range.limit) || rowsPerPageOptions[0];

export const getFilter = ({ categories: { filter } }) => filter;

export const getRights = (state) => {
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
};
