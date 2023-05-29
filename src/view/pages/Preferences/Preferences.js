import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { Action, Role } from 'consts';
import { useActions, useTable } from 'hooks';
import { EditIcon } from 'icons';
import services from 'services';
import { AppSelectors } from 'state';
import { ExTable } from 'view/components';

import PreferenceDialog from './PerferenceDialog';
import columns from './Preferences.columns';
import styles from './Preferences.styles';

const useStyles = makeStyles(styles, { name: 'Preferences' });

const itemActions = [
  {
    id: Action.EDIT,
    tooltip: 'Érték módosítása',
    icon: <EditIcon />,
  },
];

const rightsMap = {
  [Action.VIEW]: Role.$WRITERS,
  [Action.EDIT]: Role.$SUPERS,
};

const Preferences = ({ className, classes }) => {
  const cls = useStyles({ classes });
  const [preference, setPreference] = useState();
  const rights = useSelector((state) => AppSelectors.calculateRights(state, { rightsMap }));

  const {
    table: { items: preferences, ...tableProps },
    reload,
  } = useTable({
    listService: services.loadPreferences,
    columns,
  });
  const actionsProps = useActions({ itemActions, rights });

  const onItemClick = useCallback((item) => setPreference(item), []);
  const onItemActionClick = useCallback((action, item /* , event */) => {
    const { id: actionId } = action;

    if (actionId === Action.EDIT) {
      return setPreference(item);
    }

    return false;
  }, []);

  const onPreferenceDialogSubmit = useCallback(
    (values) =>
      services.updatePreference({ ...preference, value: values.value }).then(() => {
        setPreference(null);
        reload();
      }),
    [preference, reload],
  );
  const onPreferenceDialogClose = () => setPreference(null);
  const onPreferenceDialogExited = () => setPreference(undefined);

  return (
    <div className={clsx(cls.root, className)}>
      <ExTable
        classes={{ column: cls.column }}
        idProperty="name"
        title="Beállítások"
        items={preferences}
        onItemClick={onItemClick}
        onItemActionClick={onItemActionClick}
        {...actionsProps}
        {...tableProps}
      />
      {preference !== undefined && (
        <PreferenceDialog
          open={!!preference}
          preference={preference}
          onSubmit={onPreferenceDialogSubmit}
          onClose={onPreferenceDialogClose}
          onExited={onPreferenceDialogExited}
        />
      )}
    </div>
  );
};

Preferences.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.shape({}),
};

Preferences.defaultProps = {
  className: '',
  classes: {},
};

export default Preferences;
