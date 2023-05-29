import { CardContent, Paper, Table, TableBody, TablePagination, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { SortDirection, rowsPerPageOptions } from 'consts';
import { ActionsPropType } from 'consts/prop-types';
import { calculateSort } from 'utils';

import styles from './ExTable.styles';
import ExTableHead from './ExTableHead';
import ExTableRow from './ExTableRow';
import ExTableToolbar from './ExTableToolbar';

const useStyles = makeStyles(styles, { name: 'ExTable' });

const ExTable = ({
  classes,
  className,
  title,
  items,
  itemActions,
  idProperty,
  sortKey,
  sortDirection,
  columns,
  selected,
  rowsPerPage,
  page,
  selectActions,
  filter,
  actions,
  total,
  Row,
  onActionClick,
  onItemClick,
  onItemSelect,
  onItemActionClick,
  onRowsPerPageChange,
  onPageChange,
  onSortChange,
  onSelectAll,
  TableToolbarProps,
  TableProps,
  TableBodyProps,
  TableHeadProps,
  TableRowProps,
  TableCellProps,
  TablePaginationProps,
  ...props
}) => {
  const cls = useStyles({ classes });
  const handleItemClick = useCallback((item) => (event) => onItemClick && onItemClick(item, event), [onItemClick]);

  const handleItemSelect = useCallback(
    (item) => (event) => {
      event.stopPropagation();
      return onItemSelect && onItemSelect(item[idProperty], item, event);
    },
    [onItemSelect, idProperty],
  );

  const handleItemActionClick = useCallback(
    (action, item, event) => {
      event.stopPropagation();
      return onItemActionClick && onItemActionClick(action, item, event);
    },
    [onItemActionClick],
  );

  const handleActionClick = useCallback(
    (action, context, event) => onActionClick && onActionClick(action, selected, event),
    [selected, onActionClick],
  );

  const handlePageChange = useCallback(
    (event, newPage) => onPageChange && onPageChange(newPage, event),
    [onPageChange],
  );

  const handleRowsPerPageChange = useCallback(
    (event) => onRowsPerPageChange && onRowsPerPageChange(event.target.value, event),
    [onRowsPerPageChange],
  );

  const handleSortChange = useCallback(
    (column /* , event */) => onSortChange && onSortChange(calculateSort(sortKey, sortDirection, column)),
    [sortKey, sortDirection, onSortChange],
  );

  const handleSelectAll = useCallback((event) => onSelectAll && onSelectAll(event), [onSelectAll]);

  const itemCount = items?.length || 0;

  return (
    <Paper className={clsx(cls.root, className)} {...props}>
      <ExTableToolbar
        className={cls.toolbar}
        title={title}
        selected={selected}
        filter={filter}
        actions={actions}
        selectActions={selectActions}
        onActionClick={handleActionClick}
        {...TableToolbarProps}
      />
      <CardContent className={cls.tableWrapper}>
        <Table className={cls.table} aria-labelledby="tableTitle" {...TableProps}>
          <ExTableHead
            className={cls.head}
            classes={{ row: cls.headRow, column: cls.column }}
            columns={columns}
            numSelected={selected.length}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSelectAll={onSelectAll && handleSelectAll}
            onSortChange={handleSortChange}
            rowCount={itemCount}
            actions={!!itemActions}
            {...TableHeadProps}
          />
          <TableBody {...TableBodyProps}>
            {(items || []).map((item) => {
              const id = item[idProperty];
              return (
                <Row
                  key={id}
                  className={cls.row}
                  classes={{ column: cls.column }}
                  columns={columns}
                  itemId={id}
                  item={item}
                  itemActions={itemActions}
                  onItemClick={handleItemClick}
                  onItemSelect={onItemSelect && handleItemSelect}
                  onItemActionClick={handleItemActionClick}
                  selected={selected.indexOf(id) >= 0}
                  TableCellProps={TableCellProps}
                  {...TableRowProps}
                />
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      {rowsPerPage < (total || itemCount) && (
        <TablePagination
          className={cls.pagination}
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={total || itemCount}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{ 'aria-label': 'Következő oldal' }}
          nextIconButtonProps={{ 'aria-label': 'Előző oldal' }}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          {...TablePaginationProps}
        />
      )}
    </Paper>
  );
};

ExTable.propTypes = {
  classes: PropTypes.shape({}),
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  idProperty: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  total: PropTypes.number,
  sortKey: PropTypes.string,
  sortDirection: PropTypes.string,
  rowsPerPage: PropTypes.number,
  page: PropTypes.number,
  selected: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  Row: PropTypes.elementType,
  itemActions: ActionsPropType,
  selectActions: ActionsPropType,
  filter: PropTypes.node,
  actions: ActionsPropType,
  onSortChange: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onItemSelect: PropTypes.func,
  onItemClick: PropTypes.func,
  onItemActionClick: PropTypes.func,
  onSelectAll: PropTypes.func,
  onActionClick: PropTypes.func,
  TableToolbarProps: PropTypes.shape({}),
  TableProps: PropTypes.shape({}),
  TableBodyProps: PropTypes.shape({}),
  TableRowProps: PropTypes.shape({}),
  TableCellProps: PropTypes.shape({}),
  TableHeadProps: PropTypes.shape({}),
  TablePaginationProps: PropTypes.shape({}),
};

ExTable.defaultProps = {
  classes: {},
  className: '',
  idProperty: 'id',
  sortKey: null,
  sortDirection: SortDirection.ASC,
  total: 0,
  rowsPerPage: 25,
  page: 0,
  items: [],
  selected: [],
  itemActions: undefined,
  selectActions: undefined,
  filter: undefined,
  actions: undefined,
  onSortChange: undefined,
  onPageChange: undefined,
  onRowsPerPageChange: undefined,
  onItemClick: undefined,
  onItemSelect: undefined,
  onItemActionClick: undefined,
  onSelectAll: undefined,
  onActionClick: undefined,
  Row: ExTableRow,
  TableToolbarProps: {},
  TableProps: {},
  TableBodyProps: {},
  TableHeadProps: {},
  TableRowProps: {},
  TableCellProps: {},
  TablePaginationProps: {},
};

export default ExTable;
