import { withStyles } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Action, Route } from 'consts';
import { MediaRightsPropType, RangePropType, SortDirectionPropType, SortPropType } from 'consts/prop-types';
import { AddCircleIcon, DeleteIcon, EditIcon } from 'icons';
import { AppSelectors, MediaActions, MediaSelectors } from 'state';
import { evalFnValue } from 'utils';
import { Dialog } from 'view/base';
import { ExGridList } from 'view/components';
import { MediaEditor } from 'view/modules';

import Filter from './Filter';
import columns from './Media.columns';
import styles from './Media.styles';

class Media extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      confirm: null,
    };
  }

  componentDidMount() {
    this.loadResources(null);
  }

  componentDidUpdate(prevProps) {
    this.loadResources(prevProps);
  }

  componentWillUnmount() {
    const { resetMedia } = this.props;
    resetMedia();
  }

  loadResources = (prevProps) => {
    const {
      sort,
      range,
      filter,
      search,
      createMedia,
      loadMediaList,
      loadMedia,
      resetMedia,
      match: {
        params: { mediaId },
      },
      user: { id: userId } = {},
    } = this.props;

    const { match: { params: { mediaId: prevMediaId = undefined } = {} } = {} } = prevProps || {};
    if (prevProps === null) {
      loadMediaList({
        sort,
        range,
        filter,
        search,
      });
    }

    if (mediaId !== prevMediaId) {
      if (userId && +mediaId === 0) {
        createMedia(userId);
      } else if (mediaId) {
        loadMedia(mediaId);
      } else {
        resetMedia();
      }
    }
  };

  showDeleteConfirmDialog = (content, id) =>
    this.setState({
      confirm: {
        content,
        context: id,
        actions: [
          {
            id: Action.CLOSE,
            text: 'Vissza',
          },
          {
            id: Action.DELETE,
            text: 'Törlés',
          },
        ],
      },
    });

  openMediaEditor = (id) => {
    const { history } = this.props;
    return history.push(Route.media.replace(':mediaId?', id));
  };

  closeMediaEditor = () => {
    const { history } = this.props;
    return history.push(Route.media.replace('/:mediaId?', ''));
  };

  submitMediaAction = (media) => {
    const { saveMedia } = this.props;
    return saveMedia(media).then(() => this.closeMediaEditor());
  };

  onSortChange = (sort) => {
    const { range, filter, search, loadMediaList } = this.props;
    loadMediaList({
      sort,
      filter,
      search,
      range: { ...range, offset: 0 },
    });
  };

  onItemActionClick = (action, item /* , event */) => {
    const { id: actionId } = action;
    if (actionId === Action.DELETE) {
      return this.showDeleteConfirmDialog('Biztosan törölni szeretnéd ezt az elemet?', item.id);
    }

    if (actionId === Action.EDIT) {
      return this.openMediaEditor(item.id);
    }

    return false;
  };

  onActionClick = (action, selected /* , event */) => {
    const { id: actionId } = action;
    if (actionId === Action.CREATE) {
      return this.openMediaEditor(0);
    }

    if (actionId === Action.DELETE) {
      return this.showDeleteConfirmDialog(`Biztosan törölni szeretnéd a ${selected.length} darab elemet?`, selected);
    }

    return false;
  };

  onDialogAction = (action /* , event */) => {
    const { id: actionId } = action;
    const {
      confirm: { context: id },
    } = this.state;
    const { deleteMultipleMedia } = this.props;
    if (actionId === Action.CLOSE) {
      this.setState({ confirm: null });
    } else if (actionId === Action.DELETE) {
      // take care, this will handle both single and mulitple item deletion
      deleteMultipleMedia(id).then(() => this.setState({ confirm: null, selected: [] }));
    }
  };

  onDialogClose = (/* event */) => this.setState({ confirm: null });

  onRowsPerPageChange = (rowsPerPage /* , event */) => {
    const { sort, filter, loadMediaList } = this.props;
    const range = {
      offset: 0,
      limit: rowsPerPage,
    };
    loadMediaList({ sort, filter, range });
  };

  onPageChange = (page /* , event */) => {
    const { sort, filter, search, rowsPerPage, loadMediaList } = this.props;
    const range = {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    };
    loadMediaList({
      sort,
      filter,
      range,
      search,
    });
  };

  onMediaEditorClose = (/* event */) => this.closeMediaEditor();

  submitFilterService = ({ search, ...filter }) => {
    const { sort, range, loadMediaList } = this.props;
    return loadMediaList({
      sort,
      filter,
      search,
      range: { ...range, offset: 0 },
    });
  };

  render() {
    const { classes, mediaList, sortKey, sortDirection, page, rights, rowsPerPage, total, media, filter, search } =
      this.props;
    const { selected, confirm } = this.state;

    const itemActions = [
      {
        id: Action.EDIT,
        visible: rights.EDIT,
        tooltip: 'Média szerkesztése',
        icon: <EditIcon />,
        color: 'primary',
      },
      {
        id: Action.DELETE,
        visible: rights.DELETE,
        tooltip: 'Média törlése',
        icon: <DeleteIcon />,
        color: 'primary',
      },
    ];

    const selectActions = {
      id: Action.DELETE_SELECTED,
      visible: rights.DELETE,
      tooltip: 'Kijelölt elemek törlése',
      icon: <DeleteIcon />,
    };

    const actions = {
      id: Action.CREATE,
      visible: rights.CREATE,
      icon: <AddCircleIcon />,
      text: 'Új média',
      color: 'secondary',
    };

    const { content: confirmContent, actions: confirmActions } = confirm || {};

    const { table = '', row = '', column = '' } = classes;
    const classesTable = { table, row, column };

    const editable = media && (evalFnValue(rights.CREATE, media) || evalFnValue(rights.EDIT, media));

    return (
      <div className={clsx(classes.root)}>
        <ExGridList
          classes={classesTable}
          title="Médiakezelő"
          items={mediaList}
          total={total}
          columns={columns}
          sortKey={sortKey}
          sortDirection={sortDirection}
          itemActions={itemActions}
          selectActions={selectActions}
          filter={
            <Filter className={classes.filter} filter={filter} search={search} service={this.submitFilterService} />
          }
          actions={actions}
          page={page}
          rowsPerPage={rowsPerPage}
          onSortChange={this.onSortChange}
          onRowsPerPageChange={this.onRowsPerPageChange}
          onPageChange={this.onPageChange}
          onItemActionClick={this.onItemActionClick}
          onActionClick={this.onActionClick}
          selected={selected}
        />

        <Dialog
          className={clsx(classes.confirmDialog)}
          open={!!confirm}
          title="Megerősítés"
          content={confirmContent}
          actions={confirmActions}
          onClose={this.onDialogClose}
          onAction={this.onDialogAction}
        />

        {media && (
          <MediaEditor
            media={media}
            editable={editable}
            onClose={this.onMediaEditorClose}
            submitAction={this.submitMediaAction}
          />
        )}
      </div>
    );
  }
}

