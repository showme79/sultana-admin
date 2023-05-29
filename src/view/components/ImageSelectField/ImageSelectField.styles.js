import { blue, red } from '@material-ui/core/colors';

export default (theme) => ({
  root: {},
  formControl: {},
  inputLabel: {},
  image: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'baseline',
    ...theme.overrides.MuiInput.formControl['label + &'],
    border: `dashed 1px ${theme.palette.divider}`,
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 'auto',
    textAlign: 'center',
    width: '100%',
    height: 300,
  },
  imageWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  cropper: {
    '& img': {
      maxWidth: '100%',
      maxHeight: 300,
    },
  },
  cropButtons: {
    '& button': {
      width: '100%',
    },
    '& .remove-image': {
      color: red[500],
      border: `solid 1px ${red[500]}`,
    },
  },
  wideCropButton: {
    '&:hover': {
      color: theme.palette.getContrastText(red[500]),
      backgroundColor: red[700],
    },
  },
  narrowCropButton: {
    '&:hover': {
      color: theme.palette.getContrastText(blue[500]),
      backgroundColor: blue[700],
    },
  },
});
