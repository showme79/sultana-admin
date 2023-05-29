export default (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 'auto',
  },
  formControl: {},
  modalDialogContent: {
    display: 'block',
  },
  editor: {
    display: 'flex',
    flexDirection: 'row',

    '& .editor-left': {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      flex: 2,
      marginRight: theme.spacing(1),
    },
    '& .editor-right': {
      flex: 1,
    },
  },
  code: {
    fontFamily: 'Courier New, Monospace',
    fontSize: 12,
    '&::placeholder': {
      fontFamily: 'Roboto',
      fontSize: 16,
    },
  },
  contentModeSelector: {
    textAlign: 'left',
  },
  viewModeSelector: {
    textAlign: 'right',
  },
  flexRow: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
  slugFormControl: {
    paddingLeft: 8,
    '&::before': {
      content: "'/'",
      top: 6,
      fontSize: '1.2rem',
    },
  },
});
