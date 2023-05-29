import { lighten } from '@material-ui/core/styles/colorManipulator';

export default ({ palette, spacing }) => ({
  root: {
    width: '100%',
  },
  toolbar: {
    paddingRight: spacing(1),
    '&.highlight': {
      color: palette.type === 'light' ? palette.secondary.main : palette.text.primary,
      backgroundColor: palette.type === 'light' ? lighten(palette.secondary.light, 0.85) : palette.secondary.dark,
    },
    '& .spacer': {
      flex: '1 auto',
    },
    '& .actions': {
      color: palette.text.secondary,
    },
    '& .title': {
      flex: '0 0 auto',
    },
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  head: {},
  headRow: {},
  row: {
    '&:not(:hover) .col-actions button': {
      visibility: 'hidden',
    },
    '&:selected .col-actions button': {
      visibility: 'visible',
    },
  },
  column: {
    '&.col-select': {},
    '&.col-actions': {},
  },
});
