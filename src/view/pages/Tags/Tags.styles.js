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
      width: '43%',
      fontWeight: 500,
    },
    '&.col-segments': {
      width: '10%',
      fontWeight: 500,
    },
    '&.col-created, &.col-status': {
      width: '20%',
    },
    '&.col-created .user-info, &.col-status .text-value': {
      fontWeight: 700,
      marginBottom: theme.spacing(0.5),
    },
    '&.col-created .date-info, &.col-status .date-info, &.col-status .user-info': {
      fontSize: '0.75rem',
    },
    '&.col-actions': {
      width: '1%',
      whiteSpace: 'nowrap',
      textAlign: 'right',
    },
  },
});
