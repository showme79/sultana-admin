import { yupResolver } from '@hookform/resolvers/yup';
import { Button, DialogActions, DialogContent, Grid, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import routerPropTypes from 'react-router-prop-types';
import * as yup from 'yup';

import { TextField, useFormSubmit } from 'view/base/fields';

import styles from './AddSubscriptionTypeForm.styles';

const useStyles = makeStyles(styles, { name: 'AddSubscriptionTypeForm' });

const AddSubscriptionTypeForm = ({ classes, title, onSubmit }) => {
  const resolver = useMemo(
    () =>
      yupResolver(
        yup.object().shape({
          title: yup.string().required('A listatípus címének megadása kötelező!'),
        }),
      ),
    [],
  );
  const { disabled, submitting, onFormSubmit, control, errors } = useFormSubmit({
    onSubmit,
    defaultValues: { title },
    resolver,
  });
  const cls = useStyles({ classes });

  return (
    <form className={cls.root} onSubmit={onFormSubmit} noValidate>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              control={control}
              errors={errors}
              className="field-title"
              type="text"
              name="title"
              label="Típus címe"
              placeholder="Az új típus címe"
              disabled={submitting}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="submit" className="login-btn" color="primary" variant="contained" disabled={disabled}>
          Hozzáadás
        </Button>
      </DialogActions>
    </form>
  );
};

AddSubscriptionTypeForm.propTypes = {
  ...routerPropTypes,
  title: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

AddSubscriptionTypeForm.defaultProps = {
  title: '',
};

export default AddSubscriptionTypeForm;
