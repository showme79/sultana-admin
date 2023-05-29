import { Grid, Typography, withStyles } from '@material-ui/core';
import { validateEmail } from '@showme79/sultana-common';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { find, isArray, map, memoize } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Action, SubscriptionStatus, fieldProps as defaultFieldProps } from 'consts';
import { SubscriptionPropType, SubscriptionRightsPropType } from 'consts/prop-types';
import { SaveIcon } from 'icons';
import { SubscriptionStatusText } from 'lang/hu';
import { mapApiErrorsToFormErrors } from 'utils';
import { SimpleSelect } from 'view/base';
import { ModalEditor } from 'view/components';

import styles from './SubscriptionEditor.styles';

const validate = (values) => {
  const errors = {};

  const { email } = values;

  if (!email) {
    errors.email = 'A mező megadása kötelező!';
  } else if (!validateEmail(email)) {
    errors.email = 'Nem megfelelő e-mail címet adtál meg!';
  }

  return errors;
};

const hasError = (errors) => !!find(errors, (error) => (isArray(error) ? error.length : true));

const onActionClick = (action /* , context, event */) => {
  if (action.id === Action.SUBMIT) {
    return action.submit();
  }
  return undefined;
};

/**
 * Calculate role and status list here as it is an app-wide constant (non-dynamic value)
 */
const statuses = map(SubscriptionStatus, (status) => ({ id: status, name: SubscriptionStatusText[status] }));

class SubscriptionEditor extends Component {
  getInitialValues = memoize(({ username, profile, ...userProps }) => ({
    ...userProps,
    username: username || '',
    profile: {
      firstName: (profile && profile.firstName) || '',
      lastName: (profile && profile.lastName) || '',
    },
  }));

  onDialogClose = (event) => {
    const { onClose } = this.props;
    return onClose?.(event);
  };

  onFormSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
    const { submitAction, onClose } = this.props;
    submitAction(values)
      .then((/* { data: { result: savedUser } = undefined } = {} */) => {
        resetForm();

        return onClose && onClose();
      })
      .catch(({ response: { data = null } = {} } = {}) => {
        setSubmitting(false);
        setErrors(mapApiErrorsToFormErrors(data));
      });
  };

  renderEditor = (form) => {
    const { rights } = this.props;
    const { isSubmitting } = form;

    const fieldProps = {
      ...defaultFieldProps,
      disabled: (!rights.EDIT && !rights.CREATE) || isSubmitting,
    };

    return (
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field component={TextField} name="email" label="E-mail cím" {...fieldProps} required />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field component={SimpleSelect} name="status" label="Állapot" items={statuses} {...fieldProps} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderForm = (form) => {
    const { subscription, rights } = this.props;
    const { isSubmitting, errors, handleSubmit, dirty } = form;

    const actions = {
      id: Action.SUBMIT,
      visible: true,
      disabled: (!rights.EDIT && !rights.CREATE) || isSubmitting || hasError(errors),
      icon: <SaveIcon />,
      text: 'Mentés',
      color: 'secondary',
      submit: handleSubmit,
    };

    const title = subscription && subscription.id && (
      <>
        <Typography variant="h6">Feliratkozó szerkesztése: {subscription.email}</Typography>
        <Typography variant="subtitle1">Azonosító: {subscription.id}</Typography>
      </>
    );

    return (
      <ModalEditor
        onSubmit={handleSubmit}
        title={title || 'Új feliratkozó'}
        onClose={this.onDialogClose}
        titleActions={actions}
        onActionClick={onActionClick}
        dirty={dirty && 'Ha elnavigálsz, a feliratkozáson végzet módosítások el fognak veszni! Biztosan folytatod?'}
      >
        {this.renderEditor(form)}
      </ModalEditor>
    );
  };

  render() {
    const { subscription } = this.props;

    return (
      <Formik
        initialValues={this.getInitialValues(subscription)}
        validate={validate}
        render={this.renderForm}
        onSubmit={this.onFormSubmit}
      />
    );
  }
}

SubscriptionEditor.propTypes = {
  ...ReactRouterPropTypes.isRequired,
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  dialog: PropTypes.bool,
  subscription: SubscriptionPropType,
  submitAction: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  rights: SubscriptionRightsPropType.isRequired,
};

SubscriptionEditor.defaultProps = {
  dialog: false,
  subscription: {},
  submitAction: undefined,
};

export default withStyles(styles)(SubscriptionEditor);
