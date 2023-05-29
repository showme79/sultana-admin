import { Avatar, Chip, colors, withStyles } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import { get, values } from 'lodash-es';
import PropTypes from 'prop-types';
import React from 'react';

import { TagStatus } from 'consts';
import { CancelIcon } from 'icons';

export const ColoredChip = ({ color, ...props }) => {
  const colorHighlight = emphasize(color, 0.8);
  const styles = {
    root: { color, borderColor: color },
    avatar: { color: colorHighlight, backgroundColor: color, marginLeft: 0 },
  };
  const StyledChip = withStyles(styles)(Chip);

  return <StyledChip {...props} />;
};

ColoredChip.propTypes = {
  color: PropTypes.string.isRequired,
};

export const CategoryChip = ({ color: categoryColor, name, ...props }) => {
  const color = (categoryColor || '').startsWith('#') ? categoryColor : get(colors, categoryColor);

  return color ? (
    <ColoredChip
      variant="outlined"
      avatar={<Avatar>{name.substr(0, 1).toUpperCase()}</Avatar>}
      label={name}
      color={color}
      {...props}
    />
  ) : (
    <Chip variant="outlined" avatar={<Avatar>{name.substr(0, 1).toUpperCase()}</Avatar>} label={name} {...props} />
  );
};

CategoryChip.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export const TagChip = ({ status, name, ...props }) => {
  const color = status === TagStatus.APPROVED ? green[400] : red[400];

  return <ColoredChip variant="outlined" label={name} color={color} {...props} />;
};

TagChip.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.oneOf(values(TagStatus)).isRequired,
};

export const SelectCategoryChip = ({ data: { name, color }, removeProps }) => (
  <CategoryChip
    tabIndex={-1}
    name={name}
    color={color}
    onDelete={removeProps.onClick}
    deleteIcon={<CancelIcon {...removeProps} />}
  />
);

SelectCategoryChip.propTypes = {
  data: PropTypes.shape(CategoryChip.propTypes).isRequired,
  removeProps: PropTypes.shape({
    onClick: PropTypes.func,
  }).isRequired,
};

export const SelectTagChip = ({ data: { name, status }, removeProps }) => (
  <TagChip
    tabIndex={-1}
    name={name}
    status={status}
    onDelete={removeProps.onClick}
    deleteIcon={<CancelIcon {...removeProps} />}
  />
);

SelectTagChip.propTypes = {
  data: PropTypes.shape(TagChip.propTypes).isRequired,
  removeProps: PropTypes.shape({
    onClick: PropTypes.func,
  }).isRequired,
};
