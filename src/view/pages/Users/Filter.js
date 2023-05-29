import { Button, Grid } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { map } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { UserStatus, fieldProps } from 'consts';
import { UserStatusText } from 'lang/hu';
import { SimpleSelect } from 'view/base';

const statusItems = [
  { id: 'ALL', name: 'Összes' },
  ...map(UserStatus, (status) => ({ id: status, name: UserStatusText[status] })),
];

const renderFilterForm = ({ /* values,  errors, */ isSubmitting }) => (
  <Form>
    <Grid container spacing={2}>
      <Grid item xs={6} />
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
        <Field component={TextField} name="username" label="Felhasználó" {...fieldProps} />
      </Grid>
      <Grid item xs={1}>
        <Button type="submit" disabled={isSubmitting} color="primary">
          Szűrés
        </Button>
      </Grid>
    </Grid>
  </Form>
);
class Filter extends Component {
  onSubmit = (values, { setSubmitting }) => {
    const { service } = this.props;
    return service(values)
      .then(() => setSubmitting(false))
      .catch(() => setSubmitting(false));
  };

  render() {
    const { filter } = this.props;

    return <Formik initialValues={filter} render={renderFilterForm} onSubmit={this.onSubmit} />;
  }
}

Filter.propTypes = {
  filter: PropTypes.shape({}),
  service: PropTypes.func.isRequired,
};

Filter.defaultProps = {
  filter: {
    status: statusItems[0].id,
    username: '',
  },
};

export default Filter;
