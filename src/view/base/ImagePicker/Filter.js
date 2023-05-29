import { Button, Grid } from '@material-ui/core';
import clsx from 'clsx';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { fieldProps } from 'consts';
import services from 'services';

import Select from '../Select/Select';

const onFormSubmit = (handleSubmit) => (event) => {
  event.stopPropagation();
  handleSubmit(event);
};

const getGalleryValue = ({ id }) => id;

const getGalleryLabel = ({ title }) => title;

const noOptionsMessage = (text) => (/* {inputValue} */) => text;

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      galleries: undefined,
    };
  }

  componentDidMount() {
    services.loadGalleries(null, { progress: false }).then(({ data: { result = [] } = {} } = {}) => {
      this.setState({ galleries: result }); // .map(({ id: value, name: label }) => ({ value, label })) });
    });
  }

  onSubmit = (values, { setSubmitting }) => {
    const { service } = this.props;
    return service(values)
      .then(() => setSubmitting(false))
      .catch(() => setSubmitting(false));
  };

  renderGallerySelect = ({ field }) => {
    const { galleries } = this.state;
    return (
      <Select
        {...field}
        formik
        label="Galéria"
        placeholder="Válassz gallériát"
        options={galleries}
        getOptionValue={getGalleryValue}
        getOptionLabel={getGalleryLabel}
        hideSelectedOptions
        noOptionsMessage={noOptionsMessage('Nem található galéria!')}
        isClearable
      />
    );
  };

  renderForm = (formikProps) => {
    const { handleSubmit, isSubmitting } = formikProps;
    const { className } = this.props;
    return (
      <form className={clsx(className)} onSubmit={onFormSubmit(handleSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Field render={this.renderGallerySelect} name="gallery" />
          </Grid>
          <Grid item xs={6}>
            <Field component={TextField} name="search" {...fieldProps} label="Keresés (cím, leírás szerint)" />
          </Grid>
          <Grid item xs={1}>
            <Button type="submit" disabled={isSubmitting} color="primary">
              Szűrés
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  };

  render() {
    const { search } = this.props;
    return <Formik initialValues={{ search }} render={this.renderForm} onSubmit={this.onSubmit} />;
  }
}

Filter.propTypes = {
  className: PropTypes.string,
  search: PropTypes.string.isRequired,
  service: PropTypes.func.isRequired,
};

Filter.defaultProps = {
  className: '',
};

export default Filter;
