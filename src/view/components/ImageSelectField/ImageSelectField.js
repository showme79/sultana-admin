import { Button, FormControl, Grid, InputLabel, Typography, withStyles } from '@material-ui/core';
import clsx from 'clsx';
import { merge } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactCrop from 'react-image-crop';

import { ImageWidth } from 'consts';
import { getImageUrl } from 'utils';
import { Image, ImagePicker } from 'view/base';

import styles from './ImageSelectField.styles';

import 'react-image-crop/dist/ReactCrop.css';

class ImageSelectField extends Component {
  imageRef: null;

  constructor(props) {
    super(props);
    this.state = {
      showPicker: false,
      activeCropper: false,
    };
  }

  onImageKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === 'Space') {
      const { disabled } = this.props;
      return !disabled && this.setState({ showPicker: true });
    }

    return false;
  };

  onImageClick = (/* event */) => {
    const { disabled } = this.props;
    return !disabled && this.setState({ showPicker: true });
  };

  onImageBlur = (/* event */) => {
    const { name, value, onBlur } = this.props;
    return onBlur && onBlur({ target: { name, value } });
  };

  onImageFocus = (/* event */) => {
    const { name, value, onFocus } = this.props;
    return onFocus && onFocus({ target: { name, value } });
  };

  onPickerSelect = (image) => {
    const { name, onChange } = this.props;

    if (onChange) {
      onChange({ target: { name, value: image } });
    }

    this.setState({ showPicker: false });
  };

  onRemoveImageClick = () => {
    const { name, onChange, disabled } = this.props;
    if (disabled) {
      return;
    }

    if (onChange) {
      onChange({ target: { name, value: null } });
    }

    this.setState({ activeCropper: false });
  };

  onPickerClose = (/* event */) => this.setState({ showPicker: false });

  onRemoveCropClick = (/* event */) => {
    const { activeCropper } = this.state;
    const {
      value: { croppers, ...value },
      onChange,
      name,
    } = this.props;

    if (!activeCropper || !croppers?.[activeCropper.id]) {
      this.setState({ activeCropper: false });
      return;
    }

    const { [activeCropper.id]: $, ...newCroppers } = croppers;
    if (onChange) {
      onChange({
        target: {
          name,
          value: {
            ...value,
            croppers: newCroppers,
          },
        },
      });
    }

    this.setState({ activeCropper: false });
  };

  onCropButton = (cropperId) => (/* event */) => {
    const {
      value: { croppers: imageCroppers },
      croppers,
    } = this.props;
    const { activeCropper } = this.state;
    const cropper = croppers && croppers.find(({ id }) => id === cropperId);

    if (!cropper || activeCropper.id === cropperId) {
      this.setState({ activeCropper: false });
      return;
    }
    const imageCropper = imageCroppers && imageCroppers[cropperId];
    if (!imageCropper) {
      const {
        crop: { aspect },
      } = cropper;

      const { naturalWidth, naturalHeight } = this.imageRef;
      const width =
        naturalWidth / aspect < naturalHeight * aspect ? 100 : ((naturalHeight * aspect) / naturalWidth) * 100;
      const height =
        naturalWidth / aspect > naturalHeight * aspect ? 100 : (naturalWidth / aspect / naturalHeight) * 100;
      const y = (100 - height) / 2;
      const x = (100 - width) / 2;

      this.setState({
        activeCropper: merge({}, cropper, {
          crop: {
            unit: '%',
            aspect,
            x,
            y,
            width,
            height,
          },
        }),
      });
      return;
    }

    this.setState({
      activeCropper: merge({}, cropper, imageCropper ? { crop: imageCropper } : {}),
    });
  };

  onCropChange = (crop, percentCrop) => {
    const { activeCropper } = this.state;
    this.setState({
      activeCropper: merge({}, activeCropper, { crop: percentCrop }),
    });
  };

  onCropComplete = (crop, percentCrop) => {
    const { activeCropper } = this.state;
    const { name, onChange, value: image } = this.props;
    const { naturalWidth, naturalHeight } = this.imageRef;
    const pixelCrop = {
      ...percentCrop,
      unit: 'px',
      x: Math.round(naturalWidth * (percentCrop.x / 100)),
      y: Math.round(naturalHeight * (percentCrop.y / 100)),
      width: Math.round(naturalWidth * (percentCrop.width / 100)),
      height: Math.round(naturalHeight * (percentCrop.height / 100)),
    };
    const croppers = {
      ...(image.croppers || {}),
      [activeCropper.id]: {
        /* ...crop, */
        ...percentCrop,
        pixels: pixelCrop,
      },
    };

    if (onChange) {
      onChange({ target: { name, value: { ...image, croppers } } });
    }
  };

  onCropImageLoaded = (event) => {
    this.imageRef = event.target;
    /* const {
      value: { croppers: imageCroppers },
    } = this.props;

    const { activeCropper } = this.state;
    const { id } = activeCropper || {};
    
    if ((imageCroppers && imageCroppers[id]) || !activeCropper) {
      return undefined;
    }

    const {
      crop: { aspect },
    } = activeCropper;
    
    const { naturalWidth, naturalHeight } = this.imageRef;
    const width =
      naturalWidth / aspect < naturalHeight * aspect ? 100 : ((naturalHeight * aspect) / naturalWidth) * 100;
    const height = naturalWidth / aspect > naturalHeight * aspect ? 100 : (naturalWidth / aspect / naturalHeight) * 100;
    const y = (100 - height) / 2;
    const x = (100 - width) / 2;

    this.setState({
      activeCropper: {
        ...activeCropper,
        crop: {
          unit: '%',
          aspect,
          x,
          y,
          width,
          height,
        },
      },
    });
    return false;
    */
  };

  render() {
    const { showPicker, activeCropper } = this.state;
    const { className, classes, label, name, value: image, croppers, onChange, onBlur, ...props } = this.props;
    const { InputLabelProps, ...ControlProps } = props;
    const { fullWidth, ...FieldProps } = ControlProps;
    const { disabled } = FieldProps;

    const hasImage = !!(image && image.id);
    const cropperDisabled = !activeCropper || disabled;

    return (
      <FormControl className={clsx(className, classes.root)} {...ControlProps}>
        <InputLabel className={clsx(classes.inputLabel)} {...InputLabelProps}>
          {label}
        </InputLabel>
        <div className={clsx(classes.imageWrapper)}>
          <div
            className={clsx(classes.image)}
            role="button"
            tabIndex="0"
            onClick={activeCropper ? undefined : this.onImageClick}
            onKeyPress={activeCropper ? undefined : this.onImageKeyPress}
            onFocus={activeCropper ? undefined : this.onImageFocus}
            onBlur={activeCropper ? undefined : this.onImageBlur}
            {...FieldProps}
          >
            {hasImage && (
              <ReactCrop
                className={classes.cropper}
                crop={activeCropper?.crop || {}}
                aspect={(activeCropper?.crop || {})?.aspect}
                onChange={this.onCropChange}
                onComplete={this.onCropComplete}
                keepSelection
                disabled={cropperDisabled}
              >
                <Image
                  src={getImageUrl(image.id, ImageWidth.SELECTOR)}
                  title={image.title}
                  showResolution={!activeCropper}
                  onLoad={this.onCropImageLoaded}
                />
              </ReactCrop>
            )}
            {!hasImage && !disabled && (
              <Typography className={classes.placeholder} variant="body1">
                Kiválasztás médiatárból...
              </Typography>
            )}
          </div>
          {hasImage && !disabled && (
            <Grid container className={clsx(classes.cropButtons)} spacing={2}>
              {croppers?.map(({ id, text }) => (
                <Grid key={id} item xs={4}>
                  <Button
                    color={image?.croppers?.[id] ? 'primary' : 'secondary'}
                    variant={activeCropper?.id === id ? 'contained' : 'outlined'}
                    onClick={this.onCropButton(id)}
                  >
                    {text}
                  </Button>
                </Grid>
              ))}
              {croppers && (
                <Grid item xs={5}>
                  <Button
                    className="remove-crop"
                    color="primary"
                    disabled={!activeCropper}
                    onClick={this.onRemoveCropClick}
                  >
                    Aktuális törlése
                  </Button>
                </Grid>
              )}
              <Grid item xs={croppers ? 7 : 12}>
                <Button className="remove-image" color="primary" variant="outlined" onClick={this.onRemoveImageClick}>
                  Kép eltávolítása
                </Button>
              </Grid>
            </Grid>
          )}
        </div>
        <ImagePicker
          open={showPicker}
          onSelect={this.onPickerSelect}
          onClose={this.onPickerClose}
          fullWidth
          maxWidth="lg"
        />
      </FormControl>
    );
  }
}

ImageSelectField.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.shape({
    root: PropTypes.string,
    placeholder: PropTypes.string,
    inputLabel: PropTypes.string,
    imageWrapper: PropTypes.string,
    image: PropTypes.string,
    cropper: PropTypes.string,
    cropButtons: PropTypes.string,
  }),
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    croppers: PropTypes.shape({}),
    image: PropTypes.shape({}),
  }),
  croppers: PropTypes.arrayOf(PropTypes.shape({})),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

ImageSelectField.defaultProps = {
  className: '',
  classes: {},
  label: undefined,
  value: undefined,
  croppers: undefined,
  disabled: false,
  onChange: undefined,
  onFocus: undefined,
  onBlur: undefined,
};

const ImageSelectFieldWithStyles = withStyles(styles)(ImageSelectField);

ImageSelectFieldWithStyles.Formik = ({ field, form, ...props }) => <ImageSelectFieldWithStyles {...field} {...props} />;
ImageSelectFieldWithStyles.Formik.propTypes = {
  field: PropTypes.shape({}).isRequired,
  form: PropTypes.shape({}).isRequired,
};

export default ImageSelectFieldWithStyles;
