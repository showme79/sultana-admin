import { Role } from 'consts';

import { hasRole } from '../app/selectors';

export const getLoadError = ({ surveys: { loadError } }) => loadError;

export const getSurveys = ({ surveys: { surveys } }) => surveys;

export const getSurveysTotal = ({ surveys: { total } }) => total;

export const getRights = (state) => {
  const isEditor = hasRole(Role.$EDITORS)(state);
  return {
    VIEW: isEditor,
    DOWNLOAD: isEditor,
  };
};
