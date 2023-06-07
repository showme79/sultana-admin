import { Button, Grid } from '@material-ui/core';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { map } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { TagStatus, fieldProps } from 'consts';
import { TagStatusText } from 'lang/hu';
import { AppSelectors } from 'state';
import { getSegmentFilterItems } from 'utils';
import { SimpleSelect } from 'view/base';

const onSegmentClick =
  ({ submitForm, setFieldValue }, segment) =>
  (/* event */) => {
    setFieldValue('segment', segment, false);
    submitForm();
  };

const statusItems = [
  { id: 'ALL', name: 'Összes' },
  ...map(TagStatus, (status) => ({ id: status, name: TagStatusText[status] })),
];

const Filter = ({ className, service, filter: filterProps }) => {
  const { Segment, SegmentText } = useSelector(AppSelectors.getSegmentsInfo);

  const segmentItems = useMemo(
    () => getSegmentFilterItems({ Segment, SegmentText, all: true, special: false }),
    [Segment, SegmentText],
  );

  const filter = useMemo(
    () =>
      filterProps || {
        segment: segmentItems[0].id,
        status: statusItems[0].id,
        name: '',
      },
    [filterProps, segmentItems],
  );

  const onSubmit = useCallback(
    (values, { setSubmitting }) => {
      return service(values)
        .then(() => setSubmitting(false))
        .catch(() => setSubmitting(false));
    },
    [service],
  );

  const renderForm = useCallback(
    (formikProps) => {
      const { values, isSubmitting } = formikProps;

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
              <Field
                component={SimpleSelect}
                name="status"
                label="Állapot"
                items={statusItems}
                {...fieldProps}
                disabled={isSubmitting}
              />
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
    },
    [className, segmentItems],
  );

  return (
    <Formik initialValues={filter} onSubmit={onSubmit}>
      {renderForm}
    </Formik>
  );
};

Filter.propTypes = {
  className: PropTypes.string,
  filter: PropTypes.shape({}),
  service: PropTypes.func.isRequired,
};

Filter.defaultProps = {
  className: '',
  filter: undefined,
};

export default Filter;
