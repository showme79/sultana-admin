import { Button, IconButton, Tooltip, withStyles } from '@material-ui/core';
import clsx from 'clsx';
import { isArray } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { ActionsPropType } from 'consts/prop-types';
import { evalFnValue } from 'utils';

import styles from './ExActions.styles';

/**
 * Components handles action buttons conditionally with tooltip.
 * It accepts an `actions` array, object or node.
 * It checks if an action is visible or having a tooptip or not and renders the action button depending on the results.
 *
 * TODO: introduce a `collapse` (bool or number) variable and a three-dot menu is rendered depending on its value and how many actions actually visible.
 */
class ExActions extends Component {
  onActionClick = (action, context) => (event) => {
    const { onActionClick } = this.props;
    onActionClick?.(action, context, event);
  };

  renderAction = (action, context) => {
    const { classes } = this.props;
    const { id, tooltip, icon, visible, disabled, text, color, submit } = action;

    if (!evalFnValue(visible, context, action, this.props)) {
      return '';
    }

    const isDisabled = evalFnValue(disabled, context, action, this.props);
    const tooltipText = evalFnValue(tooltip, context, action, this.props);
    const buttonText = evalFnValue(text, context, action, this.props);
    const buttonIcon = evalFnValue(icon, context, action, this.props); // isFunction(icon) ? icon(action, context, this.props) : icon;
    const type = submit ? 'submit' : 'button';

    const button = text ? (
      <Button
        key={id}
        type={type}
        color={color}
        className={clsx(classes.button)}
        disabled={isDisabled}
        onClick={this.onActionClick(action, context)}
      >
        {buttonIcon}
        <span className={clsx(classes.buttonText)}>{buttonText}</span>
      </Button>
    ) : (
      <IconButton
        key={id}
        type={type}
        color={color}
        className={clsx(classes.iconButton)}
        disabled={isDisabled}
        size="small"
        onClick={this.onActionClick(action, context)}
      >
        {buttonIcon}
      </IconButton>
    );

    return tooltipText ? (
      <Tooltip key={id} className={clsx(classes.tooltip)} title={tooltipText}>
        {button}
      </Tooltip>
    ) : (
      button
    );
  };

  render() {
    const { actions, context } = this.props;

    if (React.isValidElement(actions)) {
      return actions;
    }

    return <>{(isArray(actions) ? actions : [actions]).map((action) => this.renderAction(action, context))}</>;
  }
}

ExActions.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  actions: ActionsPropType,
  onActionClick: PropTypes.func.isRequired,
  context: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

ExActions.defaultProps = {
  actions: [],
  context: undefined,
};

export default withStyles(styles)(ExActions);
