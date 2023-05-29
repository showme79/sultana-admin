import { yupResolver } from '@hookform/resolvers/yup';
import { Button, DialogActions, DialogContent, DialogTitle, Grid, Typography, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import routerPropTypes from 'react-router-prop-types';
import * as yup from 'yup';

import { TextField, useFormSubmit } from 'view/base/fields';

import styles from './LoginForm.styles';

const useStyles = makeStyles(styles, { name: 'LoginForm' });

const LoginForm = ({ classes, email, username, password, onRegistrationClick, onResetPasswordClick, onSubmit }) => {
  const resolver = useMemo(
    () =>
      yupResolver(
        yup.object().shape({
          username:
            (email &&
              yup.string().required('Az e-mail cím megadása kötelező!').email('Nem megefelelő e-mail formátum!')) ||
            yup.string().required('A felhasználónév megadása kötelező!'),
          password: yup.string().required('A bejelentkezéshez kötelező jelszót megadni!'),
        }),
      ),
    [email],
  );

  const { disabled, submitting, onFormSubmit, control } = useFormSubmit({
    onSubmit,
    resolver,
    context: { email },
    defaultValue: {
      username,
      password,
    },
  });
  const cls = useStyles({ classes });

  return (
    <form className={cls.root} onSubmit={onFormSubmit} noValidate>
      <DialogTitle disableTypography className={cls.title}>
        <Typography variant="h6">Bejelentkezés</Typography>
        <Typography variant="subtitle1">
          Kérlek jelentkezz be az {email ? 'e-mail címeddel' : 'felhasználó neveddel'}!
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              control={control}
              className="field-username"
              type="text"
              name="username"
              inputProps={{ autoComplete: 'username' }}
              label={email ? 'E-mail' : 'Felhasználónév'}
              placeholder={email ? 'E-mail címed...' : 'Felhasználói neved...'}
              disabled={submitting}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              control={control}
              className="field-password"
              type="password"
              name="password"
              inputProps={{ autoComplete: 'current-password' }}
              label="Jelszó"
              placeholder="Belépéshez szükséges jelszavad..."
              disabled={submitting}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={cls.actions}>
        {onResetPasswordClick && (
          <Button
            type="button"
            className="reset-password-btn"
            color="primary"
            onClick={onResetPasswordClick}
            disabled={submitting}
          >
            Elfelejtett jelszó
          </Button>
        )}
        {onRegistrationClick && (
          <Button
            type="button"
            className="register-btn"
            onClick={onRegistrationClick}
            color="primary"
            disabled={disabled}
          >
            Fiók létrehozása
          </Button>
        )}
        <Button type="submit" className="login-btn" color="primary" variant="contained" disabled={disabled}>
          Bejelentkezés
        </Button>
      </DialogActions>
    </form>
  );
};

LoginForm.propTypes = {
  ...routerPropTypes,
  email: PropTypes.bool,
  username: PropTypes.string,
  password: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onRegistrationClick: PropTypes.func,
  onResetPasswordClick: PropTypes.func,
};

LoginForm.defaultProps = {
  email: false,
  username: '',
  password: '',
  onRegistrationClick: undefined,
  onResetPasswordClick: undefined,
};

export default LoginForm;
