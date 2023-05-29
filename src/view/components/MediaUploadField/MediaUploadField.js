import { FormControl, InputLabel, withStyles } from '@material-ui/core';
import clsx from 'clsx';
import { isString, memoize } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Dropzone from 'react-dropzone';

import Image from 'view/base/Image/Image';

import styles from './MediaUploadField.styles';

class MediaUploadField extends PureComponent {
  onDrop = (acceptedFiles) => {
    const { name, onChange } = this.props;
    return onChange && onChange({ target: { name, value: acceptedFiles[0] } });
  };

  getImageUrl = memoize((file) => URL.createObjectURL(file));

  renderPreview = (acceptedFiles, rejectedFiles, isDragActive) => {
    const { value, disabled, placeholderDisabled, classes, placeholder, placeholderDragActive } = this.props;

    if (!value) {
      if (disabled && placeholderDisabled) {
        return <div className={clsx(classes.placeholder, classes.placeholderDisabled)}>{placeholderDisabled}</div>;
      }

      if (isDragActive) {
        return <div className={clsx(classes.placeholder, classes.placeholderDragActive)}>{placeholderDragActive}</div>;
      }

      return <div className={classes.placeholder}>{placeholder}</div>;
    }

    if (isString(value)) {
      return <Image src={value} title={value} showDescription />;
    }

    const { name, type } = value;
    if (type.includes('image')) {
      return <Image src={this.getImageUrl(value)} title={name} showDescription />;
    }

    const filename = name.split('.');
    const extension = filename.pop();
    return (
      <div className={classes.icon}>
        <div className="image">{extension}</div>
        <div className="filename">{filename}</div>
      </div>
    );
  };

  renderDropZone = ({ getRootProps, getInputProps, isDragActive, acceptedFiles, rejectedFiles }) => {
    const { className, classes, renderPreview, disabled } = this.props;
    return (
      <div {...getRootProps()} className={clsx(className, classes.dropzone, { 'drag-active': isDragActive, disabled })}>
        <input {...getInputProps()} />
        {(renderPreview || this.renderPreview)(acceptedFiles, rejectedFiles, isDragActive)}
      </div>
    );
  };

  render() {
    const { classes, label, accept, InputLabelProps, value, onChange, onBlur, onFocus, ...props } = this.props;
    const { placeholderDragActive, placeholderDisabled, placeholder, renderPreview, ...ControlProps } = props;
    const { disabled = false } = ControlProps;
    const field = {
      value,
      onChange,
      onBlur,
      onFocus,
      accept,
      disabled,
    };
    return (
      <FormControl className={clsx(classes.root)} {...ControlProps}>
        <InputLabel className={clsx(classes.inputLabel)} {...InputLabelProps}>
          {label}
        </InputLabel>
        <Dropzone {...field} onDrop={this.onDrop}>
          {this.renderDropZone}
        </Dropzone>
      </FormControl>
    );
  }
}

MediaUploadField.propTypes = {
  /*    field: PropTypes.shape({}).isRequired,
  form: PropTypes.shape({}).isRequired, */
  className: PropTypes.string,
  classes: PropTypes.shape({
    root: PropTypes.string,
    inputLabel: PropTypes.string,
    placeholder: PropTypes.string,
    placeholderDisabled: PropTypes.string,
    placeholderDragActive: PropTypes.string,
    icon: PropTypes.string,
    dropzone: PropTypes.string,
  }).isRequired,
  InputLabelProps: PropTypes.shape({}),
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  accept: PropTypes.string,
  placeholderDragActive: PropTypes.string,
  placeholderDisabled: PropTypes.string,
  placeholder: PropTypes.string,
  renderPreview: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

MediaUploadField.defaultProps = {
  className: '',
  InputLabelProps: {},
  label: undefined,
  disabled: false,
  accept: undefined,
  placeholderDragActive: 'Drop file(s) here',
  placeholderDisabled: 'File upload disabled',
  placeholder: 'Drop some files here.',
  value: undefined,
  renderPreview: undefined,
  onChange: undefined,
  onFocus: undefined,
  onBlur: undefined,
};

const MediaUploadFieldWithStyles = withStyles(styles)(MediaUploadField);

MediaUploadFieldWithStyles.Formik = ({ field, form, ...props }) => <MediaUploadFieldWithStyles {...field} {...props} />;
MediaUploadFieldWithStyles.Formik.propTypes = {
  field: PropTypes.shape({}).isRequired,
  form: PropTypes.shape({}).isRequired,
};

export default MediaUploadFieldWithStyles;
