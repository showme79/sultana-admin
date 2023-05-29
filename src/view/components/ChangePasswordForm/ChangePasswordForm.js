import { yupResolver } from '@hookform/resolvers/yup';
import { Button, DialogActions, DialogContent, DialogTitle, Grid, Typography, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import routerPropTypes from 'react-router-prop-types';
import * as yup from 'yup';

import { TextField, useFormSubmit } from 'view/base/fields';

import styles from './ChangePasswordForm.styles';

const useStyles = makeStyles(styles, { name: 'ChangePasswordForm' });

const ChangePasswordForm = ({ classes, email, /* token, */ onSubmit, onBack }) => {
  const resolver = useMemo(
    () =>
      yupResolver(
        yup.object().shape({
          password: yup.string().required('Az új jelszó megadása kötelező!'),
          password2: yup
            .string()
            .required('Az megerősített új jelszó megadása kötelező!')
            .equals([yup.ref('password')], 'A jeszavaknak meg kell egyezniük!'),
        }),
      ),
    [],
  );
  const { disabled, submitting, onFormSubmit, control, errors } = useFormSubmit({
    onSubmit,
    resolver,
    context: { email },
  });
  const cls = useStyles({ classes });

  return (
    <form className={cls.root} onSubmit={onFormSubmit} noValidate>
      <DialogTitle disableTypography className={cls.title}>
        <Typography variant="h6">Jelszó módosítása</Typography>
        <Typography variant="subtitle1">Kérlek add meg az új belépési jelszavat!</Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              control={control}
              errors={errors}
              className="field-password"
              type="password"
              name="password"
              inputProps={{ autoComplete: 'new-password' }}
              label="Új jelszó"
              placeholder="Az új jelszavad..."
              disabled={submitting}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              control={control}
              errors={errors}
              className="field-password"
              type="password"
              name="password2"
              inputProps={{ autoComplete: 'new-password' }}
              label="Új jelszó megerősítése"
              placeholder="Az új jelszavad megerősítése..."
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
          Jelszó módosítása
        </Button>
      </DialogActions>
    </form>
  );
};

ChangePasswordForm.propTypes = {
  ...routerPropTypes,
  email: PropTypes.bool,
  // token: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func,
};

ChangePasswordForm.defaultProps = {
  email: false,
  onBack: undefined,
};

export default ChangePasswordForm;
