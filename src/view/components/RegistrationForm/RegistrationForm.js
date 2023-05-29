import { Button, CardActions, CardContent, DialogTitle, Grid, Typography, withStyles } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { find, isArray } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import routerPropTypes from 'react-router-prop-types';

import { fieldProps } from 'consts';
import { mapApiErrorsToFormErrors } from 'utils';

import styles from './RegistrationForm.styles';

const validate = (values /* , props */) => {
  const { username, password, password2 } = values;

  const errors = {};

  if (!username) {
    errors.username = 'A felhasználónév megadása!';
  }

  if (!password) {
    errors.password = 'A jelszó megadása kötelező!';
  }

  if (!password2) {
    errors.password2 = 'A jelszó megadása kötelező!';
  } else if (password !== password2) {
    errors.password2 = 'A két jelszó nem egyezik meg!';
  }

  return errors;
};

const hasError = (errors) => !!find(errors, (error) => (isArray(error) ? error.length : true));

class RegistrationForm extends PureComponent {
  onFormSubmit = (values, { setSubmitting, setErrors }) => {
    const { username, password } = values;
    const { submitAction } = this.props;
    return submitAction(username, password)
      .then(() => setSubmitting(false))
      .catch(({ response: { data = null } = {} } = {}) => {
        setSubmitting(false);
        setErrors(mapApiErrorsToFormErrors(data));
      });
  };

  renderForm = ({ /* values, */ isSubmitting, errors }) => {
    const { email, classes, onBackClick } = this.props;
    return (
      <Form className={classes.form}>
        <CardContent>
          <DialogTitle disableTypography className={classes.title}>
            <Typography variant="h6">Regisztráció</Typography>
            <Typography variant="subtitle1">Kérlek add meg az új felhasználó adatait!</Typography>
          </DialogTitle>

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Field
                component={TextField}
                type="text"
                name="username"
                className="field-username"
                label={email ? 'E-mail' : 'Felhasználónév'}
                placeholder={email ? 'E-mail címed...' : 'Felhasználói neved...'}
                {...fieldProps}
              />
            </Grid>

            <Grid item xs={6}>
              <Field
                component={TextField}
                type="password"
                name="password"
                className="field-password"
                label="Jelszó"
                placeholder="Jelszó..."
                {...fieldProps}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                component={TextField}
                type="password"
                name="password2"
                className="field-password"
                label="Jelszó megerősítése"
                placeholder="Jelszó megerősítése..."
                {...fieldProps}
              />
            </Grid>
          </Grid>
        </CardContent>

        <CardActions className={classes.actions}>
          {onBackClick && (
            <Button type="button" className={classes.backButton} onClick={onBackClick}>
              Vissza
            </Button>
          )}
          <Button
            type="submit"
            className={classes.registerButton}
            color="primary"
            disabled={isSubmitting || hasError(errors)}
          >
            Regisztráció
          </Button>
        </CardActions>
      </Form>
    );
  };

  render() {
    const { username, password } = this.props;
    return (
      <Formik
        initialValues={{ username, password, password2: '' }}
        validate={validate}
        render={this.renderForm}
        onSubmit={this.onFormSubmit}
      />
    );
  }
}

RegistrationForm.propTypes = {
  ...routerPropTypes,
  email: PropTypes.bool,
  username: PropTypes.string,
  password: PropTypes.string,
  submitAction: PropTypes.func.isRequired,
  onBackClick: PropTypes.func,
};

RegistrationForm.defaultProps = {
  email: false,
  username: '',
  password: '',
  onBackClick: undefined,
};

export default withStyles(styles)(RegistrationForm);
