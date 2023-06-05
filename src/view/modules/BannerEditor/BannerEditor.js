import { Grid, makeStyles } from '@material-ui/core';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { find, isArray, isNaN } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Action, BannerStatus, Repeat, fieldProps as defaultFieldProps } from 'consts';
import { BannerPositionsPropType, BannerPropType, BannerRightsPropType } from 'consts/prop-types';
import { SaveIcon } from 'icons';
import { BannerStatusText, RepeatText } from 'lang/hu';
import { AppSelectors } from 'state';
import { getSelectItems, mapApiErrorsToFormErrors, mapCheckboxToItems, mapItemsToCheckbox } from 'utils';
import { CheckboxGroupField, DateTimePicker, SimpleSelect, SliderField } from 'view/base';
import { ImageSelectField, ModalEditor } from 'view/components';

import styles from './BannerEditor.styles';

const statusItems = getSelectItems(BannerStatus, BannerStatusText, { all: false }); // (status) => ({ id: status, name: BannerStatusText[status] }));
const repeatItems = [
  Repeat.NEVER,
  Repeat.ALWAYS,
  Repeat.HOURLY,
  Repeat.DAILY,
  Repeat.WEEKLY,
  Repeat.MONTHLY,
  Repeat.CUSTOM,
].map((repeat) => ({ id: repeat, name: RepeatText[repeat] }));

const MIN_PRIORITY = 0;
const MAX_PRIORITY = 20;

const useStyles = makeStyles(styles, { name: 'BannerEditor' });

const getRepeatCustomError = (repeatCustom = '') =>
  (!repeatCustom.trim() && 'Egyedi érték esetén kötelező megadni!') ||
  (isNaN(+repeatCustom) && 'Kérlek órában add meg az ismétlődés idejét (pl.: 0.5, 36, stb.)!') ||
  undefined;

const validate = ({ repeat, repeatCustom } /* , formikProps */) => {
  const errors = {};
  if (repeat === Repeat.CUSTOM) {
    errors.repeatCustom = getRepeatCustomError(repeatCustom);
  }
  return errors;
};

const calcInitialValues = (
  { title, status, segments: bannerSegments, priority, positionId, startDate, endDate, repeat, ...bannerProps },
  { positions, segments },
) => {
  const date = new Date();
  const startDateDefault = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0);

  return {
    ...bannerProps,
    title: title || '',
    status: status || BannerStatus.INACTIVE,
    segments: mapItemsToCheckbox(bannerSegments, segments, segments),
    priority: priority || Math.ceil((MAX_PRIORITY + MIN_PRIORITY) / 2),
    positionId: positionId || positions[0]?.id || '',
    repeat: (Repeat[repeat] && repeat) || (getRepeatCustomError(repeat) && repeatItems[0].id) || Repeat.CUSTOM,
    repeatCustom: Repeat[repeat] || getRepeatCustomError(repeat) ? '' : repeat,
    startDate: startDate || startDateDefault,
    endDate: endDate || new Date(+startDateDefault + 7 * 86400 * 1000),
  };
};

