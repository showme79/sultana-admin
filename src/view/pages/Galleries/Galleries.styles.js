export default (theme) => ({
  root: {
    width: '100%',
  },
  filter: {
    '& > *': {
      padding: [[0, theme.spacing(4)]],
    },
  },
  row: {},
  column: {
    '&.col-select': {
      width: '1%',
    },
    '&.col-title': {
      width: '43%',
      fontWeight: 500,
    },
    '&.col-media': {
      width: '27%',
      fontWeight: 500,
    },
    '&.col-created': {
      width: '13%',
    },
    '&.col-created .user-info': {
      fontWeight: 700,
      marginBottom: theme.spacing(0.5),
    },
    '&.col-created .date-info': {
      fontSize: '0.75rem',
    },
    '&.col-status': {
      width: '8%',
    },
    '&.col-status .text-value': {
      fontWeight: 700,
      marginBottom: theme.spacing(0.5),
    },
    '&.col-status .user-info': {
      fontWeight: 500,
      fontSize: '0.75rem',
    },
    '&.col-status .date-info': {
      fontSize: '0.75rem',
    },
    '&.col-actions': {
      width: '1%',
      whiteSpace: 'nowrap',
      textAlign: 'right',
    },
  },
});
