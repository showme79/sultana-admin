import { NoSsr, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import ReactSelect from 'react-select';
import Async from 'react-select/async';
import AsyncCreatable from 'react-select/async-creatable';
import Creatable from 'react-select/creatable';

import Label from '../Label/Label';

import genericComponents from './Select.components';
import styles from './Select.styles';

class Select extends PureComponent {
  onChange = (value, action) => {
    const { name, onChange, formik } = this.props;
    // transform `onChange` to make compliant with Formik
    return onChange && (formik ? onChange({ target: { id: name, value } }, action) : onChange(value, action));
  };

  render() {
    const {
      classes,
      theme,
      options,
      label,
      helperText,
      components = {},
      onChange,
      formik,
      creatable,
      async,
      ...subProps
    } = this.props;
    const selectStyles = {
      input: (base) => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    const SelectComponent =
      (creatable && async && AsyncCreatable) ||
      (creatable && !async && Creatable) ||
      (!creatable && async && Async) ||
      ReactSelect;

    return (
      <div className={classes.root}>
        <NoSsr>
          <SelectComponent
            classes={classes}
            styles={selectStyles}
            textFieldProps={{
              label: <Label tooltip={helperText}>{label}</Label>,
              InputLabelProps: { shrink: true },
            }}
            options={options}
            components={{ ...genericComponents, ...components }}
            onChange={this.onChange}
            {...subProps}
          />
        </NoSsr>
      </div>
    );
  }
}

Select.propTypes = {
  classes: PropTypes.shape({ root: PropTypes.string }).isRequired,
  theme: PropTypes.shape({ palette: PropTypes.shape({ text: PropTypes.shape({ primary: PropTypes.string }) }) })
    .isRequired,
  components: PropTypes.shape({}),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      label: PropTypes.string,
    }),
  ),
  name: PropTypes.string.isRequired,
  creatable: PropTypes.bool,
  async: PropTypes.bool,
  label: PropTypes.node,
  helperText: PropTypes.node,
  formik: PropTypes.bool,
  onChange: PropTypes.func,
};

Select.defaultProps = {
  components: undefined,
  options: [],
  creatable: false,
  async: false,
  label: undefined,
  helperText: undefined,
  formik: false,
  onChange: undefined,
};

export default withStyles(styles, { withTheme: true })(Select);
