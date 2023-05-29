import { Badge, Drawer, List, ListItem, ListItemIcon, ListItemText, withStyles } from '@material-ui/core';
import clsx from 'clsx';
import { isFunction } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './Navigation.styles';

class Navigation extends Component {
  onModuleClick = (module) => (event) => {
    const { onModuleClick } = this.props;
    return onModuleClick?.(module, event);
  };

  render() {
    const { classes, open, onClose, modules, moduleId, stats } = this.props;
    const classNamePaper = classes[open ? 'drawerOpen' : 'drawerClose'];
    return (
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, classNamePaper)}
        classes={{ paper: classNamePaper }}
        open={open}
        onClose={onClose}
      >
        <div className={classes.toolbar} />
        <List className={classes.list}>
          {modules.map((module) => {
            const { id, icon: Icon, text, badge } = module;

            if (id.startsWith('divider-')) {
              return <ListItem key={id} divider />;
            }

            const activeCls = classes[moduleId === id.listItem ? 'listItemActive' : 'listItem'];
            const badgeContent = isFunction(badge) ? badge(stats) : badge;

            return (
              <ListItem button key={id} className={activeCls} onClick={this.onModuleClick(module)}>
                {Icon && (
                  <ListItemIcon>
                    <Badge
                      badgeContent={badgeContent || ''}
                      invisible={!badgeContent}
                      color="primary"
                      title={text}
                      overlap="rectangular"
                    >
                      <Icon />
                    </Badge>
                  </ListItemIcon>
                )}
                <ListItemText primary={text} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  stats: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  modules: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  moduleId: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onModuleClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

Navigation.defaultProps = {
  moduleId: null,
};

export default withStyles(styles)(Navigation);
