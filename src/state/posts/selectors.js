import { PostStatus, Role, rowsPerPageOptions } from 'consts';

import { getUserId, hasRole } from '../app/selectors';

export const getLoadError = ({ posts: { loadError } }) => loadError;

export const getPost = ({ posts: { post } }) => post;
export const getPosts = ({ posts: { posts } }) => posts;
export const getPostsTotal = ({ posts: { total } }) => total;

export const getSort = ({ posts: { sort } }) => sort;
export const getSortKey = ({
  posts: {
    sort: { key },
  },
}) => key;
export const getSortDirection = ({
  posts: {
    sort: { direction },
  },
}) => direction;

export const getRange = ({ posts: { range } }) => range || { offset: 0, limit: rowsPerPageOptions[0] };
export const getPageNumber = ({ posts: { range } }) =>
  (range && (range.offset || 0) / (range.limit || rowsPerPageOptions[0])) || 0;
export const getRowsPerPage = ({ posts: { range } }) => (range && range.limit) || rowsPerPageOptions[0];

export const getFilter = ({ posts: { filter } }) => filter;
export const getSearch = ({ posts: { search } }) => search;

export const getRights = (state) => {
  const isWriter = hasRole(Role.$WRITERS)(state);
  const isEditor = hasRole(Role.$EDITORS)(state);
  const isSuper = hasRole(Role.$SUPERS)(state);
  const userId = getUserId(state);
  const isLockedByUserOrUnlocked = (item) => !item.lockedBy || item.lockedBy === userId;

  return {
    VIEW: isWriter,
    CREATE: isWriter,
    UNLOCK: (item) => !!item.lockedBy && (isEditor || (isWriter && item.lockedBy === userId)),
    EDIT: (item) =>
      isLockedByUserOrUnlocked(item) &&
      (isEditor || (isWriter && [PostStatus.DRAFT, PostStatus.NOT_APPROVED].includes(item.status))),
    DELETE: (item) =>
      isLockedByUserOrUnlocked(item) && (isEditor || (isWriter && [PostStatus.DRAFT].includes(item.status))),
    DELETE_SELECTED: isEditor,
    SET_FEATURED: (item) => isEditor && isLockedByUserOrUnlocked(item),
    SET_STATUS: (item) => isEditor && isLockedByUserOrUnlocked(item),
    SET_STATUS_NEW: isLockedByUserOrUnlocked,
    SET_STATUS_DRAFT: isLockedByUserOrUnlocked,
    SET_STATUS_READY: isLockedByUserOrUnlocked,
    SET_STATUS_APPROVE_ON: (item) => isEditor && isLockedByUserOrUnlocked(item),
    SET_STATUS_APPROVED: (item) => isEditor && isLockedByUserOrUnlocked(item),
    SET_STATUS_NOT_APPROVED: (item) => isEditor && isLockedByUserOrUnlocked(item),
    SET_STATUS_REVOKED: (item) => isEditor && isLockedByUserOrUnlocked(item),
    PREVIEW: isWriter,
    EDIT_CSS: isSuper,
    EDIT_JS: isSuper,
    SWITCH_CONTENT_MODE: isSuper,
  };
};
