import { indexOf, isArray, map, mapValues } from 'lodash-es';
import { createSelector } from 'reselect';

export const isAuthenticated = ({ app: { auth } }) => !auth || !auth.user;

export const getUser = ({ app: { auth } }) => auth?.user || null;

export const getUserId = ({ app: { auth } }) => auth?.user?.id || null;

export const getProfile = ({ app: { auth } }) => auth?.user?.profile || null;

export const getUsername = ({ app: { auth } }) => auth?.user?.username || null;

// export const getRights = ({ app: { auth } }) => ((user && user.rights) || []).reduce((res, func) => ({ ...res, [func]: true }), {}); // TODO: use reselect

// export const getRoles = ({ app: { auth } }) => ((user && user.roles) || []).reduce((res, func) => ({ ...res, [func]: true }), {}); // TODO: use reselect

export const getProgressDialog = ({ app: { progressDialog } }) => progressDialog;

export const getPreferences = ({ app: { preferences } }) => preferences;

export const getStats = ({ app: { stats } }) => stats;

export const hasRole =
  (roles) =>
  ({ app: { auth: { user = null } = {} } }) =>
    indexOf(roles, user && user.role) >= 0;

export const hasOneOfRole = createSelector(
  getUser,
  ($, { roles }) => roles,
  (user, roles) => indexOf(roles, user?.role) >= 0,
);

export const calculateRights = createSelector(
  getUser,
  ($, { rightsMap }) => rightsMap,
  (user, rightsMap) => {
    const role = user?.role;
    const mapper = isArray(rightsMap) ? map : mapValues;
    return mapper(rightsMap, (roles) => indexOf(roles, role) >= 0);
  },
);
