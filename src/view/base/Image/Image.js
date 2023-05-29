import { Typography, withStyles } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import styles from './Image.styles';

class Image extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      naturalWidth: undefined,
      naturalHeight: undefined,
    };
  }

  updateImageAttr = (img) => {
    const {
      target: { naturalWidth, naturalHeight },
    } = img;
    this.setState({ naturalWidth, naturalHeight });
  };

  updateImageRef = (dom) => {
    if (dom) {
      this.imageRef = dom;
      dom.addEventListener('load', this.updateImageAttr);
    } else if (this.imageRef) {
      this.imageRef.removeEventListener('load', this.updateImageAttr);
      this.imageRef = null;
    }
  };

  render() {
    const { classes, className, src, title, showResolution, ...props } = this.props;
    const { naturalWidth, naturalHeight } = this.state;

    return (
      <>
        <img ref={this.updateImageRef} className={clsx(classes.root, className)} alt={title} src={src} {...props} />
        {showResolution && naturalHeight > 64 && (
          <Typography className={classes.title} variant="body1" component="div">
            <div className="title">{title}</div>
            <div className="resolution">
              {naturalWidth} x {naturalHeight}
            </div>
          </Typography>
        )}
      </>
    );
  }
}

Image.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.shape({
    root: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  showResolution: PropTypes.bool,
};

Image.defaultProps = {
  className: '',
  showResolution: false,
};

export default withStyles(styles)(Image);
