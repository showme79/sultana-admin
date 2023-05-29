import { Grid, TextField as MuiTextField, makeStyles } from '@material-ui/core';
import { Field, Formik } from 'formik';
import { Switch, TextField } from 'formik-material-ui';
import { find, isArray, kebabCase } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { Action, GalleryStatus, fieldProps as defaultFieldProps } from 'consts';
import { GalleryPropType, GalleryRightsPropType } from 'consts/prop-types';
import { SaveIcon } from 'icons';
import { GalleryStatusText } from 'lang/hu';
import { getSelectItems, mapApiErrorsToFormErrors } from 'utils';
import { SimpleSelect } from 'view/base';
import { ModalEditor } from 'view/components';

import AssignedMediaTable from './AssignedMediaTable';
import styles from './GalleryEditor.styles';

const statusItems = getSelectItems(GalleryStatus, GalleryStatusText, { all: false }); // (status) => ({ id: status, name: BannerStatusText[status] }));

const useStyles = makeStyles(styles, { name: 'GalleryEditor' });

const validate = (/* values , formikProps */) => ({});

const calcInitialValues = ({ status, slug, title, description, media, ...galleryProps }) => ({
  ...galleryProps,
  status: status || GalleryStatus.INACTIVE,
  slugEditable: !!title && slug !== kebabCase(title || ''),
  slug,
  title: title || '',
  description: description || '',
  media: media || [],
});

/* eslint-disable react/prop-types */
const renderEditor = ({
  classes,
  rights,
  form: {
    setValues,
    isSubmitting,
    values,
    values: { title, slugEditable, media },
  },
}) => {
  const fieldProps = {
    ...defaultFieldProps,
    disabled: (!rights.EDIT && !rights.CREATE) || isSubmitting,
  };

  const slugFieldProps = {
    ...fieldProps,
    InputProps: { className: classes.slugFormControl },
    name: 'slug',
    label: 'URL részlet',
    placeholder: 'A galériához tartozó URL részlet...',
    disabled: !rights.EDIT || !slugEditable,
    required: true,
  };

  const onMediaListChange = (mediaList) => setValues({ ...values, media: mediaList });

  return (
    <Grid className={classes.root} container spacing={2}>
      <Grid item xs={8}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Field
              component={TextField}
              name="title"
              label="Név"
              placeholder="A galéria címe..."
              {...fieldProps}
              required
            />
          </Grid>
          <Grid item xs={12} className={classes.slugGrid}>
            <Field component={Switch} name="slugEditable" title="Egyedi URL engedélyezése" disabled={!rights.EDIT} />
            {slugEditable ? (
              <Field component={TextField} value="" {...slugFieldProps} />
            ) : (
              <MuiTextField value={kebabCase(title)} {...slugFieldProps} />
            )}
          </Grid>
          <Grid item xs={12}>
            <Field
              component={TextField}
              name="description"
              label="Leírás"
              placeholder="A galéria leírása"
              {...fieldProps}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Field component={SimpleSelect} name="status" label="Állapot" items={statusItems} {...fieldProps} />
          </Grid>
        </Grid>
      </Grid>

      <Grid container item xs={12}>
        <AssignedMediaTable mediaList={media} onChange={onMediaListChange} />
      </Grid>
    </Grid>
  );
};
/* eslint-enable react/prop-types */

const GalleryEditor = ({ gallery, rights, submitAction, onClose }) => {
  const classes = useStyles();

  const initialValues = useMemo(() => {
    if (!gallery) {
      return null;
    }

    return calcInitialValues(gallery);
  }, [gallery]);

  const onDialogClose = useCallback((event) => onClose && onClose(event), [onClose]);

  const onFormSubmit = useCallback(
    (values, { setSubmitting, setErrors, resetForm }) => {
      const { slugEditable, slug, ...saveValues } = values;

      submitAction({
        ...saveValues,
        slug: slugEditable ? slug : kebabCase(saveValues.title),
      })
        .then(({ data: { result: savedGallery } = undefined }) => {
          resetForm({ values: calcInitialValues(savedGallery) });
          return onClose && onClose();
        })
        .catch(({ response: { data = null } = {} } = {}) => {
          setSubmitting(false);
          setErrors(mapApiErrorsToFormErrors(data));
        });
    },
    [onClose, submitAction],
  );

  const onActionClick = useCallback((action /* , context, event */) => {
    if (action.id === Action.SUBMIT) {
      return action.submit();
    }
    return undefined;
  }, []);

  const hasError = useCallback((errors) => !!find(errors, (error) => (isArray(error) ? error.length : true)), []);

  const { id, title } = gallery || {};
  const renderForm = useCallback(
    (form) => {
      const { isSubmitting, errors, handleSubmit, dirty } = form;

      const actions = {
        id: Action.SUBMIT,
        visible: true,
        disabled: (!rights.EDIT && !rights.CREATE) || isSubmitting || hasError(errors),
        icon: <SaveIcon />,
        text: 'Mentés',
        color: 'secondary',
        submit: handleSubmit,
      };

      return (
        <ModalEditor
          onSubmit={handleSubmit}
          title={id ? `Galéria szerkesztése: ${title}` : 'Új galéria'}
          onClose={onDialogClose}
          titleActions={actions}
          onActionClick={onActionClick}
          dirty={dirty && 'Ha elnavigálsz, a galérián végzet módosítások el fognak veszni! Biztosan folytatod?'}
        >
          {renderEditor({ classes, rights, form })}
        </ModalEditor>
      );
    },
    [rights, hasError, id, title, onDialogClose, onActionClick, classes],
  );

  return (
    initialValues && (
      <Formik initialValues={initialValues} validate={validate} render={renderForm} onSubmit={onFormSubmit} />
    )
  );
};

GalleryEditor.propTypes = {
  gallery: GalleryPropType,
  submitAction: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  rights: GalleryRightsPropType.isRequired,
};

GalleryEditor.defaultProps = {
  gallery: {},
  submitAction: undefined,
};

export default GalleryEditor;
