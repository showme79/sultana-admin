/* eslint-disable react/prop-types */
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import {
  KeyboardDatePicker,
  KeyboardDateTimePicker,
  KeyboardTimePicker,
  DatePicker as MuiDatePicker,
  DateTimePicker as MuiDateTimePicker,
  TimePicker as MuiTimePicker,
} from '@material-ui/pickers';
import { Field } from 'formik';
import { Checkbox } from 'formik-material-ui';
import { ColorPicker } from 'material-ui-color';
import React, { useCallback } from 'react';

import { DISPLAY_DATETIME_FORMAT, DISPLAY_DATE_FORMAT, DISPLAY_TIME_FORMAT } from 'consts';

export const DateTimePicker = ({
  field,
  form,
  keyboard = false,
  inline = false,
  date = true,
  time = true,
  ...other
}) => {
  const { name } = field;

  const format =
    other.format ||
    (date && time && DISPLAY_DATETIME_FORMAT) ||
    (date && !time && DISPLAY_TIME_FORMAT) ||
    (!date && time && DISPLAY_DATE_FORMAT);

  const Module =
    (keyboard && date && time && KeyboardDateTimePicker) ||
    (keyboard && date && !time && KeyboardDatePicker) ||
    (keyboard && !date && time && KeyboardTimePicker) ||
    (!keyboard && date && time && MuiDateTimePicker) ||
    (!keyboard && date && !time && MuiDatePicker) ||
    (!keyboard && !date && time && MuiTimePicker);

  const handleError = useCallback(
    (error /* , date */) => form.errors[name] !== error && form.setFieldError(name, error),
    [form, name],
  );

  const handleChange = useCallback((value) => form.setFieldValue(name, value, true), [form, name]);

  return (
    <Module
      ampm={false}
      name={name}
      value={field.value}
      format={format}
      variant={inline ? 'inline' : 'dialog'}
      onFocus={field.onFocus}
      onChange={handleChange}
      onError={handleError}
      {...other}
    />
  );
};

export const SimpleSelect = ({ field, form, label, items, helperText, HelperTextProps = {}, ...props }) => {
  const { InputLabelProps, ...ControlProps } = props;
  return (
    <FormControl {...ControlProps}>
      <InputLabel {...InputLabelProps}>{label}</InputLabel>
      <Select {...field} form={form} {...ControlProps}>
        {items.map(({ id, name }) => (
          <MenuItem key={id} value={id}>
            {name}
          </MenuItem>
        ))}
      </Select>
      {!!helperText && <FormHelperText {...HelperTextProps}>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export const CheckboxField = ({ field, form, label, helperText, HelperTextProps = {}, ...props }) => {
  const { InputLabelProps, ...ControlProps } = props;
  return (
    <FormControl {...ControlProps}>
      <FormControlLabel
        label={label}
        control={<Checkbox field={field} type="checkbox" form={form} checked={field.value} />}
      />
      {!!helperText && <FormHelperText {...HelperTextProps}>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export const CheckboxGroupField = ({ label, items, helperText, HelperTextProps = {}, ...fieldProps }) => (
  <FormControl component="fieldset">
    {!!label && <FormLabel component="legend">{label}</FormLabel>}
    <FormGroup aria-label="position" row>
      {items.map((item) => (
        <Field component={CheckboxField} {...fieldProps} {...item} />
      ))}
    </FormGroup>
    {!!helperText && <FormHelperText {...HelperTextProps}>{helperText}</FormHelperText>}
  </FormControl>
);

export const ColoPickerField = ({ field, form, label, helperText, HelperTextProps = {}, ...fieldProps }) => {
  const handleChange = useCallback((event) => form.setFieldValue('color', event), [form]);

  return (
    <FormControl component="fieldset">
      {!!label && <FormLabel component="legend">{label}</FormLabel>}
      <ColorPicker {...field} {...fieldProps} onChange={handleChange} />
      {!!helperText && <FormHelperText {...HelperTextProps}>{helperText}</FormHelperText>}
    </FormControl>
  );
};
