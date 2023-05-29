export default (theme) => ({
  root: {
    lineHeight: 1,
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    '& .title': { flex: 1 },
    '& .progress': {
      color: theme.palette.common.black,
      flex: [[0, 'auto']],
      marginLeft: theme.spacing(4),
    },
  },
  progress: {
    color: theme.palette.common.white,
  },
});
