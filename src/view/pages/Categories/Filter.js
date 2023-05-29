import { Button, CardContent, Grid } from '@material-ui/core';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { map } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { CategoryStatus, fieldProps } from 'consts';
import { CategoryStatusText } from 'lang/hu';
import { getSegmentFilterItems } from 'utils';
import { SimpleSelect } from 'view/base';

const segmentItems = getSegmentFilterItems({ all: true, special: false });
const statusItems = [
  { id: 'ALL', name: 'Összes' },
  ...map(CategoryStatus, (status) => ({ id: status, name: CategoryStatusText[status] })),
];

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
      <CardContent>
        <Form className={clsx(className)}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Field
                component={SimpleSelect}
                name="segment"
                label="Fülek (szegmens)"
                items={segmentItems}
                {...fieldProps}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={3}>
              <Field
                component={SimpleSelect}
                name="status"
                label="Állapot"
                items={statusItems}
                {...fieldProps}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid container item xs={6} alignItems="center" wrap="nowrap">
              <Field component={TextField} name="name" {...fieldProps} label="Szűrés névre" />
              <Button type="submit" size="small" disabled={isSubmitting} color="primary">
                Szűrés
              </Button>
            </Grid>
          </Grid>
        </Form>
      </CardContent>
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
    status: statusItems[0].id,
    segment: segmentItems[0].id,
  },
};

export default Filter;
