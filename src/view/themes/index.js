import { blue, cyan, red } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';
import defaultTheme from '@material-ui/core/styles/defaultTheme';

const spacing = 4;

export default createTheme({
  spacing,
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiChip: {
      root: {
        height: 22,
        fontSize: '0.7rem',
        margin: [[2, 2, 2, 0]],
      },
      avatar: {
        height: 22,
        width: 22,
        fontSize: '0.9rem',
      },
      outlined: {
        '& $avatar': {
          height: 22,
          width: 22,
          fontSize: '0.9rem',
          marginLeft: 0,
        },
        '& $deleteIcon': {
          margin: [[0, 0, 0, -1]],
          marginRight: -1,
          height: 22,
          width: 22,
        },
      },
      deleteIcon: {
        fontSize: '1rem',
      },
    },
    MuiBadge: {
      colorPrimary: {
        color: cyan[100],
        transform: 'scale(0.8)',
        fontWeight: 700,
        backgroundColor: cyan[600],
      },
      colorSecondary: {
        color: red.light,
        backgroundColor: red[200],
      },
    },
    MuiFormControl: {
      root: {
        margin: [[4, 0]],
      },
    },
    MuiFormHelperText: {
      root: {
        marginTop: 4,
      },
    },
    MuiGridListTileBar: {
      root: {
        whiteSpace: 'nowrap',
      },
    },
    MuiInput: {
      formControl: {
        'label + &': {
          marginTop: 10,
        },
      },
    },
    // MuiIconButton: {
    //   root: {
    //     padding: 6,
    //     margin: 2,
    //   },
    // },
    /*    MuiSwitch: {
      root: {
        width: 65,
      },
    },
*/ MuiTablePagination: {
      select: { paddingRight: 32 },
    },
    MuiTypography: {
      h6: {
        fontSize: '1rem',
        lineHeight: 1.25,
      },
    } /*
    MuiInputBase: {
      root: {
        fontSize: '0.8rem',
      },
    }, */,
    MuiListItem: {
      divider: {
        marginBottom: 11,
        paddingBottom: 0,
      },
    },
    MuiFormLabel: {
      root: {
        fontSize: '0.95rem',
      },
    },
    MuiInputLabel: {
      shrink: {
        transform: 'translate(0, -4px) scale(0.95)',
      },
    },
    MuiDialogTitle: {
      root: {
        borderBottom: `1px solid ${defaultTheme.palette.divider}`,
        margin: 0,
        fontSize: '1.15rem',
        padding: [[defaultTheme.spacing(2), defaultTheme.spacing(2)]],
      },
    },
    MuiDialogContent: {
      root: {
        margin: 0,
        padding: [[defaultTheme.spacing(2), defaultTheme.spacing(2)]],
      },
    },
    MuiDialogActions: {
      root: {
        borderTop: `1px solid ${defaultTheme.palette.divider}`,
        margin: 0,
        padding: [[defaultTheme.spacing(1), defaultTheme.spacing(2)]],
      },
    },
    MuiTableCell: {
      paddingNone: {
        padding: [[2, 0, 2, 4]],
        // '&:last-child': {
        //   paddingRight: 16,
        // },
        // '&$paddingCheckbox': {
        //   width: 24, // prevent the checkbox column from growing
        //   padding: '0px 12px 0 16px',
        //   '&:last-child': {
        //     paddingLeft: 12,
        //     paddingRight: 16,
        //   },
        //   '& > *': {
        //     padding: 0,
        //   },
        // },
      },
    },
    MuiSnackbarContent: {
      message: { flex: 1 },
      action: { paddingLeft: 16 },
    },
  },
  palette: {
    primary: blue,
    secondary: {
      light: cyan[100],
      main: cyan[800],
      dark: cyan[600],
      contrastText: '#fff',
    },
    error: {
      main: red[500],
    },
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },

  status: {
    danger: 'orange',
  },

  header: {
    flex: '0 0 44px',
    height: 44,
    // background: 'rgba(255, 255, 255, 0.5)',
    color: '#fff',
    background: blue[500],
  },

  logo: {
    small: {
      width: 122,
      height: 40,
    },
    medium: {
      width: 244,
      height: 80,
    },
  },

  title: {
    textAlign: 'center',
  },

  subTitle: {
    textAlign: 'center',
    fontWeight: 'normal',
    fontSize: '65%',
  },
});
