import {
  AppBar,
  CardContent,
  CardMedia,
  IconButton,
  MenuItem,
  MenuList,
  Popover,
  Toolbar,
  Typography,
  withStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { UserPropType } from 'consts/prop-types';
import { AccountCircleIcon, MenuIcon } from 'icons';
import { getDisplayName } from 'utils';

import styles from './Header.styles';
import Jobs from './Jobs';

class Header extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      menuAnchorEl: null,
    };
  }

  onMenuItemClick = (action) => (event) => {
    this.setState({ menuAnchorEl: null });
    const { onMenuItemClick } = this.props;
    onMenuItemClick(action, event);
  };

  onMenuOpenClick = (event) => this.setState({ menuAnchorEl: event.currentTarget });

  onMenuCloseClick = (/* event */) => this.setState({ menuAnchorEl: null });

  renderProfileMenu = () => {
    const { classes, user } = this.props;
    const { menuAnchorEl } = this.state;
    const origin = { vertical: 'top', horizontal: 'left' };
    const displayName = getDisplayName(user);

    return (
      <Popover
        anchorEl={menuAnchorEl}
        anchorOrigin={origin}
        transformOrigin={origin}
        open={!!menuAnchorEl}
        onClose={this.onMenuCloseClick}
      >
        {user && (
          <CardContent className={classes.profileInfo}>
            <AccountCircleIcon />
            <Typography className={classes.profileUsername} variant="subtitle1" color="inherit" noWrap>
              {displayName}
            </Typography>
          </CardContent>
        )}
        <MenuList>
          <MenuItem onClick={this.onMenuItemClick('my-account')} disabled>
            Fiók módosítása...
          </MenuItem>
          <MenuItem onClick={this.onMenuItemClick('logout')}>Kijelentkezés</MenuItem>
        </MenuList>
      </Popover>
    );
  };

  render() {
    const { classes, title, logo, user, onMenuItemClick, onNavClick } = this.props;
    const { menuAnchorEl } = this.state;

    const displayName = getDisplayName(user, true, 'Kijelentkezve');

    return (
      <>
        <AppBar position="fixed" className={classes.root}>
          <Toolbar className={classes.toolbar}>
            {onNavClick && (
              <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer" onClick={onNavClick}>
                <MenuIcon />
              </IconButton>
            )}
            <div className={classes.title}>
              {logo && <CardMedia className={classes.logo} title={title} image={logo} />}
              <Typography variant="subtitle1" color="inherit" noWrap>
                {title}
              </Typography>
            </div>
            {user && <Jobs className={classes.jobs} />}
            <Typography className={classes.username} variant="subtitle1" color="inherit" noWrap>
              {displayName}
            </Typography>
            <div className={classes.menu}>
              {onMenuItemClick && (
                <IconButton
                  color="inherit"
                  aria-owns={menuAnchorEl ? 'material-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.onMenuOpenClick}
                >
                  <AccountCircleIcon />
                </IconButton>
              )}
            </div>
          </Toolbar>
        </AppBar>
        {this.renderProfileMenu()}
      </>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  logo: PropTypes.node,
  user: UserPropType,
  onNavClick: PropTypes.func,
  onMenuItemClick: PropTypes.func,
};

Header.defaultProps = {
  logo: null,
  user: undefined,
  onNavClick: undefined,
  onMenuItemClick: undefined,
};

export default withStyles(styles)(Header);
