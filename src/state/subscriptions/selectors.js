import { Role, rowsPerPageOptions } from 'consts';

import { hasRole } from '../app/selectors';

export const getLoadError = ({ subscriptions: { loadError } }) => loadError;

export const getSubscription = ({ subscriptions: { subscription } }) => subscription;
export const getSubscriptions = ({ subscriptions: { subscriptions } }) => subscriptions;
export const getSubscriptionsTotal = ({ subscriptions: { total } }) => total;

export const getSort = ({ subscriptions: { sort } }) => sort;
export const getSortKey = ({
  subscriptions: {
    sort: { key },
  },
}) => key;
export const getSortDirection = ({
  subscriptions: {
    sort: { direction },
  },
}) => direction;

export const getRange = ({ subscriptions: { range } }) => range || { offset: 0, limit: rowsPerPageOptions[0] };
export const getPageNumber = ({ subscriptions: { range } }) =>
  (range && (range.offset || 0) / (range.limit || rowsPerPageOptions[0])) || 0;
export const getRowsPerPage = ({ subscriptions: { range } }) => (range && range.limit) || rowsPerPageOptions[0];

export const getFilter = ({ subscriptions: { filter } }) => filter;

export const getRights = (state) => {
  const isSuper = hasRole(Role.$SUPERS)(state);

  return {
    ADD: isSuper,
    VIEW: isSuper,
    CREATE: isSuper,
    EDIT: isSuper,
    DELETE: isSuper,
    DELETE_SELECTED: isSuper,
    SYNC: isSuper,
  };
};
