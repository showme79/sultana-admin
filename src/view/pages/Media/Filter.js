import { Button, FormControl, Grid, InputLabel, MenuItem, Select as MuiSelect } from '@material-ui/core';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { map } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { MediaType, fieldProps } from 'consts';
import { MediaTypeText } from 'lang/hu';

const renderType =
  () =>
  // eslint-disable-next-line react/prop-types
  ({ field }) => {
    // eslint-disable-next-line react/prop-types
    const id = `id-${field.name}`;
    return (
      <FormControl fullWidth>
        <InputLabel htmlFor={id}>Típus</InputLabel>
        {/* eslint-disable-next-line react/prop-types */}
        <MuiSelect {...field} inputProps={{ id, name: field.name }} fullWidth>
          <MenuItem value="ALL">Összes</MenuItem>
          {map(MediaType, (mediaType) => (
            <MenuItem key={mediaType} value={mediaType}>
              {MediaTypeText[mediaType]}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    );
  };

class Filter extends Component {
  onSubmit = (values, { setSubmitting }) => {
    const { service } = this.props;

    return service(values)
      .then(() => setSubmitting(false))
      .catch(() => setSubmitting(false));
  };

  renderForm = (formikProps) => {
    const { isSubmitting } = formikProps;
    const { className } = this.props;

    return (
      <Form className={clsx(className)}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Field render={renderType()} name="type" />
          </Grid>
          <Grid item xs={9}>
            <Field component={TextField} name="search" {...fieldProps} label="Keresés (cím, leírás szerint)" />
          </Grid>
          <Grid item xs={1}>
            <Button type="submit" disabled={isSubmitting} color="primary">
              Szűrés
            </Button>
          </Grid>
        </Grid>
      </Form>
    );
  };

  render() {
    const { filter, search } = this.props;
    return <Formik initialValues={{ ...filter, search }} render={this.renderForm} onSubmit={this.onSubmit} />;
  }
}

Filter.propTypes = {
  className: PropTypes.string,
  filter: PropTypes.shape({}).isRequired,
  search: PropTypes.string.isRequired,
  service: PropTypes.func.isRequired,
};

Filter.defaultProps = {
  className: '',
};

export default Filter;
