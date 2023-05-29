import { Button, Grid } from '@material-ui/core';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { map } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { PostStatus, Segment, fieldProps } from 'consts';
import { PostStatusText } from 'lang/hu';
import { getSegmentFilterItems } from 'utils';
import { CheckboxField } from 'view/base';

const segmentItems = getSegmentFilterItems({ all: true, special: true });

const statusItems = [
  { id: 'ALL', name: 'Összes állapot' },
  ...map(PostStatus, (status) => ({ id: status, name: PostStatusText[status] })),
];
const onStatusClick =
  ({ submitForm, setFieldValue }, status) =>
  (/* event */) => {
    setFieldValue('status', status, false);
    submitForm();
  };

const onSegmentClick =
  ({ submitForm, setFieldValue }, segment) =>
  (/* event */) => {
    setFieldValue('segment', segment, false);
    submitForm();
  };

const onPriorityChange =
  ({ submitForm }) =>
  () => {
    setTimeout(() => submitForm(), 1);
  };

class Filter extends Component {
  onSubmit = (values, { setSubmitting }) => {
    const { service } = this.props;
    return service(values)
      .then(() => setSubmitting(false))
      .catch(() => setSubmitting(false));
  };

  renderFilterForm = (formikProps) => {
    const { values, isSubmitting } = formikProps;
    const { className } = this.props;

    return (
      <Form className={clsx(className)}>
        <Grid container spacing={2}>
          <Grid container item xs={12} alignItems="center" wrap="nowrap">
            {statusItems.map(({ id, name }) => (
              <Button
                key={id}
                variant={id !== values.status ? 'text' : 'contained'}
                color="primary"
                size="small"
                onClick={onStatusClick(formikProps, id)}
              >
                {name}
              </Button>
            ))}
            <Field
              className="priority-field"
              type="checkbox"
              component={CheckboxField}
              name="priority"
              label="Csak a kiemeltek"
              {...fieldProps}
              disabled={isSubmitting}
              fullWidth={false}
              onChange={onPriorityChange(formikProps)}
            />
          </Grid>
          <Grid item xs={8} className="segments">
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
          <Grid item container xs={4} alignItems="center" wrap="nowrap">
            <Field component={TextField} name="search" label="Szöveg" {...fieldProps} />
            <Button type="submit" disabled={isSubmitting} color="primary" size="small">
              Szűrés
            </Button>
          </Grid>
        </Grid>
      </Form>
    );
  };

  render() {
    const { filter, search } = this.props;

    return (
      <Formik initialValues={{ ...filter, search }} onSubmit={this.onSubmit}>
        {this.renderFilterForm}
      </Formik>
    );
  }
}

Filter.propTypes = {
  className: PropTypes.string,
  filter: PropTypes.shape({}),
  search: PropTypes.string,
  service: PropTypes.func.isRequired,
};

Filter.defaultProps = {
  className: '',
  filter: {
    priority: false,
    status: statusItems[0].id,
    segment: Segment.ALL,
  },
  search: '',
};

export default Filter;
