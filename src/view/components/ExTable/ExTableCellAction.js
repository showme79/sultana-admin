import { TableCell } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

import { ActionsPropType } from 'consts/prop-types';
import { ExActions } from 'view/base';

const ExTableCellAction = ({ actions, item, onActionClick, ...props }) => (
  <TableCell {...props}>
    <ExActions actions={actions} context={item} onActionClick={onActionClick} />
  </TableCell>
);

ExTableCellAction.propTypes = {
  align: PropTypes.oneOf(['center', 'inherit', 'justify', 'left', 'right']),
  padding: PropTypes.oneOf(['normal', 'checkbox', 'none', 'left', 'right']),
  actions: ActionsPropType,
  onActionClick: PropTypes.func.isRequired,
  item: PropTypes.shape({}).isRequired,
};

ExTableCellAction.defaultProps = {
  align: 'left',
  padding: 'normal',
  actions: undefined,
};

export default ExTableCellAction;
