export default (theme) => ({
  root: {
    minHeight: 48,
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbar: {
    minHeight: 48,
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    minHeight: 40,
  },
  logo: {
    flex: '0 0 60px',
    margin: [[0, theme.spacing(2)]],
    backgroundSize: 'contain',
    height: 40,
  },
  jobs: {
    flex: 0,
    margin: [[0, theme.spacing(2)]],
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottom: 'solid 1px #dadada',
  },
  username: {
    padding: `0 ${theme.spacing(1)}px`,
  },
  profileUsername: {
    padding: `0 ${theme.spacing(1)}px`,
  },
});
