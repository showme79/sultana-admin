export default (theme) => ({
  root: {
    width: '100%',
    //    marginTop: theme.spacing(3),
  },
  filter: {
    '& .segments': {
      paddingLeft: 16,
      paddingRight: 16,
    },
  },
  column: {
    '&.col-select': {
      width: '1%',
    },
    '&.col-name': {
      width: '28%',
      fontWeight: 500,
    },
    '&.col-segment': {
      width: '15%',
      fontWeight: 500,
    },
    '&.col-position': {
      width: '30%',
      fontWeight: 500,
    },
    '&.col-priority': {
      width: '5%',
      fontWeight: 500,
    },
    '&.col-status': {
      width: '10%',
      fontWeight: 500,
    },
    '&.col-created, &.col-updated': {
      width: '10%',
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
