import { Button, FormControl, Grid, InputLabel, MenuItem, Select as MuiSelect } from '@material-ui/core';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { map } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { TagStatus, fieldProps } from 'consts';
import { TagStatusText } from 'lang/hu';
import { getSegmentFilterItems } from 'utils';

const segmentItems = getSegmentFilterItems({ all: true, special: false });

const onSegmentClick =
  ({ submitForm, setFieldValue }, segment) =>
  (/* event */) => {
    setFieldValue('segment', segment, false);
    submitForm();
  };

const renderStatus = ({ field }) => {
  const id = `id-${field.name}`;
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={id}>Állapot</InputLabel>
      <MuiSelect {...field} inputProps={{ id, name: field.name }} fullWidth>
        <MenuItem value="ALL">Összes</MenuItem>
        {map(TagStatus, (status) => (
          <MenuItem key={status} value={status}>
            {TagStatusText[status]}
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
    const { values, isSubmitting } = formikProps;
    const { className } = this.props;

    return (
      <Form className={clsx(className)}>
        <Grid container spacing={2}>
          <Grid item xs={6} className="segments">
            {segmentItems.map(({ id, name }) => (
              <Button
                key={id}
                variant={id !== values.segment ? 'text' : 'contained'}
                color="primary"
                size="small"
                onClick={onSegmentClick(formikProps, id)}
              >
                {name}
              </Button>
            ))}
          </Grid>
          <Grid item xs={2}>
            <Field name="status">{renderStatus}</Field>
          </Grid>
          <Grid item xs={3}>
            <Field component={TextField} name="name" {...fieldProps} label="Szűrés névre" />
          </Grid>
          <Grid item xs={1}>
            <Button type="submit" disabled={isSubmitting} color="primary" size="small">
              Szűrés
            </Button>
          </Grid>
        </Grid>
      </Form>
    );
  };

  render() {
    const { filter } = this.props;
    return (
      <Formik initialValues={filter} onSubmit={this.onSubmit}>
        {this.renderForm}
      </Formik>
    );
  }
}

Filter.propTypes = {
  className: PropTypes.string,
  filter: PropTypes.shape({}),
  service: PropTypes.func.isRequired,
};

Filter.defaultProps = {
  className: '',
  filter: {
    segment: segmentItems[0].id,
  },
};

export default Filter;
