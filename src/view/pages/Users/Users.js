import { withStyles } from '@material-ui/core';
import clsx from 'clsx';
import { mapValues } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Action, Route } from 'consts';
import {
  RangePropType,
  SortDirectionPropType,
  SortPropType,
  UserPropType,
  UserRightsPropType,
} from 'consts/prop-types';
import { AddCircleIcon, DeleteIcon, EditIcon } from 'icons';
import { AppSelectors, UsersActions, UsersSelectors } from 'state';
import { evalFnValue } from 'utils';
import { Dialog } from 'view/base';
import { ExTable } from 'view/components';
import { UserEditor } from 'view/modules';

import Filter from './Filter';
import columns from './Users.columns';
import styles from './Users.styles';

class Users extends Component {
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
    const { resetUser } = this.props;
    resetUser();
  }

  loadResources = (prevProps) => {
    const {
      sort,
      range,
      filter,
      createUser,
      loadUsers,
      loadUser,
      resetUser,
      match: {
        params: { userId },
      },
      user: { id: loggedUserId } = {},
    } = this.props;

    const { match: { params: { userId: prevUserId = undefined } = {} } = {} } = prevProps || {};

    if (prevProps === null) {
      loadUsers({ sort, range, filter });
    }

    if (userId !== prevUserId) {
      if (loggedUserId && +userId === 0) {
        createUser(loggedUserId);
      } else if (userId) {
        loadUser(userId);
      } else {
        resetUser();
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

  openUserEditor = (id) => {
    const { history } = this.props;
    return history.push(Route.users.replace(':userId?', id));
  };

  onSortChange = (sort) => {
    const { range, filter, loadUsers } = this.props;
    loadUsers({
      sort,
      filter,
      range: { ...range, offset: 0 },
    });
  };

  onItemActionClick = (action, item /* , event */) => {
    const { id: actionId } = action;
    if (actionId === Action.DELETE) {
      return this.showDeleteConfirmDialog('Biztosan törölni szeretnéd a felhasználót?', item.id);
    }

    if (actionId === Action.EDIT) {
      return this.openUserEditor(item.id);
    }

    return false;
  };

  onActionClick = (action, selected /* , event */) => {
    const { id: actionId } = action;
    if (actionId === Action.CREATE) {
      return this.openUserEditor(0);
    }
    if (actionId === Action.DELETE) {
      return this.showDeleteConfirmDialog(
        `Biztosan törölni szeretnéd a ${selected.length} darab felhasználót?`,
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
    const { deleteUsers } = this.props;
    if (actionId === Action.CLOSE) {
      this.setState({ confirm: null });
    } else if (actionId === Action.DELETE) {
      // take care, this will handle both single and mulitple item deletion
      deleteUsers(id).then(() => this.setState({ confirm: null, selected: [] }));
    }
  };

  onDialogClose = (/* event */) => this.setState({ confirm: null });

  onRowsPerPageChange = (rowsPerPage /* , event */) => {
    const { sort, filter, loadUsers } = this.props;
    const range = {
      offset: 0,
      limit: rowsPerPage,
    };
    loadUsers({ sort, range, filter });
  };

  onPageChange = (page /* , event */) => {
    const { sort, filter, rowsPerPage, loadUsers } = this.props;
    const range = {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    };
    loadUsers({ sort, range, filter });
  };

  onItemClick = (item) => this.openUserEditor(item.id);

  onItemSelect = (itemId /* , item, event */) => {
    const { selected } = this.state;
    const selectedIdx = selected.indexOf(itemId);
    this.setState({
      selected: selectedIdx < 0 ? [...selected, itemId] : selected.filter((id, idx) => selectedIdx !== idx),
    });
  };

  onSelectAll = (/* event */) => {
    const { selected } = this.state;
    const { users } = this.props;
    this.setState({
      selected: selected.length === users.length ? [] : users.map((item) => item.id),
    });
  };

  onUserEditorClose = (/* post, event */) => {
    const { history } = this.props;
    return history.push(Route.users.replace('/:userId?', ''));
  };

  submitFilterService = (filter) => {
    const { sort, range, loadUsers } = this.props;
    return loadUsers({
      sort,
      filter,
      range: { ...range, offset: 0 },
    });
  };

  render() {
    const { classes, users, sortKey, sortDirection, filter, page, rights, rowsPerPage, total, editedUser, saveUser } =
      this.props;
    const { selected, confirm } = this.state;

    const itemActions = [
      {
        id: Action.EDIT,
        visible: rights.EDIT,
        tooltip: 'Felhasználó szerkesztése',
        icon: <EditIcon />,
      },
      {
        id: Action.DELETE,
        visible: rights.DELETE,
        tooltip: 'Felhasználó törlése',
        icon: <DeleteIcon />,
      },
    ];

    const selectActions = {
      id: Action.DELETE,
      visible: rights.DELETE_SELECTED,
      tooltip: 'Kijelölt felhasználó(k) törlése',
      icon: <DeleteIcon />,
    };

    const actions = {
      id: Action.CREATE,
      visible: rights.CREATE,
      icon: <AddCircleIcon />,
      text: 'Új felhasználó',
      color: 'secondary',
    };

    const { content: confirmContent, actions: confirmActions } = confirm || {};

    const { table = '', row = '', column = '' } = classes;
    const classesTable = { table, row, column };

    return (
      <div className={clsx(classes.root)}>
        <ExTable
          classes={classesTable}
          title="Felhasználók"
          items={users}
          total={total}
          columns={columns}
          sortKey={sortKey}
          sortDirection={sortDirection}
          itemActions={itemActions}
          selectActions={selectActions}
          filter={<Filter filter={filter} service={this.submitFilterService} />}
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

        {editedUser && (
          <UserEditor
            user={editedUser}
            rights={mapValues(rights, (right) => evalFnValue(right, editedUser))}
            onClose={this.onUserEditorClose}
            submitAction={saveUser}
          />
        )}
      </div>
    );
  }
}

Users.propTypes = {
  ...ReactRouterPropTypes.isRequired,
  classes: PropTypes.shape({}).isRequired,
  user: UserPropType,
  users: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  range: RangePropType.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  sort: SortPropType.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortDirection: SortDirectionPropType.isRequired,
  rights: UserRightsPropType.isRequired,
  createUser: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,
  loadUsers: PropTypes.func.isRequired,
  saveUser: PropTypes.func.isRequired,
  deleteUsers: PropTypes.func.isRequired,
  resetUser: PropTypes.func.isRequired,
  filter: PropTypes.shape({}),
  total: PropTypes.number,
  editedUser: UserPropType,
};

Users.defaultProps = {
  user: undefined,
  total: undefined,
  editedUser: undefined,
  filter: undefined,
};
const mapStateToProps = (state) => ({
  editedUser: UsersSelectors.getUser(state),
  users: UsersSelectors.getUsers(state),
  total: UsersSelectors.getUsersTotal(state),
  sort: UsersSelectors.getSort(state),
  sortKey: UsersSelectors.getSortKey(state),
  sortDirection: UsersSelectors.getSortDirection(state),
  range: UsersSelectors.getRange(state),
  page: UsersSelectors.getPageNumber(state),
  rowsPerPage: UsersSelectors.getRowsPerPage(state),
  filter: UsersSelectors.getFilter(state),
  rights: UsersSelectors.getRights(state),
  user: AppSelectors.getUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  resetUser: () => dispatch(UsersActions.resetUser()),
  loadUser: (id) => dispatch(UsersActions.loadUser(id)),
  loadUsers: ({ filter, sort, range }) => dispatch(UsersActions.loadUsers({ filter, sort, range })),
  deleteUsers: (userIds) => dispatch(UsersActions.deleteUsers(userIds)),
  createUser: (userId) => dispatch(UsersActions.createUser(userId)),
  saveUser: (user) => dispatch(UsersActions.saveUser(user)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Users)));
