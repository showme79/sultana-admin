import { Button, Grid } from '@material-ui/core';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { BannerStatus /* , Segment */, fieldProps } from 'consts';
import { BannerStatusText /* , SegmentText */ } from 'lang/hu';
import { getSelectItems } from 'utils';
import { SimpleSelect } from 'view/base';

const statusItems = getSelectItems(BannerStatus, BannerStatusText);
// const segmentItems = getSelectItems(Segment, SegmentText, { all: true, special: false });

// const onSegmentClick = (segment, { submitForm, setFieldValue }) => (/*event*/) => {
//   setFieldValue('segment', segment, false);
//   submitForm();
// };
const Filter = ({ className, filter, onSubmit }) => {
  const FilterForm = useCallback(
    (formikBag) => {
      const { /* values, */ isSubmitting } = formikBag;
      return (
        <Form className={clsx(className)}>
          <Grid container spacing={2}>
            <Grid item xs={6} className="segments">
              {/* }
            {segmentItems.map(({ id, name }) => (
              <Button
                key={id}
                variant={id !== values.segment ? 'text' : 'contained'}
                color="primary"
                onClick={onSegmentClick(id, formikBag)}
              >
                {name}
              </Button>
            ))}
            */}
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
              <Field component={TextField} name="name" {...fieldProps} label="Szűrés elnevezésre" />
            </Grid>
            <Grid item xs={1}>
              <Button type="submit" disabled={isSubmitting} color="primary">
                Szűrés
              </Button>
            </Grid>
          </Grid>
        </Form>
      );
    },
    [className],
  );

  return <Formik initialValues={filter} render={FilterForm} onSubmit={onSubmit} />;
};

Filter.propTypes = {
  className: PropTypes.string,
  filter: PropTypes.shape({}),
  onSubmit: PropTypes.func.isRequired,
};

Filter.defaultProps = {
  className: '',
  filter: {
    status: BannerStatus.ALL,
    // segment: Segment.$ALL,
    name: '',
  },
};

export default Filter;
