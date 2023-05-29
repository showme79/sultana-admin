export default (/* theme */) => ({
  root: {
    width: '100%',
  },
  column: {
    '&.col-name': {
      width: '25%',
      fontWeight: 500,
    },
    '&.col-value': {
      width: '74%',
      fontWeight: 500,
    },
    '&.col-actions': {
      width: '1%',
      whiteSpace: 'nowrap',
      textAlign: 'right',
    },
  },
});
