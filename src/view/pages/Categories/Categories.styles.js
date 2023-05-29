export default (theme) => ({
  root: {
    width: '100%',
    //    marginTop: theme.spacing(3),
  },
  filter: {
    padding: [[0, theme.spacing(1), 0, theme.spacing(1)]],
  },
  column: {
    '&.col-select': {
      width: '1%',
    },
    '&.col-name': {
      width: '48%',
      fontWeight: 500,
    },
    '&.col-segments': {
      width: '10%',
      fontWeight: 500,
    },
    '&.col-created, &.col-updated': {
      width: '20%',
    },
    '&.col-created .user-info, &.col-updated .user-info': {
      fontWeight: 700,
      marginBottom: theme.spacing(0.5),
    },
    '&.col-created .date-info, &.col-updated .date-info': {
      fontSize: '0.75rem',
    },
    '&.col-actions': {
      width: '1%',
      whiteSpace: 'nowrap',
      textAlign: 'right',
    },
  },
});
