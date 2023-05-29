import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { Action, GalleryStatus, Role, Route } from 'consts';
import { useActions, useDialog, useEditor, useSelection, useTable } from 'hooks';
import { AddCircleIcon, DeleteIcon, EditIcon } from 'icons';
import services from 'services';
import { AppSelectors } from 'state';
import { Dialog } from 'view/base';
import { ExTable } from 'view/components';
import { GalleryEditor } from 'view/modules';

import Filter from './Filter';
import columns from './Galleries.columns';
import styles from './Galleries.styles';

const useStyles = makeStyles(styles, { name: 'Galleries' });

const deleteActions = [
  {
    id: Action.CLOSE,
    text: 'Vissza',
  },
  {
    id: Action.DELETE,
    text: 'Törlés',
  },
];

const itemActions = [
  {
    id: Action.EDIT,
    tooltip: 'Galéria szerkesztése',
    icon: <EditIcon />,
  },
  {
    id: Action.DELETE,
    tooltip: 'Galéria törlése',
    icon: <DeleteIcon />,
  },
];

const selectActions = {
  id: Action.DELETE_SELECTED,
  tooltip: 'Kijelölt galériák törlése',
  icon: <DeleteIcon />,
};

const actions = {
  id: Action.CREATE,
  icon: <AddCircleIcon />,
  text: 'Új galéria',
  color: 'secondary',
};

const rightsMap = {
  [Action.VIEW]: Role.$WRITERS,
  [Action.CREATE]: Role.$SUPERS,
  [Action.EDIT]: Role.$SUPERS,
  [Action.DELETE]: Role.$SUPERS,
  [Action.DELETE_SELECTED]: Role.$SUPERS,
};

const filterConfig = {
  initialValues: Filter.defaultProps.filter,
  mapperFn: ({ search, status }) => ({
    search,
    status: status !== GalleryStatus.ALL ? status : undefined,
  }),
};

const Galleries = ({ className, classes }) => {
  const cls = useStyles({ classes });
  const rights = useSelector((state) => AppSelectors.calculateRights(state, { rightsMap }));

  const userId = useSelector(AppSelectors.getUserId);
  const {
    table: { items: galleries, ...tableProps },
    filter,
    reload,
  } = useTable({
    listService: services.loadGalleries,
    filter: filterConfig,
    columns,
  });

  const {
    openEditor,
    closeEditor,
    item: gallery,
    ...editorProps
  } = useEditor({
    loadService: services.loadGallery,
    createService: services.createGallery,
    updateService: services.updateGallery,
    route: Route.galleries,
    initialValues: {
      id: 0,
      status: GalleryStatus.INACTIVE,
      createdBy: userId,
      updatedBy: userId,
    },
    rightsMap,
    onSubmitSuccess: () => reload(),
  });
  const { resetSelection, ...selectProps } = useSelection(galleries);
  const actionsProps = useActions({
    actions,
    selectActions,
    itemActions,
    rights,
  });
  const { showDialog, closeDialog, context: dialogContext, ...dialogProps } = useDialog();

  const onItemClick = useCallback((item) => openEditor && openEditor(item.id), [openEditor]);
  const onItemActionClick = useCallback(
    (action, item /* , event */) => {
      const { id: actionId } = action;
      if (actionId === Action.DELETE) {
        return showDialog({
          title: 'Megerősítés',
          content: 'Biztosan törölni szeretnéd a galériát?',
          context: { id: item.id },
          actions: deleteActions,
        });
      }

      if (actionId === Action.EDIT) {
        return openEditor(item.id);
      }

      return false;
    },
    [showDialog, openEditor],
  );

  const onActionClick = useCallback(
    (action, selected /* , event */) => {
      const { id: actionId } = action;
      if (actionId === Action.CREATE) {
        return openEditor();
      }
      if (actionId === Action.DELETE_SELECTED) {
        return showDialog({
          title: 'Megerősítés',
          content: `Biztosan törölni szeretnéd a ${selected.length} darab galériát?`,
          context: { id: selected },
          actions: deleteActions,
        });
      }
      return false;
    },
    [openEditor, showDialog],
  );

  const onDialogAction = useCallback(
    (action /* , event */) => {
      const { id: actionId } = action;
      const { id } = dialogContext;
      if (actionId === Action.CLOSE) {
        closeDialog();
      } else if (actionId === Action.DELETE || actionId === Action.DELETE_SELECTED) {
        // take care, this will handle both single and mulitple item deletion
        services.deleteGalleries({ id }).then(() => {
          resetSelection();
          closeDialog();
          reload();
        });
      }
    },
    [closeDialog, dialogContext, resetSelection, reload],
  );

  return (
    <div className={clsx(cls.root, className)}>
      <ExTable
        classes={{ column: cls.column }}
        title="Galériák"
        items={galleries}
        onActionClick={onActionClick}
        onItemClick={onItemClick}
        onItemActionClick={onItemActionClick}
        filter={<Filter className={cls.filter} filter={filter.filter} onSubmit={filter.onFilterSubmit} />}
        {...tableProps}
        {...selectProps}
        {...actionsProps}
      />

      <Dialog {...dialogProps} onAction={onDialogAction} />

      {gallery && <GalleryEditor dialog rights={rights} readOnly={false} gallery={gallery} {...editorProps} />}
    </div>
  );
};

Galleries.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.shape({}),
};

Galleries.defaultProps = {
  className: '',
  classes: {},
};

export default Galleries;
