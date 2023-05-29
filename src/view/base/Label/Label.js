import { Grid, Tooltip, makeStyles } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import PropTypes from 'prop-types';
import React, { memo } from 'react';

const useStyles = makeStyles(
  {
    root: {
      '& .info-icon': {
        paddingBottom: 4,
      },
    },
  },
  {
    name: 'Label',
  },
);

const Label = ({ tooltip, children }) => {
  const classes = useStyles();
  if (!tooltip) {
    return children;
  }

  return (
    <Tooltip title={tooltip}>
      <Grid className={classes.root} container alignItems="baseline" wrap="nowrap">
        <Grid item>{children}</Grid>
        <Grid item className="info-icon" component={InfoIcon} fontSize="small" />
      </Grid>
    </Tooltip>
  );
};

Label.propTypes = {
  children: PropTypes.node.isRequired,
  tooltip: PropTypes.node,
};

Label.defaultProps = {
  tooltip: undefined,
};

export default memo(Label);
