import { Role, rowsPerPageOptions } from 'consts';

import { getUserId, hasRole } from '../app/selectors';

export const getLoadError = ({ polls: { loadError } }) => loadError;

export const getPoll = ({ polls: { poll } }) => poll;
export const getPolls = ({ polls: { polls } }) => polls;
export const getPollsTotal = ({ polls: { total } }) => total;

export const getSort = ({ polls: { sort } }) => sort;
export const getSortKey = ({
  polls: {
    sort: { key },
  },
}) => key;
export const getSortDirection = ({
  polls: {
    sort: { direction },
  },
}) => direction;

export const getRange = ({ polls: { range } }) => range || { offset: 0, limit: rowsPerPageOptions[0] };
export const getPageNumber = ({ polls: { range } }) =>
  (range && (range.offset || 0) / (range.limit || rowsPerPageOptions[0])) || 0;
export const getRowsPerPage = ({ polls: { range } }) => (range && range.limit) || rowsPerPageOptions[0];

export const getFilter = ({ polls: { filter } }) => filter;

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
