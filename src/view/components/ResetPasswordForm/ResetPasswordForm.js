import { yupResolver } from '@hookform/resolvers/yup';
import { Button, DialogActions, DialogContent, DialogTitle, Grid, Typography, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import routerPropTypes from 'react-router-prop-types';
import * as yup from 'yup';

import { TextField, useFormSubmit } from 'view/base/fields';

import styles from './ResetPasswordForm.styles';

const useStyles = makeStyles(styles, { name: 'ResetPasswordForm' });

const ResetPasswordForm = ({ classes, username, email, onBack, onSubmit }) => {
  const resolver = useMemo(
    () =>
      yupResolver(
        yup.object().shape({
          username:
            (email &&
              yup.string().required('Az e-mail cím megadása kötelező!').email('Nem megefelelő e-mail formátum!')) ||
            yup.string().required('A felhasználónév megadása kötelező!'),
        }),
      ),
    [email],
  );
  const { disabled, submitting, onFormSubmit, control } = useFormSubmit({
    onSubmit,
    resolver,
    context: { email },
    defaultValue: { username },
  });

  const cls = useStyles({ classes });
  return (
    <form className={cls.root} onSubmit={onFormSubmit} noValidate>
      <DialogTitle disableTypog raphy className={cls.title}>
        <Typography variant="h6">Elfelejtett jelszó</Typography>
        <Typography variant="subtitle1">
          A jelszó visszaállításhoz, kérlek add meg a {email ? 'e-mail címed' : 'felhasználó neved'}!
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
              label={email ? 'E-mail' : 'Felhasználónév'}
              placeholder={email ? 'E-mail címed...' : 'Felhasználói neved...'}
              disabled={submitting}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={cls.actions}>
        {onBack && (
          <Button type="button" className="back-btn" onClick={onBack} disabled={submitting}>
            Vissza
          </Button>
        )}
        <Button type="submit" className="submit-btn" color="primary" variant="contained" disabled={disabled}>
          Jelszó helyreállítása
        </Button>
      </DialogActions>
    </form>
  );
};

ResetPasswordForm.propTypes = {
  ...routerPropTypes,
  email: PropTypes.bool,
  username: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func,
};

ResetPasswordForm.defaultProps = {
  email: false,
  username: '',
  onBack: undefined,
};

export default ResetPasswordForm;
