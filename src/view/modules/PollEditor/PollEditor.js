import { Grid, withStyles } from '@material-ui/core';
import clsx from 'clsx';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { find, isArray, isString, memoize } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Action, SortDirection, fieldProps as defaultFieldProps } from 'consts';
import { TagRightsPropType } from 'consts/prop-types';
import { SaveIcon } from 'icons';
import { PostStatusText } from 'lang/hu';
import services from 'services';
import { mapApiErrorsToFormErrors } from 'utils';
import { DateTimePicker } from 'view/base';
import { CreatedColumn, PostTitleColumn, SimpleColumn, StatusColumn } from 'view/base/columns';
import { ExTable, ModalEditor } from 'view/components';

import styles from './PollEditor.styles';

const sortPosts = (posts, { key, direction }) => {
  const dir = direction === SortDirection.ASC ? 1 : -1;
  return (
    posts &&
    posts.sort((postA, postB) => {
      const [valueA, valueB] = [postA[key], postB[key]];
      if (isString(valueA)) {
        return dir * valueA.localeCompare(valueB);
      }
      return dir * ((valueA > valueB && 1) || (valueA < valueB && -1) || 0);
    })
  );
};

const columns = [
  {
    id: 'title',
    label: 'Cím',
    padding: 'none',
    Cell: PostTitleColumn,
  },
  {
    id: 'status',
    label: 'Állapot',
    padding: 'none',
    Cell: StatusColumn(PostStatusText),
    sortable: 'approvedAt',
  },
  {
    id: 'voteCount',
    label: 'Szavazat',
    padding: 'normal',
    Cell: SimpleColumn,
    align: 'right',
  },
  {
    id: 'created',
    label: 'Létrehozva',
    padding: 'none',
    Cell: CreatedColumn,
    sortable: 'createdAt',
  },
];

const validate = (values /* , formikProps */) => {
  const { name } = values;

  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'A mező megadása kötelező!';
  }

  return errors;
};

const hasError = (errors) => !!find(errors, (error) => (isArray(error) ? error.length : true));

const onActionClick = (action /* , context, event */) => {
  if (action.id === Action.SUBMIT) {
    return action.submit();
  }
  return undefined;
};

class PollEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: undefined,
      postSort: {
        key: 'title',
        direction: SortDirection.ASC,
      },
    };
  }

  componentDidMount() {
    const {
      poll: { id: pollId },
    } = this.props;
    if (pollId) {
      services.getPostsByPollId({ pollId }, { progress: false }).then(({ data: { posts = [] } = {} } = {}) => {
        this.setState((prevState) => ({
          ...prevState,
          posts: sortPosts(posts, prevState.postSort),
        }));
      });
    }
  }

  onPostSortChange = (sort) => {
    this.setState((prevState) => ({
      ...prevState,
      postSort: sort,
      posts: sortPosts(prevState.posts, sort),
    }));
  };

  getInitialValues = memoize(({ name, status, ...pollProps }) => ({
    ...pollProps,
    name: name || '',
  }));

  onDialogClose = (event) => {
    const onClose = this.props;
    return onClose?.(event);
  };

  onFormSubmit = (values, { setSubmitting, setErrors }) => {
    const { submitAction } = this.props;
    const { slug, segments, ...saveValues } = values;

    submitAction({
      ...saveValues,
    })
      .then(() => setSubmitting(false))
      .catch(({ response: { data = null } = {} } = {}) => {
        setSubmitting(false);
        setErrors(mapApiErrorsToFormErrors(data));
      });
  };

  renderEditor = (form) => {
    const { isSubmitting } = form;
    const { classes, rights } = this.props;
    const { posts, postSort } = this.state;

    const fieldProps = {
      ...defaultFieldProps,
      disabled: (!rights.EDIT && !rights.CREATE) || isSubmitting,
    };

    return (
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="name"
                label="Név"
                placeholder="Szavazás neve..."
                {...fieldProps}
                required
              />
            </Grid>
            {posts && (
              <Grid item xs={12}>
                <ExTable
                  className={classes.postsTable}
                  title={`Cikkek (${posts.length} darab)`}
                  items={posts}
                  total={posts.length}
                  columns={columns}
                  sortKey={postSort.key}
                  sortDirection={postSort.direction}
                  onSortChange={this.onPostSortChange}
                  rowsPerPage={posts.length}
                />
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field
                component={DateTimePicker}
                inline
                name="startDate"
                label="Szavazás kezdete"
                required
                invalidDateMessage="Hibás formátum (pl.: 2019.12.27 13:45)!"
                {...fieldProps}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={DateTimePicker}
                inline
                name="endDate"
                label="Szavazás vége"
                required
                invalidDateMessage="Hibás formátum (pl.: 2019.12.27 13:45)!"
                {...fieldProps}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderForm = (form) => {
    const { classes, poll, rights } = this.props;
    const { /* values, */ isSubmitting, errors, handleSubmit } = form;

    const allowSubmit = (rights.EDIT || rights.CREATE) && !isSubmitting && !hasError(errors);
    const actions = {
      id: Action.SUBMIT,
      visible: true,
      disabled: !allowSubmit,
      icon: <SaveIcon />,
      text: 'Mentés',
      color: 'secondary',
      submit: handleSubmit,
    };

    const modalEditorClasses = {
      root: clsx(classes.modal),
      closeButton: clsx(classes.modalCloseButton),
      dialogTitle: clsx(classes.modalDialogTitle),
      dialogContent: clsx(classes.modalDialogContent),
      dialogActions: clsx(classes.modalDialogActions),
    };

    return (
      <ModalEditor
        onSubmit={handleSubmit}
        classes={modalEditorClasses}
        title={poll && poll.id ? `Szavazás szerkesztése: ${poll.name}` : 'Új szavazás'}
        onClose={this.onDialogClose}
        titleActions={actions}
        onActionClick={onActionClick}
      >
        {this.renderEditor(form)}
      </ModalEditor>
    );
  };

  render() {
    const { poll } = this.props;
    return (
      <Formik initialValues={this.getInitialValues(poll)} validate={validate} onSubmit={this.onFormSubmit}>
        {this.renderForm}
      </Formik>
    );
  }
}

PollEditor.propTypes = {
  ...ReactRouterPropTypes.isRequired,
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  poll: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  submitAction: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  rights: TagRightsPropType.isRequired,
};

PollEditor.defaultProps = {
  poll: null,
  submitAction: undefined,
};

export default withStyles(styles)(PollEditor);
