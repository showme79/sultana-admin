export default (theme) => ({
  root: {
    width: '100%',
    //    marginTop: theme.spacing(3),
  },
  column: {
    '&.col-select': {
      width: '1%',
    },
    '&.col-id': {
      width: '20%',
    },
    '&.col-email': {
      width: '3 0%',
    },
    '&.col-created, &.col-type': {
      width: '10%',
    },
    '&.col-created, &.col-status': {
      width: '20%',
      fontWeight: 700,
    },
    '&.col-created .date-info, &.col-status .date-info': {
      fontSize: '0.75rem',
      fontWeight: 500,
    },
    '&.col-status .user-username': {
      fontSize: '0.75rem',
    },
    '&.col-created .user-info, &.col-status .user-info': {
      fontWeight: 500,
      marginBottom: theme.spacing(0.5),
    },
    '&.col-actions': {
      width: '19%',
      whiteSpace: 'nowrap',
      textAlign: 'right',
    },
  },
});
