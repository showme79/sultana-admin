export default (theme) => ({
  root: {
    width: '100%',
    //    marginTop: theme.spacing(3),
  },
  column: {
    '&.col-select': {
      width: '1%',
    },
    '&.col-name': {
      width: '58%',
      fontWeight: 500,
    },
    '&.col-created, &.col-updated': {
      width: '20%',
    },
    '&.col-username .user-info': {
      fontWeight: 700,
      marginBottom: theme.spacing(0.5),
    },
    '&.col-username .user-username': {
      fontSize: '0.75rem',
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