Media.propTypes = {
  ...ReactRouterPropTypes.isRequired,
  mediaList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  sort: SortPropType.isRequired,
  range: RangePropType.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortDirection: SortDirectionPropType.isRequired,
  rights: MediaRightsPropType.isRequired,
  search: PropTypes.string.isRequired,
  filter: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state) => ({
  loadError: MediaSelectors.getLoadError(state),
  media: MediaSelectors.getMedia(state),
  mediaList: MediaSelectors.getMediaList(state),
  total: MediaSelectors.getMediaTotal(state),
  sort: MediaSelectors.getSort(state),
  sortKey: MediaSelectors.getSortKey(state),
  sortDirection: MediaSelectors.getSortDirection(state),
  range: MediaSelectors.getRange(state),
  page: MediaSelectors.getPageNumber(state),
  rowsPerPage: MediaSelectors.getRowsPerPage(state),
  filter: MediaSelectors.getFilter(state),
  search: MediaSelectors.getSearch(state),
  user: AppSelectors.getUser(state),
  rights: MediaSelectors.getRights(state),
});

const mapDispatchToProps = (dispatch) => ({
  resetMedia: () => dispatch(MediaActions.resetMedia()),
  loadMedia: (id) => dispatch(MediaActions.loadMedia(id)),
  loadMediaList: (params) => dispatch(MediaActions.loadMediaList(params)),
  deleteMultipleMedia: (mediaIds) => dispatch(MediaActions.deleteMultipleMedia(mediaIds)),
  createMedia: (userId) => dispatch(MediaActions.createMedia(userId)),
  saveMedia: (media) => dispatch(MediaActions.saveMedia(media)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Media)));
