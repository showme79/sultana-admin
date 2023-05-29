import { Button, Grid } from '@material-ui/core';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { fieldProps } from 'consts';

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
          <Grid className="name" item xs={4}>
            <Field component={TextField} name="name" {...fieldProps} label="Szűrés névre" />
            <Button type="submit" disabled={isSubmitting} color="primary">
              Szűrés
            </Button>
          </Grid>
        </Grid>
      </Form>
    );
  };

  render() {
    const { filter } = this.props;
    return <Formik initialValues={filter} render={this.renderForm} onSubmit={this.onSubmit} />;
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
    priority: false,
  },
};
export default Filter;
