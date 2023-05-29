import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { TextField, useFormSubmit } from 'view/base/fields';

const PreferenceDialog = ({ classes, preference, onClose, onSubmit, ...props }) => {
  const onBack = useCallback((event) => onClose && onClose(event), [onClose]);

  const { disabled, onFormSubmit, control, errors } = useFormSubmit({
    defaultValues: preference,
    onSubmit,
  });

  return (
    <Dialog fullWidth open onClose={onClose} {...props}>
      <form onSubmit={onFormSubmit} noValidate>
        <DialogTitle disableTypography>
          <Typography variant="h6">Rendszerbeállítás módosítása</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                control={control}
                errors={errors}
                type="text"
                name="name"
                label="Név"
                disabled
                fullWidth
                defaultValue={preference?.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                control={control}
                errors={errors}
                type="text"
                name="value"
                label="Érték"
                placeholder="Belépéshez szükséges jelszavad..."
                disabled={disabled}
                fullWidth
                defaultValue={preference?.value}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button type="button" className="register-btn" onClick={onBack} color="primary" disabled={disabled}>
            Vissza
          </Button>
          <Button type="submit" className="login-btn" color="primary" variant="contained" disabled={disabled}>
            Mentés
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

PreferenceDialog.propTypes = {
  classes: PropTypes.shape({}),
  preference: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
  }),
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

PreferenceDialog.defaultProps = {
  classes: {},
  preference: null,
  onClose: undefined,
  onSubmit: undefined,
};

export default PreferenceDialog;
