export default (/* theme */) => ({
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
  dropZoneRoot: {},
  dropZoneImage: {},
});
