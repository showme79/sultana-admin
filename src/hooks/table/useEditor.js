import { isNil } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAsync } from 'react-async';
import { generatePath, matchPath, useHistory, useLocation } from 'react-router-dom';

import { createDeferredService } from 'utils';

const useEditor = ({ route, loadService, createService, updateService, initialValues, onSubmitSuccess }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const initialValuesRef = useRef(initialValues);

  // load resource
  const {
    data: response = null,
    run: loadResource,
    isPending,
    error,
    setData,
  } = useAsync({ deferFn: createDeferredService(loadService) });
  useEffect(() => {
    setData(null);
  }, [pathname, setData]);

  useEffect(() => {
    if (response) {
      return;
    }

    const {
      params: { id },
    } = matchPath(pathname, { path: route, exact: true });
    if (+id === 0) {
      setData({ data: { result: initialValuesRef.current || {} } });
    } else if (id) {
      loadResource({ id });
    }
  }, [route, response, setData, pathname, loadResource]);

  const openEditor = useCallback((id) => history.push(generatePath(route, { id: id || 0 })), [history, route]);
  const closeEditor = useCallback(() => history.replace(generatePath(route)), [history, route]);
  const onClose = useCallback(() => closeEditor(), [closeEditor]);
  const submitAction = useCallback(
    (item) => {
      const { id } = item;
      const saveService = isNil(id || null) ? createService : updateService;
      return saveService({ id, item }).then((res) => {
        setData(res);
        onSubmitSuccess(item, res);
        return res;
      });
    },
    [createService, onSubmitSuccess, setData, updateService],
  );

  const item = response?.data?.result;

  return useMemo(
    () => ({
      openEditor,
      closeEditor,
      isPending,
      error,
      item,
      onClose,
      submitAction,
    }),
    [openEditor, closeEditor, isPending, error, item, onClose, submitAction],
  );
};

export default useEditor;
