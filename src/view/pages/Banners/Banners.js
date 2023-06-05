import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useAsync } from 'react-async';
import { useSelector } from 'react-redux';

import { Action, BannerStatus, Role, Route } from 'consts';
import { useActions, useDialog, useEditor, useSelection, useTable } from 'hooks';
import { AddCircleIcon, DeleteIcon, EditIcon } from 'icons';
import services from 'services';
import { AppSelectors } from 'state';
import { createPromiseService } from 'utils';
import { Dialog } from 'view/base';
import { ExTable } from 'view/components';
import { BannerEditor } from 'view/modules';

import columns from './Banners.columns';
import styles from './Banners.styles';
import Filter from './Filter';

const useStyles = makeStyles(styles, { name: 'Banners' });

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
    tooltip: 'Banner szerkesztése',
    icon: <EditIcon />,
  },
  {
    id: Action.DELETE,
    tooltip: 'Banner törlése',
    icon: <DeleteIcon />,
  },
];

const selectActions = {
  id: Action.DELETE_SELECTED,
  tooltip: 'Kijelölt bannerek törlése',
  icon: <DeleteIcon />,
};

const actions = {
  id: Action.CREATE,
  icon: <AddCircleIcon />,
  text: 'Új banner',
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
  mapperFn: ({ status, name /* , segment */ }) => ({
    status: status !== BannerStatus.ALL ? status : undefined,
    'name~like': name ? `%${name || ''}%` : undefined,
    // 'segments~like': segment !== Segment.$ALL ? `%${segment}%` : undefined,
  }),
};

const Banners = ({ className, classes }) => {
  const cls = useStyles({ classes });
  const rights = useSelector((state) => AppSelectors.calculateRights(state, { rightsMap }));
  const bannerPositionsAsync = useAsync({
    promiseFn: createPromiseService(services.loadBannerPositions),
    config: { progress: null },
  });

  const userId = useSelector(AppSelectors.getUserId);
  const {
    table: { items: banners, ...tableProps },
    filter,
    reload,
  } = useTable({
    listService: services.loadBanners,
    filter: filterConfig,
    columns,
    columnsOpts: { bannerPositionsAsync },
  });
  const {
    openEditor,
    closeEditor,
    item: banner,
    ...editorProps
  } = useEditor({
    loadService: services.loadBanner,
    createService: services.createBanner,
    updateService: services.updateBanner,
    route: Route.banners,
    initialValues: {
      id: 0,
      status: BannerStatus.INACTIVE,
      createdBy: userId,
      updatedBy: userId,
    },
    rightsMap,
    onSubmitSuccess: () => reload(),
  });
  const { resetSelection, ...selectProps } = useSelection(banners);
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
          content: 'Biztosan törölni szeretnéd a bannert?',
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
          content: `Biztosan törölni szeretnéd a ${selected.length} darab bannert?`,
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
        services.deleteBanners({ id }).then(() => {
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
        title="Bannerek"
        items={banners}
        onActionClick={onActionClick}
        onItemClick={onItemClick}
        onItemActionClick={onItemActionClick}
        filter={<Filter className={cls.filter} filter={filter.filter} onSubmit={filter.onFilterSubmit} />}
        {...tableProps}
        {...selectProps}
        {...actionsProps}
      />

      <Dialog {...dialogProps} onAction={onDialogAction} />

      {banner && (
        <BannerEditor
          dialog
          rights={rights}
          readOnly={false}
          banner={banner}
          positions={bannerPositionsAsync?.data?.data?.result}
          {...editorProps}
        />
      )}
    </div>
  );
};

Banners.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.shape({}),
};

Banners.defaultProps = {
  className: '',
  classes: {},
};

export default Banners;
