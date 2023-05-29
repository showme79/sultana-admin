import { withStyles } from '@material-ui/core';
import clsx from 'clsx';
import { kebabCase, mapValues, memoize } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Action, PostStatus, Route } from 'consts';
import {
  PostRightsPropType,
  RangePropType,
  SortDirectionPropType,
  SortPropType,
  UserPropType,
} from 'consts/prop-types';
import { AddCircleIcon, DeleteIcon, DoneIcon, EditIcon, LockOpenIcon, UndoIcon } from 'icons';
import { AppSelectors, PostsActions, PostsSelectors } from 'state';
import { evalFnValue } from 'utils';
import { Dialog } from 'view/base';
import { ExTable } from 'view/components';
import { PostEditor } from 'view/modules';

import Filter from './Filter';
import columns from './Posts.columns';
import styles from './Posts.styles';

const getRowClassName = ({ status }) => `row-status-${kebabCase(status)}`;

class Posts extends Component {
  createItemActions = memoize((rights) => [
    {
      id: Action.UNLOCK,
      visible: rights.UNLOCK,
      tooltip: 'Zárolás feloldása',
      icon: <LockOpenIcon fontSize="small" />,
    },
    {
      id: Action.EDIT,
      visible: rights.EDIT,
      tooltip: 'Bejegyzés szerkesztése',
      icon: <EditIcon fontSize="small" />,
    },
    {
      id: Action.APPROVE,
      visible: rights.SET_STATUS_APPROVED,
      tooltip: (item) => (item.status === PostStatus.APPROVED ? 'Visszavonás' : 'Jóváhagyás'),
      // eslint-disable-next-line react/no-unstable-nested-components
      icon: (item) =>
        item.status === PostStatus.APPROVED ? <UndoIcon fontSize="small" /> : <DoneIcon fontSize="small" />,
    },
    {
      id: Action.DELETE,
      visible: rights.DELETE,
      tooltip: 'Bejegyzés törlése',
      icon: <DeleteIcon fontSize="small" />,
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
    const { resetPost } = this.props;
    resetPost();
  }

  loadResources = (prevProps) => {
    const {
      sort,
      range,
      filter,
      search,
      createPost,
      loadPost,
      loadPosts,
      lockPost,
      resetPost,
      match: {
        params: { postId },
      },
      user: { id: userId } = {},
    } = this.props;

    if (!userId) {
      return;
    }

    const { match: { params: { postId: prevPostId = undefined } = {} } = {} } = prevProps || {};

    if (prevProps === null) {
      loadPosts({
        sort,
        range,
        filter,
        search,
      });
    }

    if (postId !== prevPostId) {
      if (userId && +postId === 0) {
        createPost(userId);
      } else if (postId) {
        lockPost(postId).catch(() => loadPost(postId).catch(() => this.closePostEditor()));
      } else {
        resetPost();
        // reload posts when url changed and editor is closed
        // loadPosts({ sort, range, filter, search });
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

  openPostEditor = (id) => {
    const { history } = this.props;
    history.push(Route.posts.replace(':postId?', id));
  };

  closePostEditor = () => {
    const { history } = this.props;
    history.push(Route.posts.replace('/:postId?', ''));
  };

  savePost = (post, originalPost, { /* action, */ unlock }) => {
    const { savePost } = this.props;

    return savePost(post, unlock).then(() => {
      if (
        post.priority === originalPost.priority &&
        post.segment === originalPost.segment &&
        post.status === originalPost.status
      ) {
        return;
      }

      const { sort, range, filter, search, loadPosts } = this.props;

      loadPosts({
        sort,
        range,
        filter,
        search,
      });
    });
  };

  onSortChange = (sort) => {
    const { filter, range, search, loadPosts } = this.props;

    loadPosts({
      sort,
      filter,
      search,
      range: { ...range, offset: 0 },
    });
  };

  onItemActionClick = (action, post /* , event */) => {
    const { id: actionId } = action;
    if (actionId === Action.DELETE) {
      return this.showDeleteConfirmDialog('Biztosan törölni szeretnéd a bejegyzést?', post.id);
    }

    if (actionId === Action.EDIT) {
      return this.openPostEditor(post.id);
    }

    if (actionId === Action.UNLOCK) {
      const { unlockPost } = this.props;
      return unlockPost(post.id);
    }

    if (actionId === Action.APPROVE) {
      return this.savePost(
        {
          ...post,
          status: post.status === PostStatus.APPROVED ? PostStatus.NOT_APPROVED : PostStatus.APPROVED,
        },
        null,
        { unlock: true },
      );
    }

    return false;
  };

  onActionClick = (action, selected /* , event */) => {
    const { id: actionId } = action;
    if (actionId === Action.CREATE) {
      return this.openPostEditor(0);
    }

    if (actionId === Action.DELETE) {
      return this.showDeleteConfirmDialog(
        `Biztosan törölni szeretnéd a ${selected.length} darab bejegyzést?`,
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
    const { deletePosts } = this.props;
    if (actionId === Action.CLOSE) {
      this.setState({ confirm: null });
    } else if (actionId === Action.DELETE) {
      // take care, this will handle both single and mulitple post deletion
      deletePosts(id).then(() => this.setState({ confirm: null, selected: [] }));
    }
  };

  onDialogClose = (/* event */) => this.setState({ confirm: null });

  onRowsPerPageChange = (rowsPerPage /* , event */) => {
    const { sort, filter, search, loadPosts } = this.props;
    const range = {
      offset: 0,
      limit: rowsPerPage,
    };
    loadPosts({
      sort,
      range,
      filter,
      search,
    });
  };

  onPageChange = (page /* , event */) => {
    const { sort, filter, search, rowsPerPage, loadPosts } = this.props;
    const range = {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    };
    loadPosts({
      sort,
      range,
      filter,
      search,
    });
  };

  onItemClick = (item) => this.openPostEditor(item.id);

  onItemSelect = (itemId /* , item, event */) => {
    const { selected } = this.state;
    const selectedIdx = selected.indexOf(itemId);
    this.setState({
      selected: selectedIdx < 0 ? [...selected, itemId] : selected.filter((id, idx) => selectedIdx !== idx),
    });
  };

  onSelectAll = (/* event */) => {
    const { selected } = this.state;
    const { posts } = this.props;
    this.setState({
      selected: selected.length === posts.length ? [] : posts.map((item) => item.id),
    });
  };

  onPostEditorClose = (/* event */) => this.closePostEditor();

  submitFilterService = ({ search, ...filter }) => {
    const { sort, range, loadPosts } = this.props;
    return loadPosts({
      sort,
      filter,
      search,
      range: { ...range, offset: 0 },
    });
  };

  render() {
    const { classes, posts, sortKey, sortDirection, page, rowsPerPage, total, post, filter, search, rights } =
      this.props;
    const { selected, confirm } = this.state;

    if (!rights.VIEW) {
      return '';
    }

    const itemActions = this.createItemActions(rights);

    const selectActions = {
      id: Action.DELETE,
      visible: rights.DELETE_SELECTED,
      tooltip: 'Kijelölt bejegyzés(ek) törlése',
      icon: <DeleteIcon />,
    };

    const actions = {
      id: Action.CREATE,
      visible: rights.CREATE,
      icon: <AddCircleIcon />,
      text: 'Új bejegyzés',
      color: 'secondary',
    };

    const { content: confirmContent, actions: confirmActions } = confirm || {};

    const { table = '', row = '', column = '' } = classes;
    const tableClasses = { table, row, column };

    return (
      <div className={clsx(classes.root)}>
        <ExTable
          classes={tableClasses}
          title="Bejegyzések"
          items={posts}
          total={total}
          columns={columns}
          sortKey={sortKey}
          sortDirection={sortDirection}
          filter={
            <Filter className={classes.filter} filter={filter} search={search} service={this.submitFilterService} />
          }
          itemActions={itemActions}
          selectActions={selectActions}
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
          TableRowProps={{ getRowClassName }}
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

        {post && (
          <PostEditor
            post={post}
            onClose={this.onPostEditorClose}
            rights={mapValues(rights, (right) => evalFnValue(right, post))}
            submitAction={this.savePost}
          />
        )}
      </div>
    );
  }
}

Posts.propTypes = {
  ...ReactRouterPropTypes.isRequired,
  user: UserPropType,
  posts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sort: SortPropType.isRequired,
  range: RangePropType.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortDirection: SortDirectionPropType.isRequired,
  rights: PostRightsPropType.isRequired,
  filter: PropTypes.shape({}),
};

Posts.defaultProps = {
  user: undefined,
  filter: undefined,
};

const mapStateToProps = (state) => ({
  loadError: PostsSelectors.getLoadError(state),
  post: PostsSelectors.getPost(state),
  posts: PostsSelectors.getPosts(state),
  total: PostsSelectors.getPostsTotal(state),
  sort: PostsSelectors.getSort(state),
  sortKey: PostsSelectors.getSortKey(state),
  sortDirection: PostsSelectors.getSortDirection(state),
  range: PostsSelectors.getRange(state),
  page: PostsSelectors.getPageNumber(state),
  rowsPerPage: PostsSelectors.getRowsPerPage(state),
  filter: PostsSelectors.getFilter(state),
  search: PostsSelectors.getSearch(state),
  rights: PostsSelectors.getRights(state),
  user: AppSelectors.getUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  resetPost: () => dispatch(PostsActions.resetPost()),
  createPost: (userId) => dispatch(PostsActions.createPost(userId)),
  loadPost: (id) => dispatch(PostsActions.loadPost(id)),
  lockPost: (id) => dispatch(PostsActions.lockPost(id)),
  unlockPost: (id) => dispatch(PostsActions.unlockPost(id)),
  loadPosts: ({ search, filter, sort, range }) =>
    dispatch(
      PostsActions.loadPosts({
        search,
        filter,
        sort,
        range,
      }),
    ),
  deletePosts: (postIds) => dispatch(PostsActions.deletePosts(postIds)),
  savePost: (post, unlock) => dispatch(PostsActions.savePost(post, unlock)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Posts)));
