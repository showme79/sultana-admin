import {
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
  withStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import { isFunction, isString } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Prompt, withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { ActionsPropType, ChildrenPropType } from 'consts/prop-types';
import { KeyboardBackspaceIcon } from 'icons';
import ExActions from 'view/base/ExActions/ExActions';
import Modal from 'view/base/Modal/Modal';

import styles from './ModalEditor.styles';

class ModalEditor extends Component {
  renderModalContent = () => {
    const {
      className,
      classes,
      title,
      content,
      children,
      onClose,
      actionContext,
      actions,
      titleActions,
      onActionClick,
    } = this.props;

    const actionClasses = {
      button: clsx(classes.actionButton),
      buttonText: clsx(classes.actionButtonText),
      iconButton: clsx(classes.actionIconButton),
      tooltip: clsx(classes.actionTooltip),
    };
    const titleActionClasses = {
      button: clsx(classes.actionButton, classes.titleActionButton),
      buttonText: clsx(classes.actionButtonText, classes.titleActionButtonText),
      iconButton: clsx(classes.actionIconButton, classes.titleActionIconButton),
      tooltip: clsx(classes.actionTooltip, classes.titleActionTooltip),
    };

    return (
      <Paper className={clsx(classes.root, className)} square>
        {title && (
          <DialogTitle id="dialog-title" className={classes.dialogTitle} disableTypography>
            {onClose && (
              <IconButton aria-label="Bezárás" className={classes.closeButton} onClick={onClose}>
                <KeyboardBackspaceIcon />
              </IconButton>
            )}
            <div className={classes.titleText}>
              {isString(title) ? <Typography variant="h6">{title}</Typography> : title}
            </div>
            {titleActions && (
              <ExActions
                classes={titleActionClasses}
                actions={titleActions}
                context={actionContext}
                onActionClick={onActionClick}
              />
            )}
          </DialogTitle>
        )}
        <DialogContent className={classes.dialogContent}>
          {isString(content) ? <Typography variant="body1">{content}</Typography> : content}
          {children}
        </DialogContent>
        {actions && (
          <DialogActions className={classes.dialogActions}>
            <ExActions
              classes={actionClasses}
              actions={actions}
              context={actionContext}
              onActionClick={onActionClick}
            />
          </DialogActions>
        )}
      </Paper>
    );
  };

  getDitryMessage = (/* location */) => {
    const { dirty } = this.props;
    return dirty || '';
  };

  render() {
    const { onSubmit, dirty } = this.props;

    const modalContent = this.renderModalContent();
    const dirtyMessage = (isFunction(dirty) && dirty) || (isString(dirty) && this.getDitryMessage) || '';
    return (
      <Modal>
        <Prompt when={!!dirtyMessage} message={dirtyMessage} />
        <form onSubmit={onSubmit}>{modalContent}</form>
      </Modal>
    );
  }
}

ModalEditor.propTypes = {
  ...ReactRouterPropTypes.isRequired,
  children: ChildrenPropType,
  className: PropTypes.string,
  classes: PropTypes.shape({}),
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  content: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  actions: ActionsPropType,
  titleActions: ActionsPropType,
  onClose: PropTypes.func,
  onActionClick: PropTypes.func,
  onSubmit: PropTypes.func,
  dirty: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.bool]),
  actionContext: PropTypes.shape({}),
};

ModalEditor.defaultProps = {
  children: undefined,
  className: undefined,
  classes: {},
  title: undefined,
  content: undefined,
  actions: undefined,
  titleActions: undefined,
  onClose: undefined,
  onActionClick: undefined,
  onSubmit: undefined,
  actionContext: undefined,
  dirty: undefined,
};

export default withStyles(styles)(withRouter(ModalEditor));
