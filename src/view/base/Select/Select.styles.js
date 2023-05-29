import { emphasize } from '@material-ui/core/styles/colorManipulator';

export default (theme) => ({
  root: {
    flexGrow: 1,
    '& label + .MuiInput-formControl': {
      marginTop: 16,
    },
  },
  input: {
    display: 'flex',
    marginTop: '-4px',
    height: 'auto',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'flex-end',
    marginBottom: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  chip: {
    //    margin: `${theme.spacing() / 2}px ${theme.spacing() / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing()}px ${theme.spacing(2)}px`,
  },
  singleValue: {
    fontSize: '1rem',
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: '1rem',
  },
  paper: {
    position: 'absolute',
    zIndex: 3,
    marginTop: theme.spacing(),
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing(2),
  },
});
