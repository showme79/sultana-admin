export default (theme) => ({
  root: {
    width: '100%',

    //    marginTop: theme.spacing(3),
    '& .col-title': {
      width: '74%',
    },
    '& .col-surveyAnswerCount': {
      whiteSpace: 'nowrap',
      width: '10%',
    },
    '& .col-created': {
      width: '15%',
    },
    '& .col-created .user-info': {
      fontWeight: 700,
      marginBottom: theme.spacing(0.5),
    },
    '& .col-created .date-info': {
      fontSize: '0.75rem',
    },
    '& .col-actions': {
      width: '1%',
      whiteSpace: 'nowrap',
      textAlign: 'right',
      padding: [[0, theme.spacing(4)]],
    },
  },
});
