import { Snackbar, withStyles } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ToastsActions } from 'state/actions';
import { ToastsSelectors } from 'state/selectors';

import Toast from './Toast';
import styles from './Toasts.styles';

class Toasts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      snackOpen: true,
    };
  }

  onSnackClose = (/* event, reason */) => {
    this.setState({ snackOpen: false });
  };

  onSnackExited = () => {
    this.setState({ snackOpen: true });
    const { processMessage } = this.props;
    processMessage();
  };

  render() {
    const { messages, classes, className } = this.props;
    const { snackOpen } = this.state;
    const message = messages[0];

    return (
      !!message && (
        <Snackbar
          className={clsx(classes.toasts, className)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={snackOpen}
          autoHideDuration={4000}
          onClose={this.onSnackClose}
          TransitionProps={{
            onExited: this.onSnackExited,
          }}
        >
          <Toast className="toast-message" message={message} onClose={this.onSnackClose} />
        </Snackbar>
      )
    );
  }
}

Toasts.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  className: PropTypes.string,
  processMessage: PropTypes.func.isRequired,
  messages: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

Toasts.defaultProps = {
  className: '',
};

const mapStateToProps = (state) => ({
  messages: ToastsSelectors.getToastMessages(state),
});

const mapDispatchToProps = (dispatch) => ({
  processMessage: () => dispatch(ToastsActions.processMessage()),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Toasts));
