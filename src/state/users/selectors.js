import { Role, rowsPerPageOptions } from 'consts';

import { hasRole } from '../app/selectors';

export const getLoadError = ({ users: { loadError } }) => loadError;

export const getUser = ({ users: { user } }) => user;
export const getUsers = ({ users: { users } }) => users;
export const getUsersTotal = ({ users: { total } }) => total;

export const getSort = ({ users: { sort } }) => sort;
export const getSortKey = ({
  users: {
    sort: { key },
  },
}) => key;
export const getSortDirection = ({
  users: {
    sort: { direction },
  },
}) => direction;

export const getRange = ({ users: { range } }) => range || { offset: 0, limit: rowsPerPageOptions[0] };
export const getPageNumber = ({ users: { range } }) =>
  (range && (range.offset || 0) / (range.limit || rowsPerPageOptions[0])) || 0;
export const getRowsPerPage = ({ users: { range } }) => (range && range.limit) || rowsPerPageOptions[0];

export const getFilter = ({ users: { filter } }) => filter;

export const getRights = (state) => {
  const isSuper = hasRole(Role.$SUPERS)(state);

  return {
    VIEW: isSuper,
    CREATE: isSuper,
    EDIT: isSuper,
    DELETE: isSuper,
    DELETE_SELECTED: isSuper,
  };
};
