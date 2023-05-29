import { Checkbox, TableCell, TableRow } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import { ActionsPropType } from 'consts/prop-types';

import ExTableCell from './ExTableCell';
import ExTableCellAction from './ExTableCellAction';

const ExTableRow = ({
  classes,
  columns,
  itemActions,
  itemId,
  item,
  selected,
  getRowClassName,
  onItemClick,
  onItemSelect,
  onItemActionClick,
  TableCellProps,
  ...props
}) => {
  const CellProps = {
    itemActions,
    item,
    itemId,
    selected,
    onItemClick,
    onItemSelect,
    onItemActionClick,
  };

  return (
    <TableRow
      classes={{ root: clsx(classes.row, getRowClassName?.(item)) }} // className is not working here
      hover
      role="checkbox"
      aria-checked={selected}
      tabIndex={-1}
      selected={selected}
      onClick={onItemClick && onItemClick(item)}
      {...props}
    >
      {onItemSelect && (
        <TableCell className={clsx(classes.column, 'col-select')} padding="checkbox">
          <Checkbox checked={selected} onClick={onItemSelect(item)} />
        </TableCell>
      )}
      {columns.map((column) => {
        const { id: columnId, Cell = ExTableCell, align, padding } = column;
        return (
          <Cell
            key={columnId}
            className={clsx(classes.column, `col-${columnId}`)}
            value={item[columnId]}
            align={align}
            padding={padding}
            column={column}
            columns={columns}
            columnId={columnId}
            selected={selected}
            {...CellProps}
            {...TableCellProps}
          />
        );
      })}
      {itemActions && (
        <ExTableCellAction
          className={clsx(classes.column, 'col-actions')}
          actions={itemActions}
          item={item}
          onActionClick={onItemActionClick}
          padding="none"
        />
      )}
    </TableRow>
  );
};

ExTableRow.propTypes = {
  classes: PropTypes.shape({
    row: PropTypes.string,
    column: PropTypes.string,
  }),
  itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  item: PropTypes.shape({
    status: PropTypes.string,
  }).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  itemActions: ActionsPropType,
  selected: PropTypes.bool,
  onItemClick: PropTypes.func,
  onItemSelect: PropTypes.func,
  onItemActionClick: PropTypes.func,
  TableCellProps: PropTypes.shape({}),
  getRowClassName: PropTypes.func,
};

ExTableRow.defaultProps = {
  classes: {},
  itemActions: null,
  selected: false,
  onItemClick: null,
  onItemSelect: null,
  onItemActionClick: null,
  TableCellProps: {},
  getRowClassName: null,
};

export default ExTableRow;
