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
  SubscriptionPropType,
  SubscriptionRightsPropType,
  UserPropType,
} from 'consts/prop-types';
import { SubscriptionTypesProvider } from 'hooks';
import { AddCircleIcon, DeleteIcon, EditIcon, PlaylistAddIcon, SyncIcon } from 'icons';
import { AppSelectors, SubscriptionsActions, SubscriptionsSelectors } from 'state';
import { evalFnValue } from 'utils';
import { Dialog } from 'view/base';
import { ExTable } from 'view/components';
import { SubscriptionEditor } from 'view/modules';

import AddSubscriptionTypeDialog from './AddSubscriptionTypeDialog';
import Filter from './Filter';
import columns from './Subscriptions.columns';
import styles from './Subscriptions.styles';
import SyncDialog from './SyncDialog';

class Subscriptions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      confirm: null,
      showSyncDialog: false,
      showAddSubscriptionTypeDialog: false,
    };
  }

  componentDidMount() {
    this.loadResources(null);
  }

  componentDidUpdate(prevProps) {
    this.loadResources(prevProps);
  }

  componentWillUnmount() {
    const { resetSubscription } = this.props;
    resetSubscription();
  }

  loadResources = (prevProps) => {
    const {
      sort,
      range,
      filter,
      createSubscription,
      loadSubscriptions,
      loadSubscription,
      resetSubscription,
      match: {
        params: { subscriptionId },
      },
      user: { id: userId } = {},
    } = this.props;

    const { match: { params: { subscriptionId: prevSubscriptionId = undefined } = {} } = {} } = prevProps || {};

    if (prevProps === null) {
      loadSubscriptions({ sort, range, filter });
    }

    if (subscriptionId !== prevSubscriptionId) {
      if (userId && +subscriptionId === 0) {
        createSubscription(userId);
      } else if (subscriptionId) {
        loadSubscription(subscriptionId);
      } else {
        resetSubscription();
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

  openSubscriptionEditor = (id) => {
    const { history } = this.props;
    history.push(Route.subscriptions.replace(':subscriptionId?', id));
  };

  onSortChange = (sort) => {
    const { range, filter, loadSubscriptions } = this.props;
    loadSubscriptions({
      sort,
      filter,
      range: { ...range, offset: 0 },
    });
  };

  onItemActionClick = (action, item /* , event */) => {
    const { id: actionId } = action;
    if (actionId === Action.DELETE) {
      return this.showDeleteConfirmDialog('Biztosan törölni szeretnéd a feliratkozót?', item.id);
    }

    if (actionId === Action.EDIT) {
      return this.openSubscriptionEditor(item.id);
    }

    return false;
  };

  onActionClick = (action, selected /* , event */) => {
    const { id: actionId } = action;
    if (actionId === Action.CREATE) {
      return this.openSubscriptionEditor(0);
    }
    if (actionId === Action.DELETE) {
      return this.showDeleteConfirmDialog(
        `Biztosan törölni szeretnéd a ${selected.length} darab feliratkozót?`,
        selected,
      );
    }
    if (actionId === Action.SYNC) {
      return this.setState({ showSyncDialog: true });
    }
    if (actionId === Action.ADD) {
      return this.setState({ showAddSubscriptionTypeDialog: true });
    }
    return false;
  };

  onConfirmDialogAction = (action /* , event */) => {
    const { id: actionId } = action;
    const {
      confirm: { context: id },
    } = this.state;
    const { deleteSubscriptions } = this.props;
    if (actionId === Action.CLOSE) {
      this.setState({ confirm: null });
    } else if (actionId === Action.DELETE) {
      // take care, this will handle both single and mulitple item deletion
      deleteSubscriptions(id).then(() => this.setState({ confirm: null, selected: [] }));
    }
  };

  onConfirmDialogClose = (/* event */) => this.setState({ confirm: null });

  onSyncDialogClose = (/* event */) => this.setState({ showSyncDialog: false });

  onAddSubscriptionTypeDialogClose = (/* event */) => this.setState({ showAddSubscriptionTypeDialog: false });

  onRowsPerPageChange = (rowsPerPage /* , event */) => {
    const { sort, filter, loadSubscriptions } = this.props;
    const range = {
      offset: 0,
      limit: rowsPerPage,
    };
    loadSubscriptions({ sort, range, filter });
  };

  onPageChange = (page /* , event */) => {
    const { sort, filter, rowsPerPage, loadSubscriptions } = this.props;
    const range = {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    };
    loadSubscriptions({ sort, range, filter });
  };

  onItemClick = (item) => this.openSubscriptionEditor(item.id);

  onItemSelect = (itemId /* , item, event */) => {
    const { selected } = this.state;
    const selectedIdx = selected.indexOf(itemId);
    this.setState({
      selected: selectedIdx < 0 ? [...selected, itemId] : selected.filter((id, idx) => selectedIdx !== idx),
    });
  };

  onSelectAll = (/* event */) => {
    const { selected } = this.state;
    const { subscriptions } = this.props;
    this.setState({
      selected: selected.length === subscriptions.length ? [] : subscriptions.map((item) => item.id),
    });
  };

  onSubscriptionEditorClose = (/* post, event */) => {
    const { history } = this.props;
    history.push(Route.subscriptions.replace('/:subscriptionId?', ''));
  };

  submitFilterService = (filter) => {
    const { sort, range, loadSubscriptions } = this.props;
    return loadSubscriptions({
      sort,
      filter,
      range: { ...range, offset: 0 },
    });
  };

  render() {
    const {
      classes,
      subscription,
      subscriptions,
      sortKey,
      sortDirection,
      filter,
      page,
      rights,
      rowsPerPage,
      total,
      saveSubscription,
    } = this.props;
    const { confirm, selected, showAddSubscriptionTypeDialog, showSyncDialog } = this.state;

    const itemActions = [
      {
        id: Action.EDIT,
        visible: rights.EDIT,
        tooltip: 'Feliratkozó szerkesztése',
        icon: <EditIcon />,
      },
      {
        id: Action.DELETE,
        visible: rights.DELETE,
        tooltip: 'Feliratkozó törlése',
        icon: <DeleteIcon />,
      },
    ];

    const selectActions = {
      id: Action.DELETE,
      visible: rights.DELETE_SELECTED,
      tooltip: 'Kijelölt feliratkozó(k) törlése',
      icon: <DeleteIcon />,
    };

    const actions = [
      {
        id: Action.ADD,
        visible: rights.ADD,
        icon: <PlaylistAddIcon />,
        text: 'Új típus',
        color: 'secondary',
      },
      {
        id: Action.SYNC,
        visible: rights.SYNC,
        icon: <SyncIcon />,
        text: 'Szinkronizálás',
        color: 'secondary',
      },
      {
        id: Action.CREATE,
        visible: rights.CREATE,
        icon: <AddCircleIcon />,
        text: 'Új feliratkozó',
        color: 'secondary',
      },
    ];

    const { content: confirmContent, actions: confirmActions } = confirm || {};

    const { table = '', row = '', column = '' } = classes;
    const classesTable = { table, row, column };

    return (
      <SubscriptionTypesProvider>
        <div className={clsx(classes.root)}>
          <ExTable
            classes={classesTable}
            title="Feliratkozások"
            items={subscriptions}
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
            onClose={this.onConfirmDialogClose}
            onAction={this.onConfirmDialogAction}
          />

          <SyncDialog open={showSyncDialog} onClose={this.onSyncDialogClose} />
          <AddSubscriptionTypeDialog
            open={showAddSubscriptionTypeDialog}
            onClose={this.onAddSubscriptionTypeDialogClose}
          />

          {subscription && (
            <SubscriptionEditor
              subscription={subscription}
              rights={mapValues(rights, (right) => evalFnValue(right, subscription))}
              onClose={this.onSubscriptionEditorClose}
              submitAction={saveSubscription}
            />
          )}
        </div>
      </SubscriptionTypesProvider>
    );
  }
}

Subscriptions.propTypes = {
  ...ReactRouterPropTypes.isRequired,
  classes: PropTypes.shape({}).isRequired,
  subscription: SubscriptionPropType,
  subscriptions: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  range: RangePropType.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  sort: SortPropType.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortDirection: SortDirectionPropType.isRequired,
  rights: SubscriptionRightsPropType.isRequired,
  createSubscription: PropTypes.func.isRequired,
  loadSubscription: PropTypes.func.isRequired,
  loadSubscriptions: PropTypes.func.isRequired,
  saveSubscription: PropTypes.func.isRequired,
  deleteSubscriptions: PropTypes.func.isRequired,
  resetSubscription: PropTypes.func.isRequired,
  filter: PropTypes.shape({}),
  total: PropTypes.number,
  user: UserPropType,
};

Subscriptions.defaultProps = {
  subscription: undefined,
  total: undefined,
  user: undefined,
  filter: undefined,
};

const mapStateToProps = (state) => ({
  subscription: SubscriptionsSelectors.getSubscription(state),
  subscriptions: SubscriptionsSelectors.getSubscriptions(state),
  total: SubscriptionsSelectors.getSubscriptionsTotal(state),
  sort: SubscriptionsSelectors.getSort(state),
  sortKey: SubscriptionsSelectors.getSortKey(state),
  sortDirection: SubscriptionsSelectors.getSortDirection(state),
  range: SubscriptionsSelectors.getRange(state),
  page: SubscriptionsSelectors.getPageNumber(state),
  rowsPerPage: SubscriptionsSelectors.getRowsPerPage(state),
  filter: SubscriptionsSelectors.getFilter(state),
  rights: SubscriptionsSelectors.getRights(state),
  user: AppSelectors.getUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  resetSubscription: () => dispatch(SubscriptionsActions.resetSubscription()),
  loadSubscription: (id) => dispatch(SubscriptionsActions.loadSubscription(id)),
  loadSubscriptions: ({ filter, sort, range }) =>
    dispatch(SubscriptionsActions.loadSubscriptions({ filter, sort, range })),
  deleteSubscriptions: (SubscriptionIds) => dispatch(SubscriptionsActions.deleteSubscriptions(SubscriptionIds)),
  createSubscription: (userId) => dispatch(SubscriptionsActions.createSubscription(userId)),
  saveSubscription: (Subscription) => dispatch(SubscriptionsActions.saveSubscription(Subscription)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Subscriptions)));
