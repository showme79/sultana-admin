import { isArray } from 'lodash-es';
import { useMemo } from 'react';

const setActionVisibility = (actions, rights) =>
  (isArray(actions) ? actions : [actions]).map(({ id, ...action }) => ({
    id,
    visible: rights[id] || false,
    ...action,
  }));

const useActions = ({ actions, selectActions, itemActions, rights }) => {
  const actionsWithRight = useMemo(() => (actions && setActionVisibility(actions, rights)) || null, [actions, rights]);
  const selectActionsWithRight = useMemo(
    () => (selectActions && setActionVisibility(selectActions, rights)) || null,
    [rights, selectActions],
  );
  const itemActionsWithRight = useMemo(
    () => (itemActions && setActionVisibility(itemActions, rights)) || null,
    [itemActions, rights],
  );

  return useMemo(
    () => ({
      actions: actionsWithRight,
      selectActions: selectActionsWithRight,
      itemActions: itemActionsWithRight,
    }),
    [actionsWithRight, selectActionsWithRight, itemActionsWithRight],
  );
};

export default useActions;
