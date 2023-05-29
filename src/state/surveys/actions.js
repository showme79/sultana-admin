import services from 'services';
import { createActions } from 'utils/store';

const actions = createActions(
  {
    loadSurveys: [
      (dispatch) =>
        services.loadSurveys().then((response) => dispatch(actions.loadSurveysSuccess(response, response.data))),
    ],

    loadSurveysSuccess: (response, data) => ({ response, data }),
  },
  'surveys',
);

export default actions;
