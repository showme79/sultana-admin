import { FormControl, InputLabel, Slider, Switch, Typography, withStyles } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './SliderField.styles';

const onChangeSwitch = (field, form) => (event, checked) => {
  const value = Math.abs(field.value);
  form.setFieldValue(field.name, checked ? value || 1 : -value);
};

const onChangeSlider = (field, form) => (event, value) => {
  form.setFieldValue(field.name, value);
};

const SliderField = ({ classes, field, form, label, switchable, ...props }) => {
  const { InputLabelProps, ...ControlProps } = props;
  const { fullWidth, ...FieldProps } = ControlProps;
  const value = Math.abs(field.value || 0);

  return (
    <FormControl className={clsx(classes.formControl)} {...ControlProps}>
      <InputLabel className={clsx(classes.inputLabel)} {...InputLabelProps}>
        {label}
      </InputLabel>
      <div className={clsx(classes.fieldsContainer)}>
        {!!switchable && (
          <Switch
            name="prioritySwitch"
            type="checkbox"
            className={clsx(classes.switch)}
            onChange={onChangeSwitch(field, form)}
            checked={field.value > 0}
          />
        )}
        <Slider className={clsx(classes.slider)} onChange={onChangeSlider(field, form)} value={value} {...FieldProps} />
        <Typography variant="body1" className={clsx(classes.number)}>
          {value}
        </Typography>
      </div>
    </FormControl>
  );
};

SliderField.propTypes = {
  InputLabelProps: PropTypes.shape({}),
  classes: PropTypes.shape({
    fieldsContainer: PropTypes.string.isRequired,
    formControl: PropTypes.string.isRequired,
    inputLabel: PropTypes.string.isRequired,
    number: PropTypes.string.isRequired,
    slider: PropTypes.string.isRequired,
    switch: PropTypes.string.isRequired,
  }).isRequired,
  field: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  form: PropTypes.shape({}).isRequired,
  label: PropTypes.string,
  switchable: PropTypes.bool,
};

SliderField.defaultProps = {
  InputLabelProps: undefined,
  label: undefined,
  switchable: false,
};

export default withStyles(styles)(SliderField);
