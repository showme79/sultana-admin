import { lighten } from '@material-ui/core/styles/colorManipulator';

export default ({ spacing, palette }) => ({
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
  row: {
    '&:not(:hover) .col-actions button': {
      visibility: 'hidden',
    },
    '&:selected .col-actions button': {
      visibility: 'visible',
    },
  },

  rootGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    // backgroundColor: theme.palette.background.paper,
  },
  grid: {
    width: '100%',
    height: 'auto',
    margin: '0 !important',
  },
  gridTile: {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundClip: 'content-box',
  },
  icon: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  iconButton: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});
