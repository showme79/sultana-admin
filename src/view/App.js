import LuxonUtils from '@date-io/luxon';
import { CssBaseline, Dialog, DialogContent, DialogTitle, Typography, withStyles } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { find, get, isFunction } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, matchPath, withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Route as RouteConfig } from 'consts';
import { AppActions, AppSelectors } from 'state';
import logger from 'utils/logger';
import { Header, Navigation, ProgressDialog, Toasts } from 'view/components';
import { LoginDialog } from 'view/dialogs';
import theme from 'view/themes';

import modulesAll from './App.modules';
import styles from './App.styles';

const { REACT_APP_TITLE, REACT_APP_VERSION, REACT_APP_BUILD_DATE } = process.env;

const buildDate = REACT_APP_BUILD_DATE ? new Date(+REACT_APP_BUILD_DATE * 1000).toLocaleString() : '';

const ViewPort = ({ match, classes, module }) => {
  const Module = module.node;

  return (
    <>
      <div className={classes.main}>
        <Module {...match.params} />
      </div>
      <div id="id-modal-main" className={classes.modal} />
    </>
  );
};

ViewPort.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  classes: PropTypes.shape({ main: PropTypes.string, modal: PropTypes.string }).isRequired,
  module: PropTypes.shape({ node: PropTypes.elementType }).isRequired,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navOpen: false,
    };
  }

  componentDidMount() {
    const { checkLogin } = this.props;
    checkLogin();
  }

  componentDidUpdate() {
    const { user, preferences, loadPreferences, progressDialog } = this.props;
    if (user && !preferences && !progressDialog) {
      loadPreferences();
    }
  }

  onMenuItemClick = (action /* , event */) => {
    if (action === 'logout') {
      const { logout } = this.props;
      logout();
    }
  };

  navigateTo = (moduleId) => {
    const modules = modulesAll.filter(this.isModuleAvailable);
    const navModule = find(modules, (module) => module.id === moduleId);
    if (!navModule) {
      return;
    }

    const { history } = this.props;
    const route = navModule.route || navModule.path;
    if (history.location.pathname !== route) {
      logger.info(`Navigating to ${route}...`);
      history.push(route);
    }
  };

  isModuleAvailable = (module) => {
    const { authenticated, user } = this.props;
    return (
      module &&
      (module.id.startsWith('divider') ||
        (isFunction(module.isAvailable) && module.isAvailable({ authenticated, user })) ||
        false)
    );
  };

  onNavClose = (/* event */) => this.setState({ navOpen: false });

  onNavClick = (/* event */) => {
    const { navOpen } = this.state;
    this.setState({ navOpen: !navOpen });
  };

  onNavModuleClick = (module) => this.navigateTo(module.id);

  render() {
    const { user, progressDialog, classes, stats, location, preferences } = this.props;
    const { navOpen } = this.state;

    const modules = modulesAll.filter(this.isModuleAvailable);
    const title = (
      <>
        {REACT_APP_TITLE} v{REACT_APP_VERSION} <small>{buildDate}</small>
      </>
    );
    const moduleId = 'dashboard';

    const matchChangePassword =
      preferences &&
      matchPath(location.pathname, {
        path: get(preferences, 'security.passwordChange.url', RouteConfig.changePassword),
        exact: true,
      });
    const token = matchChangePassword?.params?.token;

    return (
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={LuxonUtils}>
          <>
            <CssBaseline />
            <div className={classes.root}>
              <Toasts />
              <Header
                logo="resources/images/logo.png"
                title={title}
                user={user}
                onNavClick={this.onNavClick}
                onMenuItemClick={this.onMenuItemClick}
              />
              {user && (
                <Navigation
                  modules={modules}
                  moduleId={moduleId}
                  onModuleClick={this.onNavModuleClick}
                  open={navOpen}
                  onClose={this.onNavClose}
                  stats={stats}
                />
              )}
              {user && preferences && (
                <div className={classes.wrapper}>
                  <div className={classes.toolbar} />
                  <div className={classes.viewport}>
                    <Switch>
                      {modules.map(
                        (module) =>
                          !module.id.startsWith('divider-') && (
                            <Route
                              key={module.id}
                              exact={module.exact !== false}
                              path={module.path}
                              render={(routeProps) => <ViewPort module={module} classes={classes} {...routeProps} />}
                            />
                          ),
                      )}
                      {/*                  <Redirect to={modules[0].path} /> */}
                    </Switch>
                  </div>
                </div>
              )}
              {preferences?.error && (
                <Dialog id="preferencesErrorDialog" className={classes.root} open maxWidth="xs" fullWidth>
                  <DialogTitle id="progressDialogTitle" className={classes.title}>
                    {title}
                  </DialogTitle>
                  <DialogContent id="progressDialogContent" className={classes.message}>
                    <Typography color="inherit" variant="body1">
                      {JSON.stringify(preferences.error)}
                    </Typography>
                  </DialogContent>
                </Dialog>
              )}
              {!user && <LoginDialog token={token} />}
              {progressDialog && <ProgressDialog {...progressDialog} />}
            </div>
          </>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  ...ReactRouterPropTypes.isRequired,
  user: PropTypes.shape({}),
  profile: PropTypes.shape({}),
  progressDialog: PropTypes.shape({}),
  checkLogin: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  loadPreferences: PropTypes.func.isRequired,
  preferences: PropTypes.shape({
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  }),
};

App.defaultProps = {
  user: null,
  profile: null,
  progressDialog: null,
  preferences: null,
};

const mapStateToProps = (state) => ({
  user: AppSelectors.getUser(state),
  profile: AppSelectors.getProfile(state),
  progressDialog: AppSelectors.getProgressDialog(state),
  stats: AppSelectors.getStats(state),
  preferences: AppSelectors.getPreferences(state),
});

const mapDispatchToProps = (dispatch) => ({
  checkLogin: () => dispatch(AppActions.checkLogin()),
  logout: () => dispatch(AppActions.logout()),
  loadPreferences: () => dispatch(AppActions.loadPreferences()),
});

export default withStyles(styles)(withRouter(connect(mapStateToProps, mapDispatchToProps)(App)));
