import { makeStyles } from '@material-ui/core';
import { findIndex, mapKeys, some } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { Action, Role } from 'consts';
import { MediaPropType } from 'consts/prop-types';
import { useActions, useSelection } from 'hooks';
import { AddCircleIcon, DeleteIcon } from 'icons';
import { AppSelectors } from 'state';
import { ImagePicker } from 'view/base';
import { ExTable } from 'view/components';

import columns from './AssignedMediaTable.columns';
import styles from './AssignedMediaTable.styles';

const itemActions = [
  {
    id: Action.INSERT,
    tooltip: 'Média beszúrása',
    icon: <AddCircleIcon />,
  },
  {
    id: Action.DELETE,
    tooltip: 'Média eltávolítása',
    icon: <DeleteIcon />,
  },
];

const selectActions = {
  id: Action.DELETE_SELECTED,
  tooltip: 'Kijelölt elemek eltávolítása',
  icon: <DeleteIcon />,
};

const actions = {
  id: Action.ADD,
  icon: <AddCircleIcon />,
  text: 'Média hozzáadása',
  color: 'secondary',
};

const rightsMap = {
  [Action.VIEW]: Role.$WRITERS,
  [Action.ADD]: Role.$SUPERS,
  [Action.INSERT]: Role.$SUPERS,
  [Action.DELETE]: Role.$SUPERS,
  [Action.DELETE_SELECTED]: Role.$SUPERS,
};

const useStyles = makeStyles(styles, { name: 'AssignedMediaTable' });

const AssignedMediaTable = ({ mediaList, onChange }) => {
  const [imagePickerIdx, setImagePickerIdx] = useState(false);
  const rights = useSelector((state) => AppSelectors.calculateRights(state, { rightsMap }));
  const { resetSelection, ...selectProps } = useSelection(mediaList);
  const actionsProps = useActions({
    actions,
    selectActions,
    itemActions,
    rights,
  });

  const cls = useStyles();

  const onActionClick = useCallback(
    (action, selected /* , event */) => {
      const { id: actionId } = action;
      const selectedMap = mapKeys(selected);

      if (actionId === Action.ADD) {
        return setImagePickerIdx(mediaList.length);
      }
      if (actionId === Action.DELETE_SELECTED) {
        resetSelection();
        return onChange(mediaList.filter(({ id }) => !selectedMap[id]));
      }
      return false;
    },
    [mediaList, onChange, resetSelection],
  );

  const onItemActionClick = useCallback(
    (action, item /* , event */) => {
      const { id: actionId } = action;
      if (actionId === Action.DELETE) {
        return onChange(mediaList.filter(({ id }) => id !== item.id));
      }

      if (actionId === Action.INSERT) {
        const idx = findIndex(mediaList, ({ id }) => id === item.id);
        setImagePickerIdx(idx);
      }

      return false;
    },
    [mediaList, onChange],
  );

  const onImagePickerClose = useCallback(() => setImagePickerIdx(false), []);

  const onImagePickerSelect = useCallback(
    (media) => {
      if (some(mediaList, ({ id }) => id === media.id)) {
        return;
      }
      onChange([...mediaList.slice(0, imagePickerIdx), media, ...mediaList.slice(imagePickerIdx)]);
    },
    [imagePickerIdx, mediaList, onChange],
  );

  return (
    <>
      <ExTable
        classes={{ column: cls.column }}
        title="A galéria tartalma"
        columns={columns}
        items={mediaList}
        onActionClick={onActionClick}
        /* onItemClick={onItemClick} */ // TODO: display image in full size
        onItemActionClick={onItemActionClick}
        {...selectProps}
        {...actionsProps}
      />
      <ImagePicker
        open={imagePickerIdx !== false}
        onSelect={onImagePickerSelect}
        onClose={onImagePickerClose}
        fullWidth
        maxWidth="lg"
      />
    </>
  );
};

AssignedMediaTable.propTypes = {
  mediaList: PropTypes.arrayOf(MediaPropType).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default AssignedMediaTable;
