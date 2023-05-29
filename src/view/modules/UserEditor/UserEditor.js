import { Grid, withStyles } from '@material-ui/core';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { filter, find, isArray, isString, map, memoize } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Action, Role, UserStatus, fieldProps as defaultFieldProps, emailAuth } from 'consts';
import { UserPropType, UserRightsPropType } from 'consts/prop-types';
import { SaveIcon } from 'icons';
import { RoleText, UserStatusText } from 'lang/hu';
import { mapApiErrorsToFormErrors } from 'utils';
import { SimpleSelect } from 'view/base';
import { ModalEditor } from 'view/components';

import styles from './UserEditor.styles';

/**
 * Calculate role and status list here as it is an app-wide constant (non-dynamic value)
 */
const roles = filter(Role, (role) => isString(role)).map((role) => ({ id: role, name: RoleText[role] }));

const statuses = map(UserStatus, (status) => ({ id: status, name: UserStatusText[status] }));

const validate = (values) => {
  const errors = {};

  if (!values.username) {
    errors.username = 'A mező megadása kötelező!';
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

class UserEditor extends Component {
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
              <Field
                component={TextField}
                name="username"
                label={emailAuth ? 'E-mail cím' : 'Felhasználónév'}
                {...fieldProps}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Field component={TextField} name="profile.lastName" label="Vezetéknév" {...fieldProps} />
            </Grid>

            <Grid item xs={12}>
              <Field component={TextField} name="profile.firstName" label="Keresztnév" {...fieldProps} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field component={SimpleSelect} name="role" label="Jogosultság" items={roles} {...fieldProps} />
            </Grid>

            <Grid item xs={12}>
              <Field component={SimpleSelect} name="status" label="Állapot" items={statuses} {...fieldProps} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderForm = (form) => {
    const { tag, rights } = this.props;
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

    return (
      <ModalEditor
        onSubmit={handleSubmit}
        title={tag && tag.id ? `Tag szerkesztése: ${tag.name}` : 'Új tag'}
        onClose={this.onDialogClose}
        titleActions={actions}
        onActionClick={onActionClick}
        dirty={dirty && 'Ha elnavigálsz, a felhasználón végzet módosítások el fognak veszni! Biztosan folytatod?'}
      >
        {this.renderEditor(form)}
      </ModalEditor>
    );
  };

  render() {
    const { user } = this.props;

    return (
      <Formik
        initialValues={this.getInitialValues(user)}
        validate={validate}
        render={this.renderForm}
        onSubmit={this.onFormSubmit}
      />
    );
  }
}

UserEditor.propTypes = {
  ...ReactRouterPropTypes.isRequired,
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  dialog: PropTypes.bool,
  user: UserPropType,
  submitAction: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  rights: UserRightsPropType.isRequired,
};

UserEditor.defaultProps = {
  dialog: false,
  user: {},
  submitAction: undefined,
};

export default withStyles(styles)(UserEditor);
