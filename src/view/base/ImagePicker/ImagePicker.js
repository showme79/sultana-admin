import {
  CircularProgress,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  TablePagination,
  withStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Action, ImageWidth, MediaType, SortDirection, rowsPerPageOptionsThumbs } from 'consts';
import { AddPhotoAlternateIcon, KeyboardBackspaceIcon, SaveAltIcon } from 'icons';
import services from 'services';
import { calcPageNumber, calcRowsPerPage, getImageUrl } from 'utils';
import Dialog from 'view/base/Dialog/Dialog';
import MediaEditor from 'view/modules/MediaEditor/MediaEditor';

import Filter from './Filter';
import styles from './ImagePicker.styles';

class ImagePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: undefined,
      filter: {
        type: MediaType.IMAGE,
      },
      search: '',
      sort: {
        key: 'createdAt',
        direction: SortDirection.DESC,
      },
      range: {
        offset: 0,
        limit: rowsPerPageOptionsThumbs[0],
      },
      total: undefined,
      selected: undefined,
      uploading: false,
    };
  }

  async componentDidMount() {
    await this.loadImages();
  }

  loadImages = async (params = {}) => {
    const { filter: stateFilter, range: stateRange, sort: stateSort, search: stateSearch } = this.state;
    const {
      filter = stateFilter,
      range = stateRange,
      sort = stateSort,
      search = stateSearch,
      galleryId = undefined,
    } = params;

    const response = await services.loadMediaList(
      {
        filter,
        sort,
        range,
        search,
        galleryId,
      },
      { progress: false },
    );
    const { data: { result: images = [], total = 0 } = {} } = response || {};
    this.setState({
      sort,
      range,
      filter,
      images,
      total,
      search,
    });
  };

  setPage = (page) => {
    const { sort, filter, search, range } = this.state;
    const rowsPerPage = calcRowsPerPage(range);
    this.loadImages({
      sort,
      filter,
      range: {
        offset: page * rowsPerPage,
        limit: rowsPerPage,
      },
      search,
    });
  };

  onActionClick = (action, event) => {
    const { onSelect } = this.props;
    const { id: actionId } = action;

    if (actionId === Action.ADD) {
      return this.setState({ uploading: true });
    }

    if (actionId === Action.BACK) {
      return this.setState({ uploading: false });
    }

    if (actionId === Action.SELECT) {
      const { selected } = this.state;
      return onSelect && onSelect(selected, event);
    }

    return false;
  };

  onRowsPerPageChange = (event) => {
    const {
      target: { value: rowsPerPage },
    } = event; /* , event */
    const { sort, filter, search } = this.state;
    const range = {
      offset: 0,
      limit: rowsPerPage,
    };
    this.loadImages({
      sort,
      filter,
      range,
      search,
    });
  };

  onPageChange = (event, page) => this.setPage(page);

  onImageClick = (image) => (event) => {
    const { open, onSelect } = this.props;
    const { selected } = this.state;
    if (open && selected === image) {
      return onSelect && onSelect(image, event);
    }
    return this.setState({ selected: image });
  };

  onClose = (event, reason) => {
    if (reason === 'backdropClick') {
      return null;
    }

    this.setState({ uploading: false });
    const { onClose } = this.props;
    return onClose?.(event);
  };

  submitMediaAction = async (media) => {
    const result = await services.createMedia({ media });
    this.setState({ uploading: false });
    this.setPage(0);
    return result;
  };

  submitFilterService = async ({ search, gallery }) => {
    const { sort, filter, range } = this.state;
    await this.loadImages({
      sort,
      filter,
      search,
      range: { ...range, offset: 0 },
      ...(gallery ? { galleryId: gallery.id } : {}),
    });
  };

  renderDialogContent = () => {
    const { classes } = this.props;
    const { images, selected, uploading, search } = this.state;

    if (!images) {
      return (
        <div className={clsx(classes.root)}>
          <CircularProgress className={classes.progress} />
        </div>
      );
    }

    if (uploading) {
      return (
        <MediaEditor
          className={clsx(classes.mediaEditor)}
          modal={false}
          editable
          submitAction={this.submitMediaAction}
        />
      );
    }

    return (
      <div className={clsx(classes.content)}>
        <div className={classes.gridWrapper}>
          <Filter className={classes.filter} search={search} service={this.submitFilterService} />
          <ImageList className={classes.grid} rowHeight={200} cols={4} gap={8}>
            {images.map((image) => {
              const cls = { item: image === selected ? classes.gridTileSelected : classes.gridTileUnselected };
              const style = { backgroundImage: `url(${getImageUrl(image.id, ImageWidth.THUMBNAIL)})` };
              return (
                <ImageListItem
                  key={image.id}
                  className={classes.gridTile}
                  classes={cls}
                  style={style}
                  onClick={this.onImageClick(image)}
                >
                  <ImageListItemBar className={classes.gridTileBar} title={image.title} />
                </ImageListItem>
              );
            })}
          </ImageList>
        </div>
      </div>
    );
  };

  render() {
    const { classes, allowUpload, onClose, onSelect, ...dialogProps } = this.props;
    const { images = [], range, total, uploading } = this.state;

    const rowsPerPage = calcRowsPerPage(range);
    const page = calcPageNumber(range);
    const actions = [
      {
        id: 'pagination',
        visible: !uploading,
        component: (
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptionsThumbs}
            component="div"
            count={total || images.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{ 'aria-label': 'Következő oldal' }}
            nextIconButtonProps={{ 'aria-label': 'Előző oldal' }}
            onPageChange={this.onPageChange}
            onRowsPerPageChange={this.onRowsPerPageChange}
          />
        ),
      },
      {
        id: Action.BACK,
        text: 'Vissza a képválasztóhoz',
        visible: uploading,
        icon: KeyboardBackspaceIcon,
        color: 'secondary',
      },
      {
        id: 'spacer',
        component: <div className={classes.actionSpacer} />,
      },
      {
        id: Action.UPLOAD,
        text: 'Feltölt',
        type: 'submit',
        form: 'MediaEditorForm',
        visible: uploading,
        icon: SaveAltIcon,
      },
      {
        id: Action.ADD,
        visible: allowUpload && !uploading,
        icon: AddPhotoAlternateIcon,
        text: 'Új kép feltöltése',
        color: 'secondary',
      },
      {
        id: Action.SELECT,
        visible: !uploading,
        text: 'Kiválaszt',
      },
    ];

    const { className } = this.props;
    return (
      <Dialog
        className={clsx(classes.root, className)}
        actions={actions}
        onAction={this.onActionClick}
        content={this.renderDialogContent()}
        onClose={this.onClose}
        {...dialogProps}
      />
    );
  }
}

ImagePicker.propTypes = {
  open: PropTypes.bool,
  className: PropTypes.string,
  classes: PropTypes.shape({
    root: PropTypes.string,
    filter: PropTypes.string,
    progress: PropTypes.string,
    mediaEditor: PropTypes.string,
    content: PropTypes.string,
    grid: PropTypes.string,
    gridWrapper: PropTypes.string,
    gridTile: PropTypes.string,
    gridTileBar: PropTypes.string,
    gridTileSelected: PropTypes.string,
    gridTileUnselected: PropTypes.string,
    actionSpacer: PropTypes.string,
  }).isRequired,
  title: PropTypes.string,
  allowUpload: PropTypes.bool,
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
};

ImagePicker.defaultProps = {
  open: false,
  className: undefined,
  title: 'Kép kiválasztása',
  allowUpload: true,
  onSelect: undefined,
  onClose: undefined,
};

export default withStyles(styles)(ImagePicker);
