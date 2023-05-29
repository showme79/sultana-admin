export default (theme) => ({
  root: {
    margin: 2,
    flex: '0 auto',
    maxWidth: '100%',
    maxHeight: 300,
  },
  title: {
    position: 'absolute',
    left: 2,
    right: 2,
    bottom: 2,
    background: 'rgba(0,0,0,0.5)',
    color: theme.palette.grey[50],
    padding: '4px 8px',
    flexWrap: 'nowrap',
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',

    display: 'flex',
    '& .title': {
      flex: 'auto',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    '& .resolution': {
      flex: '0 auto',
      paddingLeft: 4,
    },
  },
});
