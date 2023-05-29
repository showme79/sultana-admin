import { GridList, GridListTile, GridListTileBar, Paper, TablePagination, withStyles } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { ImageWidth, rowsPerPageOptionsThumbs } from 'consts';
import { ActionsPropType } from 'consts/prop-types';
import { getMediaUrl } from 'utils';
import { ExActions } from 'view/base';

import styles from './ExGridList.styles';
import ExTableToolbar from './ExTableToolbar';

class ExGridList extends Component {
  onPageChange = (event, page) => {
    const { onPageChange } = this.props;
    return onPageChange?.(page, event);
  };

  onRowsPerPageChange = (event) => {
    const { onRowsPerPageChange } = this.props;
    return onRowsPerPageChange?.(event.target.value, event);
  };

  render() {
    const {
      classes,
      className,
      title,
      items,
      selected,
      rowsPerPage,
      page,
      selectActions,
      filter,
      actions,
      total,
      itemActions,
      onItemActionClick,
      onActionClick,
    } = this.props;

    return (
      <Paper className={clsx(classes.root, className)}>
        <ExTableToolbar
          className={classes.toolbar}
          title={title}
          selected={selected}
          filter={filter}
          actions={actions}
          selectActions={selectActions}
          onActionClick={onActionClick}
        />
        <div className={classes.tableWrapper}>
          <GridList cellHeight={180} className={classes.grid} cols={5} spacing={16}>
            {items.map((item) => (
              <GridListTile
                key={item.id}
                className={classes.gridTile}
                style={{ backgroundImage: `url(${getMediaUrl(item, ImageWidth.THUMBNAIL)})` }}
              >
                <GridListTileBar
                  title={item.title}
                  actionIcon={
                    <ExActions
                      actions={itemActions}
                      classes={{ iconButton: classes.iconButton }}
                      context={item}
                      onActionClick={onItemActionClick}
                    />
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptionsThumbs}
          component="div"
          count={total || items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{ 'aria-label': 'Következő oldal' }}
          nextIconButtonProps={{ 'aria-label': 'Előző oldal' }}
          onPageChange={this.onPageChange}
          onRowsPerPageChange={this.onRowsPerPageChange}
        />
      </Paper>
    );
  }
}

ExGridList.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    toolbar: PropTypes.string,
    tableWrapper: PropTypes.string,
    grid: PropTypes.string,
    gridTile: PropTypes.string,
    iconButton: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  total: PropTypes.number,
  rowsPerPage: PropTypes.number,
  page: PropTypes.number,
  selected: PropTypes.arrayOf(PropTypes.shape({})),
  itemActions: ActionsPropType,
  selectActions: ActionsPropType,
  filter: PropTypes.node,
  actions: ActionsPropType,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onItemActionClick: PropTypes.func,
  onActionClick: PropTypes.func,
};

ExGridList.defaultProps = {
  className: '',
  total: 0,
  rowsPerPage: 50,
  page: 0,
  selected: [],
  itemActions: undefined,
  selectActions: undefined,
  filter: undefined,
  actions: undefined,
  onPageChange: undefined,
  onRowsPerPageChange: undefined,
  onItemActionClick: undefined,
  onActionClick: undefined,
};

export default withStyles(styles)(ExGridList);
