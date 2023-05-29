import { Button, Grid } from '@material-ui/core';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { GalleryStatus, fieldProps } from 'consts';
import { GalleryStatusText } from 'lang/hu';
import { getSelectItems } from 'utils';
import { SimpleSelect } from 'view/base';

const statusItems = getSelectItems(GalleryStatus, GalleryStatusText);

const Filter = ({ className, filter, onSubmit }) => {
  const FilterForm = useCallback(
    (formikBag) => {
      const { /* values, */ isSubmitting } = formikBag;
      return (
        <Form className={clsx(className)}>
          <Grid container spacing={2}>
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
            <Grid item xs={9}>
              <Field component={TextField} name="search" {...fieldProps} label="Szöveg (cím, leírás)" />
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
    status: GalleryStatus.ALL,
    search: '',
  },
};

export default Filter;
