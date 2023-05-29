export default (theme) => ({
  root: {
    width: '100%',
    //    marginTop: theme.spacing(3),
  },
  filter: {
    paddingLeft: 16,
    paddingRight: 16,
    '& .name': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
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
    '&.col-created': {
      width: '20%',
    },
    '&.col-created .user-info': {
      fontWeight: 700,
      marginBottom: theme.spacing(0.5),
    },
    '&.col-created .date-info': {
      fontSize: '0.75rem',
    },
    '&.col-actions': {
      width: '1%',
      whiteSpace: 'nowrap',
      textAlign: 'right',
    },
  },
});
