import { identity, isFunction, merge } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAsync } from 'react-async';

import { SortDirection, rowsPerPageOptions } from 'consts';

const defaultRowsPerPage = rowsPerPageOptions[0];

const useTable = ({
  listService,
  columns: columnsProps,
  columnsOpts,
  sort: { key, direction } = {},
  range: { offset, limit } = {},
  filter: { initialValues: filterInitialValues = {}, mapperFn: filterMapperFn = identity } = {},
  resultKey = 'result',
  totalKey = 'total',
}) => {
  const [state, setState] = useState({
    sort: { key: key || 'createdAt', direction: direction || SortDirection.DESC },
    range: { offset: offset || 0, limit: limit || defaultRowsPerPage },
    filter: filterInitialValues,
  });

  const promiseRef = useRef();

  const columns = useMemo(
    () => (isFunction(columnsProps) ? columnsProps(columnsOpts) : columnsProps),
    [columnsProps, columnsOpts],
  );

  const asyncState = useAsync({ promise: promiseRef.current });
  const { data: { data } = {} } = asyncState;

  const loadList = useCallback(
    ({ sort, range, filter } = {}) => {
      const newState = merge({}, state, { sort, range, filter });
      const { search, ...filterParams } = filterMapperFn(newState.filter);
      promiseRef.current = listService({
        sort: newState.sort,
        range: newState.range,
        filter: filterParams,
        search,
      }).then((res) => {
        setState(newState);
        return res;
      });

      return promiseRef.current;
    },
    [filterMapperFn, listService, state],
  );

  const reload = useCallback(() => loadList(), [loadList]);

  useEffect(() => {
    if (data) {
      return;
    }
    loadList();
  }, [data, loadList]);

  const onSortChange = useCallback((sort) => loadList({ sort }), [loadList]);

  const onRowsPerPageChange = useCallback((rowsPerPage) => loadList({ range: rowsPerPage }), [loadList]);

  const onFilterSubmit = useCallback(
    (filter, { setSubmitting }) =>
      loadList({ filter, range: { offset: 0 } })
        .then(() => setSubmitting(false))
        .catch(() => setSubmitting(false)),
    [loadList],
  );

  const setFilter = useCallback((filter) => setState((prevState) => merge({}, prevState, { filter })), []);

  const { sort, range, filter } = state;
  const rowsPerPage = range.limit || defaultRowsPerPage;
  const onPageChange = useCallback(
    (page) => loadList({ range: { offset: page * rowsPerPage } }),
    [loadList, rowsPerPage],
  );

  return {
    asyncState,
    reload,
    table: {
      items: data?.[resultKey],
      total: data?.[totalKey],
      sortKey: sort.key,
      sortDirection: sort.direction,
      rowsPerPage,
      page: (range.offset || 0) / rowsPerPage || 0,
      onPageChange,
      onRowsPerPageChange,
      onSortChange,
      columns,
    },
    filter: {
      filter,
      setFilter,
      onFilterSubmit,
    },
  };
};

export default useTable;
