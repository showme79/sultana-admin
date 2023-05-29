import { TableCell } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const ExTableCell = ({
  value,
  padding,
  align,
  column,
  columns,
  columnId,
  selected,
  itemActions,
  item,
  itemId,
  onItemClick,
  onItemSelect,
  onItemActionClick,
  children,
  ...props
}) => (
  <TableCell padding={padding} align={align} {...props}>
    {value}
    {children}
  </TableCell>
);

ExTableCell.propTypes = {
  align: PropTypes.oneOf(['center', 'inherit', 'justify', 'left', 'right']),
  padding: PropTypes.oneOf(['default', 'checkbox', 'none', 'left', 'right']),
  column: PropTypes.shape({}).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  columnId: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  value: PropTypes.node,
  children: PropTypes.node,
  itemActions: PropTypes.arrayOf(PropTypes.shape({})),
  item: PropTypes.any, // eslint-disable-line
  itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, //eslint-disable-line
  onItemClick: PropTypes.func,
  onItemSelect: PropTypes.func,
  onItemActionClick: PropTypes.func,
};

ExTableCell.defaultProps = {
  item: undefined,
  align: 'left',
  padding: 'default',
  selected: false,
  value: null,
  children: null,
  itemActions: null,
  onItemClick: null,
  onItemSelect: null,
  onItemActionClick: null,
};

export default ExTableCell;
