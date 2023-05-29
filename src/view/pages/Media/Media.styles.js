export default (theme) => ({
  root: {
    width: '100%',
    //    marginTop: theme.spacing(3),
  },
  filter: {
    '& > *': {
      padding: [[0, theme.spacing(4)]],
    },
  },
});
