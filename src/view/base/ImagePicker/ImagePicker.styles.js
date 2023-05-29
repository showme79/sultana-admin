export default (theme) => ({
  root: {},
  filter: {
    margin: 8,
  },
  content: {
    overflow: 'auto',
  },
  mediaEditor: {
    padding: theme.spacing(2),
  },
  progress: {},
  toolbar: {},
  grid: {
    width: '100%',
    height: 'auto',
    margin: '0 !important',
    userSelect: 'none',
  },
  gridTile: {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundClip: 'content-box',
  },
  gridTileUnselected: {
    border: 'solid 2px white',
  },
  gridTileSelected: {
    border: `solid 2px ${theme.palette.primary[500]}`,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  gridTileBar: {},
  actionSpacer: {
    flex: 'auto',
  },
});