/* eslint-disable react/prop-types */
const renderEditor = ({
  classes,
  rights,
  positions,
  segmentGroupItems,
  form: {
    isSubmitting,
    values: { repeat },
  },
}) => {
  const fieldProps = {
    ...defaultFieldProps,
    disabled: (!rights.EDIT && !rights.CREATE) || isSubmitting,
  };

  return (
    <Grid className={classes.root} container spacing={2}>
      <Grid item xs={8}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Field
              component={TextField}
              name="name"
              label="Név"
              placeholder="A banner elnevezése (kereséshez)"
              {...fieldProps}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              component={ImageSelectField.Formik}
              name="image"
              label="Kép"
              placeholder="Válassz képet..."
              {...fieldProps}
            />
          </Grid>
          <Grid item xs={12}>
            <Field component={TextField} name="title" label="Felirat" placeholder="Felirat..." {...fieldProps} />
          </Grid>
          <Grid item xs={12}>
            <Field
              component={TextField}
              name="target"
              label="Cél URL"
              placeholder="Klikkeléskor cél URL..."
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
          <Grid item xs={6}>
            <Field
              component={DateTimePicker}
              inline
              name="startDate"
              label="Megjelenés kezdete"
              required
              invalidDateMessage="Hibás formátum (pl.: 2019.12.27 13:45)!"
              {...fieldProps}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              component={DateTimePicker}
              inline
              name="endDate"
              label="Megjelenés vége"
              required
              invalidDateMessage="Hibás formátum (pl.: 2019.12.27 13:45)!"
              {...fieldProps}
            />
          </Grid>
          <Grid item xs={8}>
            <Field component={SimpleSelect} name="repeat" label="Ismétlődés" items={repeatItems} {...fieldProps} />
          </Grid>
          <Grid item xs={4}>
            <Field
              component={TextField}
              name="repeatCustom"
              label="Egyedi (óra)"
              placeholder="Pl.: 0.5 vagy 36"
              {...fieldProps}
              disabled={repeat !== Repeat.CUSTOM}
            />
          </Grid>
          <Grid item xs={12}>
            <Field component={SimpleSelect} name="positionId" label="Pozíció" items={positions} {...fieldProps} />
          </Grid>
          <Grid item xs={12}>
            <CheckboxGroupField label="Szegmensek" items={segmentGroupItems} disabled={fieldProps.disabled} />
          </Grid>
          <Grid item xs={12}>
            <Field
              component={SliderField}
              name="priority"
              label="Sorrend"
              min={MIN_PRIORITY}
              max={MAX_PRIORITY}
              step={1}
              {...fieldProps}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
/* eslint-enable react/prop-types */

const BannerEditor = ({ banner, positions, rights, submitAction, onClose }) => {
  const classes = useStyles();

  const onDialogClose = useCallback((event) => onClose && onClose(event), [onClose]);

  const onFormSubmit = useCallback(
    (values, { setSubmitting, setErrors, resetForm }) => {
      const { image, segments, repeat, repeatCustom, ...saveValues } = values;

      submitAction({
        ...saveValues,
        segments: mapCheckboxToItems(segments).join(','),
        repeat: repeat === Repeat.CUSTOM ? repeatCustom : repeat,
        imageMediaId: (image && image.id) || null,
      })
        .then(({ data: { result: savedBanner } = undefined }) => {
          resetForm({ values: calcInitialValues(savedBanner) });
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

  const { id, title } = banner || {};
  const { segments, segmentGroupItems } = useSelector(AppSelectors.getSegmentsInfo);

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
          title={id ? `Banner szerkesztése: ${title}` : 'Új banner'}
          onClose={onDialogClose}
          titleActions={actions}
          onActionClick={onActionClick}
          dirty={dirty && 'Ha elnavigálsz, a banneren végzet módosítások el fognak veszni! Biztosan folytatod?'}
        >
          {renderEditor({
            classes,
            rights,
            positions,
            segmentGroupItems,
            form,
          })}
        </ModalEditor>
      );
    },
    [rights, hasError, id, title, onDialogClose, onActionClick, classes, positions, segmentGroupItems],
  );

  const initialValues = useMemo(() => {
    if (!banner || !positions) {
      return null;
    }

    return calcInitialValues(banner, { positions, segments });
  }, [banner, positions, segments]);

  return (
    initialValues && (
      <Formik initialValues={initialValues} validate={validate} render={renderForm} onSubmit={onFormSubmit} />
    )
  );
};

BannerEditor.propTypes = {
  banner: BannerPropType,
  submitAction: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  rights: BannerRightsPropType.isRequired,
  positions: BannerPositionsPropType,
};

BannerEditor.defaultProps = {
  banner: {},
  submitAction: undefined,
  positions: null,
};
export default BannerEditor;
