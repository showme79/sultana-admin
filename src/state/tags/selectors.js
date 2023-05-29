import { Role, rowsPerPageOptions } from 'consts';

import { getUserId, hasRole } from '../app/selectors';

export const getLoadError = ({ tags: { loadError } }) => loadError;

export const getTag = ({ tags: { tag } }) => tag;
export const getTags = ({ tags: { tags } }) => tags;
export const getTagsTotal = ({ tags: { total } }) => total;

export const getSort = ({ tags: { sort } }) => sort;
export const getSortKey = ({
  tags: {
    sort: { key },
  },
}) => key;
export const getSortDirection = ({
  tags: {
    sort: { direction },
  },
}) => direction;

export const getRange = ({ tags: { range } }) => range || { offset: 0, limit: rowsPerPageOptions[0] };
export const getPageNumber = ({ tags: { range } }) =>
  (range && (range.offset || 0) / (range.limit || rowsPerPageOptions[0])) || 0;
export const getRowsPerPage = ({ tags: { range } }) => (range && range.limit) || rowsPerPageOptions[0];

export const getFilter = ({ tags: { filter } }) => filter;

export const getRights = (state) => {
  const isEditor = hasRole(Role.$EDITORS)(state);
  const isSuper = hasRole(Role.$SUPERS)(state);
  const userId = getUserId(state);
  return {
    VIEW: isEditor,
    CREATE: isEditor,
    EDIT: (item) => item.createdBy === userId || isSuper,
    DELETE: (item) => item.createdBy === userId || isSuper,
    DELETE_SELECTED: isEditor,
    SET_STATUS: isSuper,
  };
};
