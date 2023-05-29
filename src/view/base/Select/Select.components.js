/* eslint-disable react/prop-types */

import { Chip, MenuItem, Paper, TextField, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

import { CancelIcon } from 'icons';

const NoOptionsMessage = ({ selectProps, innerProps, children }) => (
  <Typography color="textSecondary" className={selectProps.classes.noOptionsMessage} {...innerProps}>
    {children}
  </Typography>
);

const inputComponent = ({ inputRef, ...props }) => <div ref={inputRef} {...props} />;

const Control = ({ selectProps, innerRef, innerProps, children }) => {
  const inputProps = {
    inputComponent,
    inputProps: {
      className: selectProps.classes.input,
      inputRef: innerRef,
      children,
      ...innerProps,
    },
  };
  return <TextField fullWidth InputProps={inputProps} {...selectProps.textFieldProps} />;
};

const Option = (props) => {
  const { innerRef, isFocused, isSelected, innerProps, children } = props;
  return (
    <MenuItem
      ref={innerRef}
      selected={isFocused}
      component="div"
      style={{ fontWeight: isSelected ? 500 : 400 }}
      {...innerProps}
    >
      {children}
    </MenuItem>
  );
};

const Placeholder = (props) => {
  const { selectProps, innerProps, children } = props;
  return (
    <Typography color="textSecondary" className={selectProps.classes.placeholder} {...innerProps}>
      {children}
    </Typography>
  );
};

const SingleValue = ({ selectProps, innerProps, children }) => (
  <Typography className={selectProps.classes.singleValue} {...innerProps}>
    {children}
  </Typography>
);

const ValueContainer = ({ selectProps, innerProps, children }) => (
  <div className={selectProps.classes.valueContainer} {...innerProps}>
    {children}
  </div>
);

const MultiValue = ({ selectProps, isFocused, removeProps, children }) => (
  <Chip
    tabIndex={-1}
    label={children}
    className={clsx(selectProps.classes.chip, {
      [selectProps.classes.chipFocused]: isFocused,
    })}
    onDelete={removeProps.onClick}
    deleteIcon={<CancelIcon {...removeProps} />}
  />
);

const Menu = ({ selectProps, innerProps, children }) => (
  <Paper square className={selectProps.classes.paper} {...innerProps}>
    {children}
  </Paper>
);

export default {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};
