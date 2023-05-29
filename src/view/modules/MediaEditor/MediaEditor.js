import { Grid, TextField as MuiTextField, withStyles } from '@material-ui/core';
import clsx from 'clsx';
import { Field, Formik } from 'formik';
import { Switch, TextField } from 'formik-material-ui';
import { each, find, isArray, kebabCase, mapValues, memoize } from 'lodash-es';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Action, fieldProps as defaultFieldProps } from 'consts';
import { SaveIcon } from 'icons';
import { getMediaUrl, mapApiErrorsToFormErrors } from 'utils';
import MediaUploadField from 'view/components/MediaUploadField/MediaUploadField';
import ModalEditor from 'view/components/ModalEditor/ModalEditor';

import styles from './MediaEditor.styles';

const onActionClick = (action /* , context, event */) => {
  if (action.id === Action.SUBMIT) {
    return false;
    // return action.submit();
  }
  return undefined;
};

const validate = (values /* , formikProps */) => {
  const { title } = values;

  const errors = {};

  if (!title || !title.trim()) {
    errors.title = 'A mező megadása kötelező!';
  }

  return errors;
};

const hasError = (errors) => !!find(errors, (error) => (isArray(error) ? error.length : true));

class MediaEditor extends Component {
  getInitialValues = memoize((media) => {
    const { id, type, title, description, source, creator, creationDate, ...mediaProps } = media;
    return {
      ...mediaProps,
      id,
      type,
      title: title || '',
      description: description || '',
      source: source || '',
      creator: creator || '',
      creationDate: (creationDate && DateTime.fromISO(creationDate)) || null,
      file: id ? getMediaUrl(media) : null,
      slugEditable: !!title && mediaProps.slug !== kebabCase(title),
    };
  });

  onDialogClose = (event) => {
    const { onClose } = this.props;
    return onClose?.(event);
  };

  onFormSubmit = (values, { setSubmitting, setErrors }) => {
    const { submitAction } = this.props;

    const { id, slugEditable, slug, title } = values;
    const formData = id ? values : new window.FormData();
    if (!id) {
      each(
        {
          ...mapValues(values, (value) => value || ''),
          slug: slugEditable ? slug : kebabCase(title),
        },
        (value, name) => formData.append(name, value),
      );
    }

    submitAction(formData)
      .then(() => setSubmitting(false))
      .catch(({ response: { data = null } = {} } = {}) => {
        setSubmitting(false);
        setErrors(mapApiErrorsToFormErrors(data));
      });
  };

  renderEditor = (form) => {
    const { editable, media, classes } = this.props;
    const {
      isSubmitting,
      values: { slugEditable, title },
    } = form;

    const fieldProps = {
      ...defaultFieldProps,
      disabled: !editable || !editable || isSubmitting,
    };

    const slugFieldProps = {
      ...fieldProps,
      InputProps: { className: classes.slugFormControl },
      name: 'slug',
      label: 'URL részlet',
      placeholder: 'A bejegyzéshez tartozó URL részlet...',
      disabled: !editable || !slugEditable || isSubmitting,
      required: true,
    };

    return (
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field component={TextField} name="title" label="Cím" placeholder="Címe" {...fieldProps} required />
            </Grid>
            <Grid item xs={12} className={classes.slugGrid}>
              <Field
                component={Switch}
                name="slugEditable"
                title="Egyedi URL engedélyezése"
                disabled={fieldProps.disabled}
              />
              {slugEditable ? (
                <Field component={TextField} value="123" {...slugFieldProps} />
              ) : (
                <MuiTextField value={kebabCase(title)} {...slugFieldProps} />
              )}
            </Grid>
            <Grid item xs={12}>
              <Field component={TextField} name="description" label="Leírás" placeholder="Leírás" {...fieldProps} />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="source"
                label="Forrás"
                placeholder="A tartalom származási helye (cég, weboldal, stb.)..."
                {...fieldProps}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="creator"
                label="Készítette"
                placeholder="A tartalom készítője (fotós, zenész, designer, alkotó neve, stb.)..."
                {...fieldProps}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={7}>
          <Field
            component={MediaUploadField.Formik}
            name="file"
            label="Tartalom"
            placeholder="Kattints, vagy húzd ide a tartalmat!"
            {...fieldProps}
            disabled={!!media.id || fieldProps.disabled}
          />
        </Grid>
      </Grid>
    );
  };

  renderForm = (form) => {
    const { className, classes, media, modal, editable } = this.props;
    const { /* values, */ isSubmitting, errors, handleSubmit } = form;

    const allowSubmit = editable && !isSubmitting && !hasError(errors);
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

    return modal ? (
      <ModalEditor
        className={clsx(className)}
        classes={modalEditorClasses}
        title={media && media.id ? `Média szerkesztése: ${media.title}` : 'Új média'}
        titleActions={actions}
        onClose={this.onDialogClose}
        onSubmit={handleSubmit}
        onActionClick={onActionClick}
      >
        {this.renderEditor(form)}
      </ModalEditor>
    ) : (
      <form id="MediaEditorForm" className={clsx(className)} onSubmit={handleSubmit}>
        {this.renderEditor(form)}
      </form>
    );
  };

  render() {
    const { media } = this.props;
    return (
      <Formik
        initialValues={this.getInitialValues(media)}
        validate={validate}
        render={this.renderForm}
        onSubmit={this.onFormSubmit}
      />
    );
  }
}

MediaEditor.propTypes = {
  ...ReactRouterPropTypes.isRequired,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  modal: PropTypes.bool,
  media: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  submitAction: PropTypes.func,
  onClose: PropTypes.func,
  editable: PropTypes.bool,
};

MediaEditor.defaultProps = {
  className: undefined,
  modal: true,
  media: {},
  submitAction: undefined,
  onClose: undefined,
  editable: false,
};

export default withStyles(styles)(MediaEditor);
