import { Button, CircularProgress, Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import { isArray, isEmpty, isString, map } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Action, SubscriptionType, fieldProps } from 'consts';
import { useJobs, useSubscriptionTypes } from 'hooks';
import services from 'services';
import { Dialog, SimpleSelect } from 'view/base';

import styles from './SyncDialog.styles';

const useStyles = makeStyles(styles, { name: 'SyncDialog' });

const SyncDialog = ({ handleSubmit, values, isSubmitting, open, onClose, setFieldValue }) => {
  const { selectedListId } = values;
  const classes = useStyles();
  const [subscriptionLists, setSubscriptionLists] = useState();
  const { subscriptionTypes } = useSubscriptionTypes();
  const subscriptionTypesList = useMemo(
    () => map(subscriptionTypes, ({ title }, id) => ({ id, name: `${title} (${id})` })),
    [subscriptionTypes],
  );

  useEffect(() => {
    if (subscriptionLists) {
      return;
    }
    services
      .getSubscriptionLists()
      .then((response) => {
        const { lists } = response?.data?.result || {};
        if (!isEmpty(lists)) {
          setSubscriptionLists('A feliratkozási listákat nem sikerült a távoli szerverről betölteni!');
        }
        setSubscriptionLists(lists);
        setFieldValue('selectedListId', lists[0].id);
      })
      .catch((/* error */) => {
        setSubscriptionLists('A feliratkozási listákat nem sikerült a távoli szerverről betölteni!');
      });
  }, [subscriptionLists, setFieldValue]);

  const onAction = useCallback(
    (action, event) => {
      if (action.id === Action.CLOSE) {
        return onClose(event);
      }
      if (action.id === Action.SYNC) {
        return action.submit();
      }
      return undefined;
    },
    [onClose],
  );

  const onRetry = useCallback(() => setSubscriptionLists(null), []);

  const actions = [
    {
      id: Action.SYNC,
      text: 'Szinkronizálás',
      disabled: !subscriptionLists || !selectedListId || isSubmitting,
      submit: handleSubmit,
    },
  ];

  const content =
    (!subscriptionLists && <CircularProgress />) ||
    (isArray(subscriptionLists) && (
      <Form className={classes.form}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Field
              component={SimpleSelect}
              name="subscriptionType"
              label="Helyi feliratkozás"
              items={subscriptionTypesList}
              {...fieldProps}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              component={SimpleSelect}
              name="selectedListId"
              label="Cél lista"
              items={subscriptionLists}
              {...fieldProps}
              disabled={isSubmitting}
            />
          </Grid>
        </Grid>
      </Form>
    )) ||
    (isString(subscriptionLists) && (
      <div className={classes.error}>
        <div className="error-message">{subscriptionLists}</div>
        <Button onClick={onRetry}>Újra próbálkozás</Button>
      </div>
    ));

  return (
    <Dialog
      className={clsx(classes.root)}
      classes={{ content: classes.content }}
      open={open}
      title="Lista szinkronizálása"
      content={content}
      actions={actions}
      onClose={onClose}
      onAction={onAction}
      fullWidth
      maxWidth="sm"
    />
  );
};

SyncDialog.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  values: PropTypes.shape({
    subscriptionType: PropTypes.string,
    selectedListId: PropTypes.string,
  }).isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

SyncDialog.defaultProps = {
  open: false,
  onClose: undefined,
};

const FormikSyncDialog = ({ onClose, ...props }) => {
  const { loadJobs } = useJobs();
  const onSubmit = useCallback(
    ({ subscriptionType, selectedListId }, { setSubmitting }) => {
      services.syncSubscriptionList({ subscriptionType, listId: selectedListId }).then(() => {
        loadJobs();
        setSubmitting(false);
        onClose();
      });
    },
    [onClose, loadJobs],
  );

  return (
    <Formik initialValues={{ selectedListId: '', subscriptionType: SubscriptionType.NEWSLETTER }} onSubmit={onSubmit}>
      {(formikProps) => <SyncDialog {...props} onClose={onClose} {...formikProps} />}
    </Formik>
  );
};

FormikSyncDialog.propTypes = {
  onClose: PropTypes.func,
};

FormikSyncDialog.defaultProps = {
  onClose: undefined,
};

export default FormikSyncDialog;
