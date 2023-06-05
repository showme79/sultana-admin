import { Button, CardContent, Grid } from '@material-ui/core';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { map } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { CategoryStatus, fieldProps } from 'consts';
import { CategoryStatusText } from 'lang/hu';
import { AppSelectors } from 'state';
import { getSegmentFilterItems } from 'utils';
import { SimpleSelect } from 'view/base';

const statusItems = [
  { id: 'ALL', name: 'Összes' },
  ...map(CategoryStatus, (status) => ({ id: status, name: CategoryStatusText[status] })),
];

const Filter = ({ service, className, filter: filterProps }) => {
  const { Segment, SegmentText } = useSelector(AppSelectors.getSegmentsInfo);

  const segmentItems = useMemo(
    () => getSegmentFilterItems({ Segment, SegmentText, all: true, special: false }),
    [Segment, SegmentText],
  );

  const filter = useMemo(
    () =>
      filterProps || {
        status: statusItems[0].id,
        segment: segmentItems[0].id,
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
      const { isSubmitting } = formikProps;

      return (
        <CardContent>
          <Form className={clsx(className)}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Field
                  component={SimpleSelect}
                  name="segment"
                  label="Szegmensek"
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
