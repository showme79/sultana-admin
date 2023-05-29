import { CardMedia, Dialog, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { allowGuestRegistration, emailAuth } from 'consts';
import Logo from 'resources/app-logo.png';
import services from 'services';
import { AppActions } from 'state';
import { ChangePasswordForm, LoginForm, RegistrationForm, ResetPasswordForm } from 'view/components';

import styles from './LoginDialog.styles';

export const Form = {
  LOGIN: 'LOGIN',
  REGISTRATION: 'REGISTRATION',
  RESET_PASSWORD: 'RESET_PASSWORD',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
};

const useStyles = makeStyles(styles, { name: 'LoginDialog' });

const LoginDialog = ({ classes, token, ...props }) => {
  const [form, setForm] = useState(token ? Form.CHANGE_PASSWORD : Form.LOGIN);
  const cls = useStyles({ classes });
  const dispatch = useDispatch();

  const onLogin = useCallback(({ username, password }) => dispatch(AppActions.login(username, password)), [dispatch]);

  const onRegistration = useCallback(
    ({ username, password }) => dispatch(AppActions.registration(username, password)).then(() => setForm(Form.LOGIN)),
    [dispatch],
  );

  const history = useHistory();
  const onResetPassword = useCallback(
    ({ username }) =>
      services.resetPassword({ username }).then(() => {
        setForm(Form.LOGIN);
        history.replace('/');
      }),
    [history],
  );

  const onChangePassword = useCallback(
    ({ password }) =>
      services.changePassword({ token, password }).then(() => {
        setForm(Form.LOGIN);
        history.replace('/');
      }),
    [history, token],
  );

  const onResetPasswordClick = useCallback((/* event */) => setForm(Form.RESET_PASSWORD), []);
  const onRegistrationClick = useCallback((/* event */) => setForm(Form.REGISTRATION), []);
  const onBack = useCallback(
    (/* event */) => {
      setForm(Form.LOGIN);
      history.replace('/');
    },
    [history],
  );

  return (
    <Dialog className={cls.root} fullWidth open {...props}>
      <CardMedia className={cls.logo} image={Logo} title="Bejelentkezés" />
      {form === Form.LOGIN && (
        <LoginForm
          email={emailAuth}
          onSubmit={onLogin}
          onRegistrationClick={(allowGuestRegistration && onRegistrationClick) || undefined}
          onResetPasswordClick={onResetPasswordClick}
        />
      )}
      {form === Form.REGISTRATION && <RegistrationForm email={emailAuth} onSubmit={onRegistration} onBack={onBack} />}
      {form === Form.RESET_PASSWORD && (
        <ResetPasswordForm email={emailAuth} onSubmit={onResetPassword} onBack={onBack} />
      )}
      {form === Form.CHANGE_PASSWORD && (
        <ChangePasswordForm email={emailAuth} token={token} onSubmit={onChangePassword} onBack={onBack} />
      )}
    </Dialog>
  );
};

LoginDialog.propTypes = {
  classes: PropTypes.shape({}),
  token: PropTypes.string,
};

LoginDialog.defaultProps = {
  classes: {},
  token: '',
};

export default LoginDialog;
