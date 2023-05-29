import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { useSubscriptionTypes } from 'hooks';
import { Dialog } from 'view/base';

import styles from './AddSubscriptionTypeDialog.styles';
import AddSubscriptionTypeForm from './AddSubscriptionTypeForm';

const useStyles = makeStyles(styles, { name: 'AddSubscriptionTypeDialog' });

const AddSubscriptionTypeDialog = ({ classes, onClose, ...props }) => {
  const { addSubscriptionType } = useSubscriptionTypes();
  const cls = useStyles({ classes });

  const onSubmit = useCallback(
    ({ title }) => addSubscriptionType(title).then(() => onClose()),
    [addSubscriptionType, onClose],
  );

  return (
    <Dialog
      className={cls.root}
      fullWidth
      open
      title="Feliratkozási listatípus hozzáadása"
      maxWidth="sm"
      onClose={onClose}
      {...props}
    >
      <AddSubscriptionTypeForm onSubmit={onSubmit} />
    </Dialog>
  );
};

AddSubscriptionTypeDialog.propTypes = {
  classes: PropTypes.shape({}),
  onClose: PropTypes.func,
};

AddSubscriptionTypeDialog.defaultProps = {
  classes: {},
  onClose: undefined,
};

export default AddSubscriptionTypeDialog;
