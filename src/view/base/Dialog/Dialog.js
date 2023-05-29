import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Dialog as MuiDialog,
  Typography,
  withStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import { isArray, isFunction, isString } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { ChildrenPropType } from 'consts/prop-types';
import { CloseIcon } from 'icons';

import styles from './Dialog.styles';

class Dialog extends Component {
  onAction = (action) => (event) => {
    const { onAction } = this.props;
    return onAction?.(action, event);
  };

  render() {
    const { className, classes, actions, onAction, title, content, children, ...muiDialogProps } = this.props;
    const { onClose } = muiDialogProps;
    const { paper } = classes;

    return (
      <MuiDialog
        className={clsx(classes.root, className)}
        classes={{ paper }}
        aria-labelledby="customized-dialog-title"
        {...muiDialogProps}
      >
        {title && (
          <DialogTitle id="dialog-title" className={classes.title} disableTypography>
            {isString(title) ? <Typography variant="h6">{title}</Typography> : title}
            {onClose && (
              <IconButton aria-label="Bezárás" className={classes.closeButton} onClick={onClose}>
                <CloseIcon />
              </IconButton>
            )}
          </DialogTitle>
        )}
        {content && (
          <DialogContent className={classes.content}>
            {isString(content) ? <Typography variant="body1">{content}</Typography> : content}
          </DialogContent>
        )}
        {children}
        {actions && isArray(actions) && (
          <DialogActions className={classes.actions}>
            {actions
              .filter(({ visible }) => visible !== false)
              .map(({ visible, ...action }) => {
                const { id, component, color, icon: Icon, text, ...buttonProps } = action;
                return component ? (
                  <React.Fragment key={id}>{component}</React.Fragment>
                ) : (
                  <Button key={id} color={color || 'primary'} onClick={this.onAction(action)} {...buttonProps}>
                    {Icon && <Icon />}
                    <span className={clsx(classes.actionText)}>{text}</span>
                  </Button>
                );
              })}
          </DialogActions>
        )}
        {isFunction(actions) && actions}
      </MuiDialog>
    );
  }
}

Dialog.propTypes = {
  children: ChildrenPropType,
  className: PropTypes.string,
  classes: PropTypes.shape({
    paper: PropTypes.string,
    root: PropTypes.string,
    title: PropTypes.string,
    closeButton: PropTypes.string,
    content: PropTypes.string,
    actions: PropTypes.string,
    actionText: PropTypes.string,
  }),
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  content: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  actions: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.shape({}))]),
  onClose: PropTypes.func,
  onAction: PropTypes.func,
};

Dialog.defaultProps = {
  classes: {},
  children: undefined,
  className: undefined,
  title: undefined,
  content: undefined,
  actions: null,
  onClose: undefined,
  onAction: undefined,
};

export default withStyles(styles)(Dialog);
