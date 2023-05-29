import { withStyles } from '@material-ui/core';
import clsx from 'clsx';
import { mapValues, memoize } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Action, Route, TagStatus } from 'consts';
import { RangePropType, SortDirectionPropType, SortPropType, TagRightsPropType } from 'consts/prop-types';
import { AddCircleIcon, DeleteIcon, DoneIcon, EditIcon, UndoIcon } from 'icons';
import { AppSelectors, TagsActions, TagsSelectors } from 'state';
import { evalFnValue } from 'utils';
import { Dialog } from 'view/base';
import { ExTable } from 'view/components';
import { TagEditor } from 'view/modules';

import Filter from './Filter';
import columns from './Tags.columns';
import styles from './Tags.styles';

class Tags extends Component {
  createItemActions = memoize((rights) => [
    {
      id: Action.EDIT,
      visible: rights.EDIT,
      tooltip: 'Tag szerkesztése',
      icon: <EditIcon />,
    },
    {
      id: Action.APPROVE,
      visible: rights.EDIT,
      tooltip: (item) => (item.status === TagStatus.APPROVED ? 'Visszavonás' : 'Közzététel'),
      // eslint-disable-next-line react/no-unstable-nested-components
      icon: (item) => (item.status === TagStatus.APPROVED ? <UndoIcon /> : <DoneIcon />),
    },
    {
      id: Action.DELETE,
      visible: rights.DELETE,
      tooltip: 'Tag törlése',
      icon: <DeleteIcon />,
    },
  ]);

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
    const { resetTag } = this.props;
    resetTag();
  }

  loadResources = (prevProps) => {
    const {
      sort,
      range,
      filter,
      createTag,
      loadTags,
      loadTag,
      resetTag,
      match: {
        params: { tagId },
      },
      user: { id: userId } = {},
    } = this.props;

    const { match: { params: { tagId: prevTagId = undefined } = {} } = {} } = prevProps || {};

    if (prevProps === null) {
      loadTags({ sort, range, filter });
    }

    if (tagId !== prevTagId) {
      if (userId && +tagId === 0) {
        createTag(userId);
      } else if (tagId) {
        loadTag(tagId);
      } else {
        resetTag();
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

  openTagEditor = (id) => {
    const { history } = this.props;
    return history.push(Route.tags.replace(':tagId?', id));
  };

  closeTagEditor = () => {
    const { history } = this.props;
    return history.push(Route.tags.replace('/:tagId?', ''));
  };

  saveTag = (tag) => {
    const { saveTag } = this.props;
    return saveTag(tag);
  };

  submitTagAction = (tag) => this.saveTag(tag).then(() => this.closeTagEditor());

  submitFilterService = (filter) => {
    const { sort, range, loadTags } = this.props;
    return loadTags({ sort, range, filter });
  };

  onSortChange = (sort) => {
    const { range, filters, loadTags } = this.props;
    loadTags({
      sort,
      filters,
      range: { ...range, offset: 0 },
    });
  };

  onItemActionClick = (action, tag /* , event */) => {
    const { id: actionId } = action;
    if (actionId === Action.DELETE) {
      return this.showDeleteConfirmDialog('Biztosan törölni szeretnéd a címkét?', tag.id);
    }

    if (actionId === Action.APPROVE) {
      return this.saveTag({
        ...tag,
        status: tag.status === TagStatus.APPROVED ? TagStatus.NOT_APPROVED : TagStatus.APPROVED,
      });
    }

    if (actionId === Action.EDIT) {
      return this.openTagEditor(tag.id);
    }

    return false;
  };

  onActionClick = (action, selected /* , event */) => {
    const { id: actionId } = action;
    if (actionId === Action.CREATE) {
      return this.openTagEditor(0);
    }

    if (actionId === Action.DELETE_SELECTED) {
      return this.showDeleteConfirmDialog(`Biztosan törölni szeretnéd a ${selected.length} darab címkét?`, selected);
    }

    return false;
  };

  onDialogAction = (action /* , event */) => {
    const { id: actionId } = action;
    const {
      confirm: { context: id },
    } = this.state;
    const { deleteTags } = this.props;
    if (actionId === Action.CLOSE) {
      this.setState({ confirm: null });
    } else if (actionId === Action.DELETE) {
      // take care, this will handle both single and mulitple item deletion
      deleteTags(id).then(() => this.setState({ confirm: null, selected: [] }));
    }
  };

  onDialogClose = (/* event */) => this.setState({ confirm: null });

  onRowsPerPageChange = (rowsPerPage /* , event */) => {
    const { sort, filter, loadTags } = this.props;
    const range = {
      offset: 0,
      limit: rowsPerPage,
    };
    loadTags({ sort, filter, range });
  };

  onPageChange = (page /* , event */) => {
    const { sort, filter, rowsPerPage, loadTags } = this.props;
    const range = {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    };
    loadTags({ sort, filter, range });
  };

  onItemClick = (item) => this.openTagEditor(item.id);

  onItemSelect = (itemId /* , item, event */) => {
    const { selected } = this.state;
    const selectedIdx = selected.indexOf(itemId);
    this.setState({
      selected: selectedIdx < 0 ? [...selected, itemId] : selected.filter((id, idx) => selectedIdx !== idx),
    });
  };

  onSelectAll = (/* event */) => {
    const { selected } = this.state;
    const { tags } = this.props;
    this.setState({
      selected: selected.length === tags.length ? [] : tags.map((item) => item.id),
    });
  };

  onTagEditorClose = (/* event */) => this.closeTagEditor();

  render() {
    const { classes, tags, sortKey, sortDirection, page, rights, filter, rowsPerPage, total, tag } = this.props;
    const { selected, confirm } = this.state;

    const itemActions = this.createItemActions(rights);

    const selectActions = {
      id: Action.DELETE_SELECTED,
      visible: rights.DELETE,
      tooltip: 'Kijelölt tagek törlése',
      icon: <DeleteIcon />,
    };

    const actions = {
      id: Action.CREATE,
      visible: rights.CREATE,
      icon: <AddCircleIcon />,
      text: 'Új tag',
      color: 'secondary',
    };

    const { content: confirmContent, actions: confirmActions } = confirm || {};

    const { table = '', row = '', column = '' } = classes;
    const classesTable = { table, row, column };

    return (
      <div className={clsx(classes.root)}>
        <ExTable
          classes={classesTable}
          title="Tagek"
          items={tags}
          total={total}
          columns={columns}
          sortKey={sortKey}
          sortDirection={sortDirection}
          itemActions={itemActions}
          selectActions={selectActions}
          filter={<Filter className={classes.filter} filter={filter} service={this.submitFilterService} />}
          actions={actions}
          page={page}
          rowsPerPage={rowsPerPage}
          onSortChange={this.onSortChange}
          onRowsPerPageChange={this.onRowsPerPageChange}
          onPageChange={this.onPageChange}
          onItemClick={this.onItemClick}
          onItemActionClick={this.onItemActionClick}
          onActionClick={this.onActionClick}
          onItemSelect={this.onItemSelect}
          onSelectAll={this.onSelectAll}
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

        {tag && (
          <TagEditor
            tag={tag}
            rights={mapValues(rights, (right) => evalFnValue(right, tag))}
            onClose={this.onTagEditorClose}
            submitAction={this.submitTagAction}
          />
        )}
      </div>
    );
  }
}

Tags.propTypes = {
  ...ReactRouterPropTypes.isRequired,
  tags: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sort: SortPropType.isRequired,
  range: RangePropType.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortDirection: SortDirectionPropType.isRequired,
  rights: TagRightsPropType.isRequired,
};

const mapStateToProps = (state) => ({
  tag: TagsSelectors.getTag(state),
  tags: TagsSelectors.getTags(state),
  total: TagsSelectors.getTagsTotal(state),
  sort: TagsSelectors.getSort(state),
  sortKey: TagsSelectors.getSortKey(state),
  sortDirection: TagsSelectors.getSortDirection(state),
  range: TagsSelectors.getRange(state),
  page: TagsSelectors.getPageNumber(state),
  rowsPerPage: TagsSelectors.getRowsPerPage(state),
  filter: TagsSelectors.getFilter(state),
  user: AppSelectors.getUser(state),
  rights: TagsSelectors.getRights(state),
});

const mapDispatchToProps = (dispatch) => ({
  resetTag: () => dispatch(TagsActions.resetTag()),
  loadTag: (id) => dispatch(TagsActions.loadTag(id)),
  loadTags: ({ filter, sort, range }) => dispatch(TagsActions.loadTags({ filter, sort, range })),
  deleteTags: (tagIds) => dispatch(TagsActions.deleteTags(tagIds)),
  createTag: (userId) => dispatch(TagsActions.createTag(userId)),
  saveTag: (tag) => dispatch(TagsActions.saveTag(tag)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Tags)));
