import { useCallback, useMemo, useState } from 'react';

const useDialog = () => {
  const [state, setState] = useState(null);

  const showDialog = useCallback(
    ({ title, content, context, actions }) =>
      setState({
        title,
        content,
        context,
        actions,
      }),
    [],
  );
  const closeDialog = useCallback(() => setState(null), []);
  const onClose = useCallback((/* event */) => closeDialog(), [closeDialog]);

  return useMemo(
    () => ({
      open: !!state,
      ...(state || {}),
      showDialog,
      closeDialog,
      onClose,
    }),
    [state, showDialog, closeDialog, onClose],
  );
};

export default useDialog;
