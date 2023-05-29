import { Grid, TextField as MuiTextField, withStyles } from '@material-ui/core';
import { Field, Formik } from 'formik';
import { Switch, TextField } from 'formik-material-ui';
import { find, isArray, isPlainObject, kebabCase, map, memoize, merge } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Action, CategoryStatus, RealSegment, fieldProps as defaultFieldProps } from 'consts';
import { CategoryRightsPropType } from 'consts/prop-types';
import { SaveIcon } from 'icons';
import { CategoryStatusText, SegmentText } from 'lang/hu';
import services from 'services';
import { AppSelectors, CategoriesSelectors } from 'state';
import { getSegmentGroupItems, mapApiErrorsToFormErrors, mapCheckboxToItems, mapItemsToCheckbox } from 'utils';
import { CheckboxField, CheckboxGroupField, ColoPickerField, SimpleSelect } from 'view/base';
import { ImageSelectField, ModalEditor } from 'view/components';

import styles from './CategoryEditor.styles';

const onActionClick = (action /* , context, event */) => {
  if (action.id === Action.SUBMIT) {
    return action.submit();
  }
  return undefined;
};

const hasError = (errors) => !!find(errors, (error) => (isArray(error) ? error.length : true));
const getAvailableStatuses = () => map(CategoryStatus, (status) => ({ id: status, name: CategoryStatusText[status] }));

const getSegmentText = (category) => {
  if (!category || !category.segments) {
    return undefined;
  }

  return category.segments
    .split(',')
    .map((segment) => SegmentText[segment])
    .join(', ');
};

const sequences = Array(20)
  .fill()
  .map((value, idx) => ({ id: idx, name: String(idx) }));

class CategoryEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: undefined,
    };
  }

  componentDidMount() {
    services.loadCategories(null, { progress: false }).then(({ data: { result = [] } = {} } = {}) => {
      this.setState({
        categories: [
          {
            id: 0,
            name: '[Főkategória]',
          },
          ...result.map((category) => ({ ...category, name: this.getCategoryName(category, result) })),
        ],
      }); // only parent categories needed
    });
  }

  getInitialValues = memoize(
    ({ name, description, parentId, sequence, status, segments, color, attributes, ...categoryProps }) => ({
      ...categoryProps,
      name: name || '',
      description: description || '',
      parentId: parentId || 0,
      sequence: sequence || 0,
      segments: mapItemsToCheckbox(segments, RealSegment, RealSegment),
      status: status || CategoryStatus.CLOSED,
      color: color || '',
      slugEditable: !!name && categoryProps.slug !== kebabCase(name),
      attributes: merge(
        {
          fullsizeImage: false,
          hideTitle: false,
          targetBlank: false,
          displayInHeader: false,
        },
        attributes || {},
      ),
    }),
  );

  getCategoryName = ({ parentId, name }, categories = []) => {
    if (!parentId) {
      return name;
    }

    const parentCategory = categories.find((item) => item.id === parentId);

    return parentCategory ? `${this.getCategoryName(parentCategory, categories)} → ${name}` : name;
  };

  onDialogClose = (event) => {
    const { onClose } = this.props;
    return onClose?.(event);
  };

  onFormSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
    const { submitAction, onClose } = this.props;
    const { slug, slugEditable, segments, color, image, ...saveValues } = values;

    submitAction({
      ...saveValues,
      imageMediaId: image?.id || null,
      color: isPlainObject(color) ? `#${color?.hex}` : color,
      segments: mapCheckboxToItems(segments).join(','),
      slug: slugEditable ? slug : kebabCase(saveValues.name),
    })
      .then((/* { data: { result: savedCategory } = undefined } = {} */) => {
        resetForm();
        return onClose && onClose();
      })
      .catch(({ response: { data = null } = {} } = {}) => {
        setSubmitting(false);
        setErrors(mapApiErrorsToFormErrors(data));
      });
  };

  getParentCategory = (parentId) => {
    const { categories } = this.state;
    return parentId ? (categories || []).find(({ id }) => id === parentId) : null;
  };

  renderEditor = (form) => {
    const {
      isSubmitting,
      values: { slugEditable, name, parentId },
    } = form;
    const { classes, rights } = this.props;
    const { categories } = this.state;

    const fieldProps = {
      ...defaultFieldProps,
      disabled: (!rights.EDIT && !rights.CREATE) || isSubmitting,
    };

    const statuses = getAvailableStatuses();

    const slugFieldProps = {
      ...fieldProps,
      InputProps: { className: classes.slugFormControl },
      name: 'slug',
      label: 'URL részlet',
      placeholder: 'A bejegyzéshez tartozó URL részlet...',
      disabled: !rights.EDIT || !slugEditable,
      required: true,
    };

    const parentCategory = this.getParentCategory(parentId);
    return (
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="name"
                label="Név"
                placeholder="Kategória neve..."
                {...fieldProps}
                required
              />
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
                <Field component={TextField} {...slugFieldProps} />
              ) : (
                <MuiTextField value={kebabCase(name)} {...slugFieldProps} />
              )}
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="description"
                label="Leírás"
                placeholder="Kategória leírása..."
                {...fieldProps}
              />
            </Grid>
            {categories && (
              <Grid item xs={12}>
                <Field
                  component={SimpleSelect}
                  name="parentId"
                  label="Szülő kategória"
                  items={categories}
                  {...fieldProps}
                  helperText={getSegmentText(parentCategory)}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Field
                component={ImageSelectField.Formik}
                name="image"
                label="Borító kép"
                placeholder="Válassz képet..."
                {...fieldProps}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field
                component={SimpleSelect}
                name="status"
                label="Megjelenítés állapota"
                items={statuses}
                {...fieldProps}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={SimpleSelect}
                name="sequence"
                label="Sorrend (kisebb elől)"
                items={sequences}
                {...fieldProps}
              />
            </Grid>
            <Grid item xs={12}>
              <Field component={ColoPickerField} name="color" label="Szín" {...fieldProps} />
            </Grid>
            <Grid item xs={12}>
              <CheckboxGroupField
                label="Fülek (szegmensek)"
                items={getSegmentGroupItems()}
                disabled={fieldProps.disabled}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={CheckboxField}
                label="Cím elrejtése"
                helperText="A kategória oldalon a fejlécen címe nem lesz látható. Célszerű lehet a teljes méretű kép beállítással együtt használni. Alapértelmezettként a cím mindig látszik"
                name="attributes.hideTitle"
                {...fieldProps}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={CheckboxField}
                label="Teljes méretű kép"
                helperText="A kategória oldalon a fejlécen nem lesz lekicsinyítve a kép. Alapértelmezetten a kép kicsinyítetten, sávként jelenik meg a kategória oldal tetején."
                name="attributes.fullsizeImage"
                {...fieldProps}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                label="Cél URL"
                placeholder="Külső hivatkozás URL-je..."
                helperText="A kategória megnyitásakor ezt az oldalt fogja megnyitni."
                name="attributes.target"
                {...fieldProps}
                disabled={fieldProps.disabled}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={CheckboxField}
                label="Cél URL megnyitása új lapon"
                helperText="Ha be van jelölve, akkor kattintáskor a 'Cél URL'-ben megadott link új lapon fog megjelenni."
                name="attributes.targetBlank"
                {...fieldProps}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={CheckboxField}
                label="Megjelenítés a fejlécen"
                helperText="Ha be van jelölve, akkor az adott kategória asztali nézetben a fejlécen is megjelenik, nem csak a hamburger menüben."
                name="attributes.displayInHeader"
                {...fieldProps}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderForm = (form) => {
    const { category, rights } = this.props;
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
        title={category && category.id ? `Kategória szerkesztése: ${category.name}` : 'Új tag'}
        onClose={this.onDialogClose}
        titleActions={actions}
        onActionClick={onActionClick}
        dirty={dirty && 'Ha elnavigálsz, a kategórián végzet módosítások el fognak veszni! Biztosan folytatod?'}
      >
        {this.renderEditor(form)}
      </ModalEditor>
    );
  };

  render() {
    const { category } = this.props;
    return (
      <Formik initialValues={this.getInitialValues(category)} onSubmit={this.onFormSubmit}>
        {this.renderForm}
      </Formik>
    );
  }
}

CategoryEditor.propTypes = {
  ...ReactRouterPropTypes.isRequired,
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  category: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  dialog: PropTypes.bool,
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  submitAction: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  hasRole: PropTypes.func.isRequired,
  rights: CategoryRightsPropType.isRequired,
};

CategoryEditor.defaultProps = {
  category: {},
  dialog: false,
  user: undefined,
  submitAction: undefined,
};

const mapStateToProps = (state) => ({
  category: CategoriesSelectors.getCategory(state),
  user: AppSelectors.getUser(state),
  hasRole: (roles) => AppSelectors.hasRole(roles)(state),
});

export default connect(mapStateToProps)(withStyles(styles)(CategoryEditor));
