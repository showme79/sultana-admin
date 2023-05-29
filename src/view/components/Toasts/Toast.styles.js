import { amber, green } from '@material-ui/core/colors';

import { MsgType } from 'consts';

export default (theme) => ({
  [MsgType.SUCCESS]: {
    backgroundColor: green[600],
  },
  [MsgType.ERROR]: {
    backgroundColor: theme.palette.error.dark,
  },
  [MsgType.INFO]: {
    backgroundColor: theme.palette.primary.dark,
  },
  [MsgType.WARNING]: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconType: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});
