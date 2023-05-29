import { Button, Grid } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { map } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { SubscriptionStatus, fieldProps } from 'consts';
import { useSubscriptionTypes } from 'hooks';
import { SubscriptionStatusText } from 'lang/hu';
import { SimpleSelect } from 'view/base';

const statusItems = [
  { id: 'ALL', name: 'Összes' },
  ...map(SubscriptionStatus, (status) => ({ id: status, name: SubscriptionStatusText[status] })),
];

const FilterForm = ({ /* values,  errors, */ isSubmitting }) => {
  const { subscriptionTypes } = useSubscriptionTypes();

  const subscriptionTypesList = useMemo(
    () => [
      { id: 'ALL', name: 'Összes' },
      ...map(subscriptionTypes, ({ title }, id) => ({ id, name: `${title} (${id})` })),
    ],
    [subscriptionTypes],
  );

  return (
    <Form>
      <Grid container spacing={2}>
        <Grid item xs={3} />
        <Grid item xs={3}>
          <Field
            component={SimpleSelect}
            name="type"
            label="Típus"
            items={subscriptionTypesList}
            {...fieldProps}
            disabled={isSubmitting}
          />
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
          <Field component={TextField} name="email" label="E-mail cím" {...fieldProps} />
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

FilterForm.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
};

const Filter = ({ filter, service }) => {
  const onSubmit = useCallback(
    (values, { setSubmitting }) =>
      service(values)
        .then(() => setSubmitting(false))
        .catch(() => setSubmitting(false)),
    [service],
  );

  return (
    <Formik initialValues={filter} onSubmit={onSubmit}>
      {(formikProps) => <FilterForm {...formikProps} />}
    </Formik>
  );
};

Filter.propTypes = {
  filter: PropTypes.shape({}),
  service: PropTypes.func.isRequired,
};

Filter.defaultProps = {
  filter: {
    status: 'ALL',
    type: 'ALL',
    email: '',
  },
};

export default Filter;
