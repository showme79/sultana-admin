export default (/* theme */) => ({
  root: {},
  column: {
    '&.col-select': {
      width: '1%',
    },
    '&.col-media': {
      width: 150,
      height: 80,
      '& > img': {
        width: 'inherit',
        height: 'inherit',
        objectFit: 'contain',
        objectPosition: [['center', 'center']],
      },
    },
    '&.col-title': {
      width: '30%',
      fontWeight: 500,
    },
    '&.col-description': {
      width: '60%',
    },
    '&.col-actions': {
      width: '1%',
      whiteSpace: 'nowrap',
      textAlign: 'right',
    },
  },
});
