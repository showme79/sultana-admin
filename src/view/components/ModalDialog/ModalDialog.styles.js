export default (theme) => ({
  root: {
    position: 'absolute',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(2),
    flex: '0 auto',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  content: {
    margin: 0,
    padding: theme.spacing(2),
    flex: '1 auto',
  },
  actions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
    flex: '0 auto',
  },
  paper: {},
});
