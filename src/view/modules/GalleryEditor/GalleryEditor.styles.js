export default (/* theme */) => ({
  root: {},
  slugGrid: {
    flexDirection: 'row',
    display: 'flex',
  },
  slugFormControl: {
    paddingLeft: 8,
    '&::before': {
      content: "'/'",
      top: 6,
      fontSize: '1.2rem',
    },
  },
});
