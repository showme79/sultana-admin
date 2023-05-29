import { Role, rowsPerPageOptionsThumbs } from 'consts';
import { getUserId, hasRole } from 'state/app/selectors';
import { calcPageNumber, calcRowsPerPage } from 'utils';

export const getLoadError = ({ media: { loadError } }) => loadError;

export const getMedia = ({ media: { media } }) => media;
export const getMediaList = ({ media: { mediaList } }) => mediaList;
export const getMediaTotal = ({ media: { total } }) => total;

export const getSort = ({ media: { sort } }) => sort;
export const getSortKey = ({
  media: {
    sort: { key },
  },
}) => key;
export const getSortDirection = ({
  media: {
    sort: { direction },
  },
}) => direction;

export const getRange = ({ media: { range } }) => range || { offset: 0, limit: rowsPerPageOptionsThumbs[0] };
export const getPageNumber = ({ media: { range } }) => calcPageNumber(range, 0, rowsPerPageOptionsThumbs[0]);
export const getRowsPerPage = ({ media: { range } }) => calcRowsPerPage(range, rowsPerPageOptionsThumbs[0]);

export const getFilter = ({ media: { filter } }) => filter;
export const getSearch = ({ media: { search } }) => search;

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
