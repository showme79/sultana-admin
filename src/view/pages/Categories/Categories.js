import { withStyles } from '@material-ui/core';
import clsx from 'clsx';
import { mapValues } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Action, Route } from 'consts';
import { CategoryRightsPropType, RangePropType, SortDirectionPropType, SortPropType } from 'consts/prop-types';
import { AddCircleIcon, DeleteIcon, EditIcon } from 'icons';
import { AppSelectors, CategoriesActions, CategoriesSelectors } from 'state';
import { evalFnValue } from 'utils';
import { Dialog } from 'view/base';
import { ExTable } from 'view/components';
import { CategoryEditor } from 'view/modules';

import columns from './Categories.columns';
import styles from './Categories.styles';
import Filter from './Filter';

class Categories extends Component {
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
    const { resetCategory } = this.props;
    resetCategory();
  }

  loadResources = (prevProps) => {
    const {
      sort,
      range,
      filter,
      createCategory,
      loadCategories,
      loadCategory,
      resetCategory,
      match: {
        params: { categoryId },
      },
      user: { id: userId } = {},
    } = this.props;

    const { match: { params: { categoryId: prevCategoryId = undefined } = {} } = {} } = prevProps || {};

    if (prevProps === null) {
      loadCategories({ sort, range, filter });
    }

    if (categoryId !== prevCategoryId) {
      if (userId && +categoryId === 0) {
        createCategory(userId);
      } else if (categoryId) {
        loadCategory(categoryId);
      } else {
        resetCategory();
        // reload categories when url changed and editor is closed
        // loadCategories({ sort, range, filter });
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

  openCategoryEditor = (id) => {
    const { history } = this.props;
    return history.push(Route.categories.replace(':categoryId?', id || 0));
  };

  submitFilterService = (filter) => {
    const { sort, range, loadCategories } = this.props;
    return loadCategories({
      sort,
      filter,
      range: { ...range, offset: 0 },
    });
  };

  onSortChange = (sort) => {
    const { range, filter, loadCategories } = this.props;
    loadCategories({
      sort,
      filter,
      range: { ...range, offset: 0 },
    });
  };

  onItemActionClick = (action, item /* , event */) => {
    const { id: actionId } = action;
    if (actionId === Action.DELETE) {
      return this.showDeleteConfirmDialog('Biztosan törölni szeretnéd a kategóriát?', item.id);
    }

    if (actionId === Action.EDIT) {
      return this.openCategoryEditor(item.id);
    }

    return false;
  };

  onActionClick = (action, selected /* , event */) => {
    const { id: actionId } = action;
    if (actionId === Action.CREATE) {
      return this.openCategoryEditor();
    }
    if (actionId === Action.DELETE_SELECTED) {
      return this.showDeleteConfirmDialog(
        `Biztosan törölni szeretnéd a ${selected.length} darab kategóriát?`,
        selected,
      );
    }
    return false;
  };

  onDialogAction = (action /* , event */) => {
    const { id: actionId } = action;
    const {
      confirm: { context: id },
    } = this.state;
    const { deleteCategories } = this.props;
    if (actionId === Action.CLOSE) {
      this.setState({ confirm: null });
    } else if (actionId === Action.DELETE || actionId === Action.DELETE_SELECTED) {
      // take care, this will handle both single and mulitple item deletion
      deleteCategories(id).then(() => this.setState({ confirm: null, selected: [] }));
    }
  };

  onDialogClose = (/* event */) => this.setState({ confirm: null });

  onRowsPerPageChange = (rowsPerPage /* , event */) => {
    const { sort, filter, loadCategories } = this.props;
    const range = {
      offset: 0,
      limit: rowsPerPage,
    };
    loadCategories({ sort, range, filter });
  };

  onPageChange = (page /* , event */) => {
    const { sort, filter, rowsPerPage, loadCategories } = this.props;
    const range = {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    };
    loadCategories({ sort, range, filter });
  };

  onItemClick = (item) => this.openCategoryEditor(item.id);

  onItemSelect = (itemId /* , item, event */) => {
    const { selected } = this.state;
    const selectedIdx = selected.indexOf(itemId);
    this.setState({
      selected: selectedIdx < 0 ? [...selected, itemId] : selected.filter((id, idx) => selectedIdx !== idx),
    });
  };

  onSelectAll = (/* event */) => {
    const { selected } = this.state;
    const { categories } = this.props;
    this.setState({
      selected: selected.length === categories.length ? [] : categories.map((item) => item.id),
    });
  };

  onCategoryEditorClose = (/* post, event */) => {
    const { history } = this.props;
    return history.push(Route.categories.replace('/:categoryId?', ''));
  };

  render() {
    const {
      classes,
      categories,
      sortKey,
      sortDirection,
      filter,
      page,
      rights,
      rowsPerPage,
      total,
      category,
      saveCategory,
    } = this.props;
    const { selected, confirm } = this.state;

    const itemActions = [
      {
        id: Action.EDIT,
        visible: rights.EDIT,
        tooltip: 'Kategória szerkesztése',
        icon: <EditIcon />,
      },
      {
        id: Action.DELETE,
        visible: rights.DELETE,
        tooltip: 'Kategória törlése',
        icon: <DeleteIcon />,
      },
    ];

    const selectActions = {
      id: Action.DELETE_SELECTED,
      visible: rights.DELETE_SELECTED,
      tooltip: 'Kijelölt kategóriák törlése',
      icon: <DeleteIcon />,
    };

    const actions = {
      id: Action.CREATE,
      visible: rights.CREATE,
      icon: <AddCircleIcon />,
      text: 'Új kategória',
      color: 'secondary',
    };

    const { content: confirmContent, actions: confirmActions } = confirm || {};

    const { table = '', row = '', column = '' } = classes;
    const classesTable = { table, row, column };

    return (
      <div className={clsx(classes.root)}>
        <ExTable
          classes={classesTable}
          title="Kategóriák"
          items={categories}
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

        {category && (
          <CategoryEditor
            dialog
            rights={mapValues(rights, (right) => evalFnValue(right, category))}
            readOnly={false}
            category={category}
            onClose={this.onCategoryEditorClose}
            submitAction={saveCategory}
          />
        )}
      </div>
    );
  }
}

Categories.propTypes = {
  ...ReactRouterPropTypes.isRequired,
  categories: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  sort: SortPropType.isRequired,
  range: RangePropType.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortDirection: SortDirectionPropType.isRequired,
  rights: CategoryRightsPropType.isRequired,
};

const mapStateToProps = (state) => ({
  loadError: CategoriesSelectors.getLoadError(state),
  category: CategoriesSelectors.getCategory(state),
  categories: CategoriesSelectors.getCategories(state),
  total: CategoriesSelectors.getCategoriesTotal(state),
  sort: CategoriesSelectors.getSort(state),
  sortKey: CategoriesSelectors.getSortKey(state),
  sortDirection: CategoriesSelectors.getSortDirection(state),
  range: CategoriesSelectors.getRange(state),
  page: CategoriesSelectors.getPageNumber(state),
  rowsPerPage: CategoriesSelectors.getRowsPerPage(state),
  filter: CategoriesSelectors.getFilter(state),
  user: AppSelectors.getUser(state),
  rights: CategoriesSelectors.getRights(state),
});

const mapDispatchToProps = (dispatch) => ({
  resetCategory: () => dispatch(CategoriesActions.resetCategory()),
  loadCategory: (id) => dispatch(CategoriesActions.loadCategory(id)),
  loadCategories: ({ filter, sort, range }) => dispatch(CategoriesActions.loadCategories({ filter, sort, range })),
  deleteCategories: (categoryIds) => dispatch(CategoriesActions.deleteCategories(categoryIds)),
  createCategory: (userId) => dispatch(CategoriesActions.createCategory(userId)),
  saveCategory: (category) => dispatch(CategoriesActions.saveCategory(category)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Categories)));
