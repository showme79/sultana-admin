import { Toolbar, Typography } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import { ActionsPropType } from 'consts/prop-types';
import { ExActions } from 'view/base';

const ExTableToolbar = ({ className, title, selected, actions, selectActions, onActionClick, filter }) => {
  const selectCount = selected.length;
  const rootCls = clsx(className, { highlight: selectCount > 0 });

  return (
    <>
      <Toolbar className={rootCls}>
        <div className="title">
          {selectCount ? (
            <Typography color="inherit" variant="subtitle1">
              {title} ({selectCount} elem kiválasztva)
            </Typography>
          ) : (
            <Typography variant="h6" id="tableTitle">
              {title}
            </Typography>
          )}
        </div>
        <div className="spacer" />
        <div className="actions">
          {selectCount > 0 && selectActions && (
            <ExActions actions={selectActions} context={selected} onActionClick={onActionClick} />
          )}
          {!selectCount && actions && <ExActions actions={actions} onActionClick={onActionClick} />}
        </div>
      </Toolbar>
      {filter}
    </>
  );
};
ExTableToolbar.propTypes = {
  className: PropTypes.string,
  selected: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  title: PropTypes.string.isRequired,
  filter: PropTypes.node,
  actions: ActionsPropType,
  selectActions: ActionsPropType,
  onActionClick: PropTypes.func,
};

ExTableToolbar.defaultProps = {
  className: '',
  selected: [],
  filter: undefined,
  actions: undefined,
  selectActions: undefined,
  onActionClick: undefined,
};

export default ExTableToolbar;
