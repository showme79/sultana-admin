import { handleActions } from 'utils/store';

import Actions from './actions';

const initState = {
  /**
   * In case of surveys retrieval error, this property stores the error object or `false` when no error found
   * @type {Boolean}
   */
  loadError: false,

  /**
   * In case of successful survey retrieval this property holds the total number of surveys items with the actual filter parameter.
   * @type {Object}
   */
  total: null,

  /**
   * In case of successful survey retrieval this property holds the array of retrieved surveys
   * @type {Array[Survey]}
   */
  surveys: [],
};

export default handleActions(
  (state) => state || initState,

  [
    Actions.loadSurveysSuccess,
    (state, { data } = {}) => {
      const { posts: surveys, total } = data || {};
      return {
        ...state,
        loadError: false,
        total,
        surveys,
      };
    },
  ],
);
