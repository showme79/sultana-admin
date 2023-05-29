import { IconButton, SnackbarContent, withStyles } from '@material-ui/core';
import clsx from 'clsx';
import { replace, values } from 'lodash-es';
import PropTypes from 'prop-types';
import React from 'react';

import { MsgType } from 'consts';
import { CheckCircleIcon, CloseIcon, ErrorIcon, InfoIcon, WarningIcon } from 'icons';
import { ToastMessages } from 'lang/hu';

import styles from './Toast.styles';

const IconType = {
  [MsgType.SUCCESS]: CheckCircleIcon,
  [MsgType.WARNING]: WarningIcon,
  [MsgType.ERROR]: ErrorIcon,
  [MsgType.INFO]: InfoIcon,
};

const convertMessage = ({ text, name, params }) =>
  replace(ToastMessages[name] || text, /{(.+)}/, (replacement) => params[replacement[1]] || replacement[0]);

const Toast = ({ classes, className, message, message: { type }, onClose, ...props }) => {
  const Icon = IconType[type];

  const text = convertMessage(message);

  return (
    <SnackbarContent
      className={clsx(classes[type], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          {Icon && <Icon className={clsx(classes.icon, classes.iconType)} />}
          {text}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="Close" color="inherit" className={classes.close} onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...props}
    />
  );
};

Toast.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  className: PropTypes.string,
  onClose: PropTypes.func,
  message: PropTypes.shape({
    name: PropTypes.string,
    text: PropTypes.string,
    params: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired),
    type: PropTypes.oneOf(values(MsgType)).isRequired,
  }).isRequired,
};

Toast.defaultProps = {
  className: '',
  onClose: null,
};

export default withStyles(styles)(Toast);
