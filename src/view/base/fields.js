import { yupResolver } from '@hookform/resolvers/yup';
import { TextField as MuiTextField } from '@material-ui/core';
import { each, isArray, size } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { fieldProps } from 'consts';
import { mapApiErrorsToFormErrors } from 'utils';

export const TextField = ({ name, control, ...props }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <MuiTextField
          {...field}
          error={!!error}
          helperText={error?.message || (isArray(error) ? error[0] : error)}
          {...fieldProps}
          {...props}
        />
      )}
    />
  );
};

TextField.propTypes = {
  control: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
};

TextField.defaultProps = {};

export const mapYupErrors =
  (schemaCreator) =>
  async (values, context = {}) =>
    yupResolver(schemaCreator(context))(values, context);

export const useFormSubmit = ({ onSubmit, resolver, ...params }) => {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm({
    mode: 'all',
    resolver,
    ...params,
  });
  const { getValues, handleSubmit, errors, setError } = form;

  const onFormSubmit = useCallback(
    async (data) => {
      setSubmitting(true);

      try {
        await onSubmit(data);
        setSubmitting(false);
      } catch (ex) {
        setSubmitting(false);
        const values = getValues();
        const formErrors = mapApiErrorsToFormErrors(ex.response?.data);
        each(formErrors, (message, name) => {
          if (values[name] !== undefined) {
            setError(name, { type: 'manual', message });
          }
        });
      }
    },
    [getValues, onSubmit, setError],
  );

  return {
    ...form,
    onFormSubmit: handleSubmit(onFormSubmit),
    submitting,
    setSubmitting,
    disabled: submitting || size(errors) > 0,
  };
};
