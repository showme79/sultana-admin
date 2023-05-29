import { withStyles } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Action } from 'consts';
import { SurveyRightsPropType } from 'consts/prop-types';
import { GetAppIcon } from 'icons';
// import services from 'services';
import { AppSelectors, SurveysActions, SurveysSelector } from 'state';
import { ExTable } from 'view/components';

import columns from './Surveys.columns';
import styles from './Surveys.styles';

const onItemActionClick = (action, survey /* , event */) => {
  const { id: actionId } = action;
  if (actionId === Action.DOWNLOAD) {
    window.open(`/api/survey/${survey.id}?download=true&html=true`, '_parent');
    // services.downloadSurvey({ postId: survey.id, download: true, html: true });
  }

  return false;
};

class Surveys extends Component {
  componentDidMount() {
    const { loadSurveys } = this.props;
    loadSurveys();
  }

  render() {
    const { classes, surveys, rights, total } = this.props;

    const itemActions = [
      {
        id: Action.DOWNLOAD,
        visible: rights.DOWNLOAD,
        tooltip: 'Kérdőív eredmények letöltése',
        icon: <GetAppIcon />,
      },
    ];

    const { table = '', row = '', column = '' } = classes;
    const classesTable = { table, row, column };

    return (
      <div className={clsx(classes.root)}>
        <ExTable
          classes={classesTable}
          title="Kérdőívek"
          items={surveys}
          total={total}
          columns={columns}
          itemActions={itemActions}
          onItemActionClick={onItemActionClick}
        />
      </div>
    );
  }
}

Surveys.propTypes = {
  ...ReactRouterPropTypes.isRequired,
  surveys: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  rights: SurveyRightsPropType.isRequired,
};

const mapStateToProps = (state) => ({
  surveys: SurveysSelector.getSurveys(state),
  total: SurveysSelector.getSurveysTotal(state),
  user: AppSelectors.getUser(state),
  rights: SurveysSelector.getRights(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadSurveys: () => dispatch(SurveysActions.loadSurveys),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Surveys)));
