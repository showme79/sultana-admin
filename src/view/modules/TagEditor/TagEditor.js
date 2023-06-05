import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  TextField as MuiTextField,
  withStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import { Field, Formik } from 'formik';
import { Switch, TextField } from 'formik-material-ui';
import { find, isArray, kebabCase, map, memoize } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { useSelector } from 'react-redux';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Action, RealSegment, TagStatus, fieldProps as defaultFieldProps } from 'consts';
import { TagRightsPropType } from 'consts/prop-types';
import { SaveIcon } from 'icons';
import { TagStatusText } from 'lang/hu';
import { AppSelectors } from 'state';
import { mapApiErrorsToFormErrors, mapCheckboxToItems, mapItemsToCheckbox } from 'utils';
import { CheckboxGroupField } from 'view/base';
import { ModalEditor } from 'view/components';

import styles from './TagEditor.styles';

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

class TagEditor extends Component {
  getInitialValues = memoize(({ name, status, segments, ...tagProps }) => ({
    ...tagProps,
    name: name || '',
    status: status || TagStatus.NOT_APPROVED,
    segments: mapItemsToCheckbox(segments, RealSegment, RealSegment),
    slugEditable: !!name && tagProps.slug !== kebabCase(name),
  }));

  renderStatus = ({ field, form, ...props }) => {
    const statuses = map(TagStatus, (status) => ({ id: status, name: TagStatusText[status] }));
    const { classes } = this.props;
    const id = `id-${field.name}`;

    return (
      <FormControl className={clsx(classes.formControl)} disabled={props.disabled} fullWidth>
        <InputLabel htmlFor={id}>Állapot</InputLabel>
        <MuiSelect {...field} {...props} inputProps={{ id, name: field.name }}>
          {statuses.map((status) => (
            <MenuItem key={status.id} value={status.id}>
              {status.name}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    );
  };

  onDialogClose = (event) => {
    const { onClose } = this.props;
    onClose(event);
  };

  onFormSubmit = (values, { setSubmitting, setErrors }) => {
    const { submitAction } = this.props;
    const { slug, slugEditable, segments, ...saveValues } = values;

    submitAction({
      ...saveValues,
      segments: mapCheckboxToItems(segments).join(','),
      slug: slugEditable ? slug : kebabCase(saveValues.name),
    })
      .then(() => setSubmitting(false))
      .catch(({ response: { data = null } = {} } = {}) => {
        setSubmitting(false);
        setErrors(mapApiErrorsToFormErrors(data));
      });
  };

  renderEditor = (form) => {
    const {
      isSubmitting,
      values: { slugEditable, name },
    } = form;
    const { classes, rights } = this.props;

    const fieldProps = {
      ...defaultFieldProps,
      disabled: (!rights.EDIT && !rights.CREATE) || isSubmitting,
    };

    const slugFieldProps = {
      ...fieldProps,
      InputProps: { className: classes.slugFormControl },
      name: 'slug',
      label: 'URL részlet',
      placeholder: 'A bejegyzéshez tartozó URL részlet...',
      disabled: !rights.EDIT || !slugEditable,
      required: true,
    };

    const { segmentGroupItems } = useSelector(AppSelectors.getSegmentsInfo);

    return (
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field component={TextField} name="name" label="Név" placeholder="Tag neve..." {...fieldProps} required />
            </Grid>
            <Grid item xs={12} className={classes.slugGrid}>
              <Field
                component={Switch}
                name="slugEditable"
                type="checkbox"
                title="Egyedi URL engedélyezése"
                disabled={!rights.EDIT}
              />
              {slugEditable ? (
                <Field component={TextField} value="123" {...slugFieldProps} />
              ) : (
                <MuiTextField value={kebabCase(name)} {...slugFieldProps} />
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field name="status" disabled={!rights.SET_STATUS}>
                {this.renderStatus}
              </Field>
            </Grid>
            <Grid item xs={12}>
              <CheckboxGroupField label="Szegmensek" items={segmentGroupItems} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderForm = (form) => {
    const { classes, tag, rights } = this.props;
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
        title={tag && tag.id ? `Tag szerkesztése: ${tag.name}` : 'Új tag'}
        onClose={this.onDialogClose}
        titleActions={actions}
        onActionClick={onActionClick}
      >
        {this.renderEditor(form)}
      </ModalEditor>
    );
  };

  render() {
    const { tag } = this.props;

    return (
      <Formik initialValues={this.getInitialValues(tag)} validate={validate} onSubmit={this.onFormSubmit}>
        {this.renderForm}
      </Formik>
    );
  }
}

TagEditor.propTypes = {
  ...ReactRouterPropTypes.isRequired,
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  tag: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  submitAction: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  rights: TagRightsPropType.isRequired,
};

TagEditor.defaultProps = {
  tag: null,
  submitAction: undefined,
};

export default withStyles(styles)(TagEditor);
