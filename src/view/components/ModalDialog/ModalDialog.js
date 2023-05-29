import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
  withStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import { isString } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { ChildrenPropType } from 'consts/prop-types';
import { CloseIcon } from 'icons';
import { Modal } from 'view/base';

import styles from './ModalDialog.styles';

class ModalDialog extends Component {
  onAction = (action) => (event) => {
    const { onAction } = this.props;
    return onAction?.(action, event);
  };

  render() {
    const { className, classes, actions, title, content, children, onClose } = this.props;

    return (
      <Modal>
        <Paper className={clsx(classes.root, className)} square>
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
          {actions && (
            <DialogActions className={classes.actions}>
              {actions.map((action) => (
                <Button key={action.id} color={action.color || 'primary'} onClick={this.onAction(action)}>
                  {action.text}
                </Button>
              ))}
            </DialogActions>
          )}
        </Paper>
      </Modal>
    );
  }
}

ModalDialog.propTypes = {
  children: ChildrenPropType,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  content: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  actions: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  onClose: PropTypes.func,
  onAction: PropTypes.func,
};

ModalDialog.defaultProps = {
  children: undefined,
  className: undefined,
  title: undefined,
  content: undefined,
  actions: null,
  onClose: undefined,
  onAction: undefined,
};

export default withStyles(styles)(ModalDialog);
