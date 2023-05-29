import { CircularProgress, Dialog, DialogContent, DialogTitle, Typography, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import styles from './ProgressDialog.styles';

class ProgressDialog extends PureComponent {
  render() {
    const { classes, visible, title, message, progress } = this.props;

    return (
      <Dialog id="progressDialog" className={classes.root} open={visible} maxWidth="xs" fullWidth>
        <DialogTitle id="progressDialogTitle" className={classes.title}>
          {title}
        </DialogTitle>
        <DialogContent id="progressDialogContent" className={classes.progress}>
          <CircularProgress
            id="progressDialogCircularProgress"
            className="dialog-progress"
            mode={progress === null ? 'indeterminate' : 'determinate'}
            value={progress}
          />
        </DialogContent>
        <DialogContent id="progressDialogContent" className={classes.message}>
          <Typography color="inherit" variant="body1">
            {message}
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }
}

ProgressDialog.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    title: PropTypes.string,
    progress: PropTypes.string,
    message: PropTypes.string,
  }).isRequired,
  visible: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  progress: PropTypes.number,
};

ProgressDialog.defaultProps = {
  visible: true,
  title: 'Information',
  message: 'Please wait...',
  progress: null,
};

export default withStyles(styles)(ProgressDialog);
