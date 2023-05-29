import { useCallback, useMemo, useState } from 'react';

const useSelection = (items) => {
  const [selected, setSelected] = useState([]);

  const onItemSelect = useCallback((itemId /* , item, event */) => {
    setSelected((prevSelected) => {
      const selectedIdx = prevSelected.indexOf(itemId);
      return selectedIdx < 0 ? [...prevSelected, itemId] : prevSelected.filter((id, idx) => selectedIdx !== idx);
    });
  }, []);

  const onSelectAll = useCallback(
    (/* event */) => {
      setSelected((prevSelected) => (prevSelected.length === items.length ? [] : items.map((item) => item.id)));
    },
    [items],
  );

  const resetSelection = useCallback(() => setSelected([]), []);

  return useMemo(
    () => ({
      onItemSelect,
      onSelectAll,
      selected,
      resetSelection,
    }),
    [onItemSelect, onSelectAll, resetSelection, selected],
  );
};

export default useSelection;
