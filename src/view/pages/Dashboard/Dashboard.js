import { Card, CardMedia, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { UserPropType } from 'consts/prop-types';
import { AppActions, AppSelectors } from 'state';

import styles from './Dashboard.styles';

class Dashboard extends Component {
  componentDidMount() {
    const { loadStats } = this.props;
    loadStats();
  }

  render() {
    const { classes, user } = this.props;

    if (!user) {
      return '';
    }

    return (
      <Card className={classes.root}>
        <CardMedia className={classes.logo} image="resources/images/big-logo.png" />
      </Card>
    );
  }
}

Dashboard.propTypes = {
  ...ReactRouterPropTypes.isRequired,
  loadStats: PropTypes.func.isRequired,
  user: UserPropType,
};

Dashboard.defaultProps = {
  user: undefined,
};

const mapStateToProps = (state) => ({
  user: AppSelectors.getUser(state),
  stats: AppSelectors.getStats(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadStats: () => dispatch(AppActions.loadStats()),
});

export default withStyles(styles)(withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard)));
