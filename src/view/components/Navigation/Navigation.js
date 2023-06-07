import { Badge, Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { isFunction } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { StatsPropTypes } from 'consts/prop-types';

import styles from './Navigation.styles';

const useStyles = makeStyles(styles, { name: 'Navigation' });

const Navigation = ({ open, onClose, modules, moduleId, stats, onModuleClick }) => {
  const classes = useStyles();
  const handleModuleClick = useCallback(
    (event) => {
      const newModule = modules.find(({ id }) => id === event.currentTarget.dataset.moduleId);
      if (newModule) {
        onModuleClick?.(newModule, event);
      }
    },
    [modules, onModuleClick],
  );

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
        {modules.map(({ id, icon: Icon, text, badge }) => {
          if (id.startsWith('divider-')) {
            return <ListItem key={id} divider />;
          }

          const badgeContent = isFunction(badge) ? badge(stats) : badge;

          return (
            <ListItem
              button
              key={id}
              className={clsx(classes.listItem, { active: moduleId === id })}
              data-module-id={id}
              onClick={handleModuleClick}
            >
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
};

Navigation.propTypes = {
  stats: StatsPropTypes.isRequired,
  modules: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  moduleId: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onModuleClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

Navigation.defaultProps = {
  moduleId: null,
};

export default React.memo(Navigation);
