// import { green, amber } from '@material-ui/core/colors';

export default (theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    height: '100vh',
  },

  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: [[0, theme.spacing(2)]],
    height: 48,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden',
  },
  viewport: {
    position: 'relative',
    flexGrow: 1,
    overflow: 'hidden',
  },
  main: {
    position: 'absolute',
    overflow: 'auto',
    padding: theme.spacing(2),
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  modal: {},
});
