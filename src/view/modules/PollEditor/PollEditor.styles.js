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
  postsTable: {
    width: '100%',
    '& .col-title': { width: '60%' },
    '& .col-status': { width: '15%' },
    '& .col-voteCount': { width: '10%' },
    '& .col-created': { width: '15%' },
  },
});
