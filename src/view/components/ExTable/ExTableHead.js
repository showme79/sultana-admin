import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel, Tooltip } from '@material-ui/core';
import clsx from 'clsx';
import { isString } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class ExTableHead extends Component {
  static tooltipPlacements = {
    left: 'bottom-start',
    right: 'bottom-end',
    center: 'bottom',
  };

  onSortClick = (column) => (event) => {
    const { onSortChange } = this.props;
    return onSortChange?.(column, event);
  };

  render() {
    const { className, classes, onSelectAll, sortKey, sortDirection, numSelected, rowCount, columns, actions } =
      this.props;
    const direction = (sortDirection || '').toLowerCase();

    const indeterminate = (rowCount && numSelected && numSelected < rowCount) || false;
    const checked = (rowCount && numSelected === rowCount) || false;
    return (
      <TableHead className={className}>
        <TableRow className={classes.row}>
          {onSelectAll && (
            <TableCell className={clsx(classes.column, 'col-select')} padding="checkbox">
              <Checkbox indeterminate={indeterminate} disabled={!rowCount} checked={checked} onChange={onSelectAll} />
            </TableCell>
          )}
          {columns.map((column) => {
            const { id, label, sortable = true, align = 'left', padding = 'default' } = column;
            const sortKeyColumn = isString(sortable) ? sortable : id;
            const tooltipPlacement = ExTableHead.tooltipPlacements[align];
            return (
              <TableCell
                key={id}
                className={clsx(classes.column, `col-${id}`)}
                align={align}
                padding={padding}
                sortDirection={sortKey === sortKeyColumn ? direction : false}
              >
                <Tooltip title={label} placement={tooltipPlacement} enterDelay={300}>
                  {sortable && sortKey ? (
                    <TableSortLabel
                      active={sortKey === sortKeyColumn}
                      direction={direction}
                      onClick={this.onSortClick(column)}
                    >
                      {label}
                    </TableSortLabel>
                  ) : (
                    <span>{label}</span>
                  )}
                </Tooltip>
              </TableCell>
            );
          })}
          {actions && <TableCell className={clsx(classes.column, 'col-actions')} padding="none" />}
        </TableRow>
      </TableHead>
    );
  }
}

ExTableHead.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.shape({
    row: PropTypes.string,
    column: PropTypes.string,
  }),
  columns: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  sortKey: PropTypes.string,
  sortDirection: PropTypes.string,
  numSelected: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  actions: PropTypes.bool,
  onSortChange: PropTypes.func,
  onSelectAll: PropTypes.func,
};

ExTableHead.defaultProps = {
  className: '',
  classes: {},
  sortKey: undefined,
  sortDirection: undefined,
  actions: false,
  onSortChange: () => {},
  onSelectAll: undefined,
};

export default ExTableHead;
