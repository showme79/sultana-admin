import { withStyles } from '@material-ui/core';
import clsx from 'clsx';
import { mapValues } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Action, Route } from 'consts';
import { PollRightsPropType, RangePropType, SortDirectionPropType, SortPropType } from 'consts/prop-types';
import { AddCircleIcon, DeleteIcon, EditIcon } from 'icons';
import { AppSelectors, PollsActions, PollsSelectors } from 'state';
import { evalFnValue } from 'utils';
import { Dialog } from 'view/base';
import { ExTable } from 'view/components';
import { PollEditor } from 'view/modules';

import Filter from './Filter';
import columns from './Polls.columns';
import styles from './Polls.styles';

class Polls extends Component {
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
    const { resetPoll } = this.props;
    resetPoll();
  }

  loadResources = (prevProps) => {
    const {
      sort,
      range,
      filter,
      createPoll,
      loadPolls,
      loadPoll,
      resetPoll,
      match: {
        params: { pollId },
      },
      user: { id: userId } = {},
    } = this.props;

    const { match: { params: { pollId: prevPollId = undefined } = {} } = {} } = prevProps || {};

    if (prevProps === null) {
      loadPolls({ sort, range, filter });
    }

    if (pollId !== prevPollId) {
      if (userId && +pollId === 0) {
        createPoll(userId);
      } else if (pollId) {
        loadPoll(pollId);
      } else {
        resetPoll();
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

  openPollEditor = (id) => {
    const { history } = this.props;
    return history.push(Route.polls.replace(':pollId?', id));
  };

  closePollEditor = () => {
    const { history } = this.props;
    return history.push(Route.polls.replace('/:pollId?', ''));
  };

  savePoll = (poll) => {
    const { savePoll } = this.props;
    return savePoll(poll);
  };

  submitPollAction = (poll) => this.savePoll(poll).then(() => this.closePollEditor());

  submitFilterService = (filter) => {
    const { sort, range, loadPolls } = this.props;
    return loadPolls({
      sort,
      filter,
      range: { ...range, offset: 0 },
    });
  };

  onSortChange = (sort) => {
    const { range, filters, loadPolls } = this.props;
    loadPolls({
      sort,
      filters,
      range: { ...range, offset: 0 },
    });
  };

  onItemActionClick = (action, poll /* , event */) => {
    const { id: actionId } = action;
    if (actionId === Action.DELETE) {
      return this.showDeleteConfirmDialog('Biztosan törölni szeretnéd a szavazást?', poll.id);
    }

    if (actionId === Action.EDIT) {
      return this.openPollEditor(poll.id);
    }

    return false;
  };

  onActionClick = (action, selected /* , event */) => {
    const { id: actionId } = action;
    if (actionId === Action.CREATE) {
      return this.openPollEditor(0);
    }

    if (actionId === Action.DELETE_SELECTED) {
      return this.showDeleteConfirmDialog(`Biztosan törölni szeretnéd a ${selected.length} darab szavazást?`, selected);
    }

    return false;
  };

  onDialogAction = (action /* , event */) => {
    const { id: actionId } = action;
    const {
      confirm: { context: id },
    } = this.state;
    const { deletePolls } = this.props;
    if (actionId === Action.CLOSE) {
      this.setState({ confirm: null });
    } else if (actionId === Action.DELETE) {
      // take care, this will handle both single and mulitple item deletion
      deletePolls(id).then(() => this.setState({ confirm: null, selected: [] }));
    }
  };

  onDialogClose = (/* event */) => this.setState({ confirm: null });

  onRowsPerPageChange = (rowsPerPage /* , event */) => {
    const { sort, filter, loadPolls } = this.props;
    const range = {
      offset: 0,
      limit: rowsPerPage,
    };
    loadPolls({ sort, filter, range });
  };

  onPageChange = (page /* , event */) => {
    const { sort, filter, rowsPerPage, loadPolls } = this.props;
    const range = {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    };
    loadPolls({ sort, filter, range });
  };

  onItemClick = (item) => this.openPollEditor(item.id);

  onItemSelect = (itemId /* , item, event */) => {
    const { selected } = this.state;
    const selectedIdx = selected.indexOf(itemId);
    this.setState({
      selected: selectedIdx < 0 ? [...selected, itemId] : selected.filter((id, idx) => selectedIdx !== idx),
    });
  };

  onSelectAll = (/* event */) => {
    const { selected } = this.state;
    const { polls } = this.props;
    this.setState({
      selected: selected.length === polls.length ? [] : polls.map((item) => item.id),
    });
  };

  onPollEditorClose = (/* event */) => this.closePollEditor();

  render() {
    const { classes, polls, sortKey, sortDirection, page, rights, filter, rowsPerPage, total, poll } = this.props;
    const { selected, confirm } = this.state;

    const itemActions = [
      {
        id: Action.EDIT,
        visible: rights.EDIT,
        tooltip: 'Szavazás szerkesztése',
        icon: <EditIcon />,
      },
      {
        id: Action.DELETE,
        visible: rights.DELETE,
        tooltip: 'Szavazás törlése',
        icon: <DeleteIcon />,
      },
    ];

    const selectActions = {
      id: Action.DELETE_SELECTED,
      visible: rights.DELETE,
      tooltip: 'Kijelölt szavazások törlése',
      icon: <DeleteIcon />,
    };

    const actions = {
      id: Action.CREATE,
      visible: rights.CREATE,
      icon: <AddCircleIcon />,
      text: 'Új szvazás',
      color: 'secondary',
    };

    const { content: confirmContent, actions: confirmActions } = confirm || {};

    const { table = '', row = '', column = '' } = classes;
    const classesTable = { table, row, column };

    return (
      <div className={clsx(classes.root)}>
        <ExTable
          classes={classesTable}
          title="Szavazások"
          items={polls}
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

        {poll && (
          <PollEditor
            poll={poll}
            rights={mapValues(rights, (right) => evalFnValue(right, poll))}
            onClose={this.onPollEditorClose}
            submitAction={this.submitPollAction}
          />
        )}
      </div>
    );
  }
}

Polls.propTypes = {
  ...ReactRouterPropTypes.isRequired,
  polls: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  sort: SortPropType.isRequired,
  range: RangePropType.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortDirection: SortDirectionPropType.isRequired,
  rights: PollRightsPropType.isRequired,
};

const mapStateToProps = (state) => ({
  poll: PollsSelectors.getPoll(state),
  polls: PollsSelectors.getPolls(state),
  total: PollsSelectors.getPollsTotal(state),
  sort: PollsSelectors.getSort(state),
  sortKey: PollsSelectors.getSortKey(state),
  sortDirection: PollsSelectors.getSortDirection(state),
  range: PollsSelectors.getRange(state),
  page: PollsSelectors.getPageNumber(state),
  rowsPerPage: PollsSelectors.getRowsPerPage(state),
  filter: PollsSelectors.getFilter(state),
  user: AppSelectors.getUser(state),
  rights: PollsSelectors.getRights(state),
});

const mapDispatchToProps = (dispatch) => ({
  resetPoll: () => dispatch(PollsActions.resetPoll()),
  loadPoll: (id) => dispatch(PollsActions.loadPoll(id)),
  loadPolls: ({ filter, sort, range }) => dispatch(PollsActions.loadPolls({ filter, sort, range })),
  deletePolls: (pollIds) => dispatch(PollsActions.deletePolls(pollIds)),
  createPoll: (userId) => dispatch(PollsActions.createPoll(userId)),
  savePoll: (poll) => dispatch(PollsActions.savePoll(poll)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Polls)));
