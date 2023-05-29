import { green, grey, red, yellow } from '@material-ui/core/colors';

export default (theme) => ({
  root: {
    width: '100%',
    //    marginTop: theme.spacing(3),
  },
  filter: {
    padding: [[0, theme.spacing(1), 0, theme.spacing(1)]],
    '& .priority-field': {
      display: 'block',
      flex: 1,
      textAlign: 'right',
      paddingLeft: theme.spacing(1),
    },
  },
  row: {
    '&.row-status-new .col-title, &.row-status-new .col-status': {
      color: grey[50],
      '& .title-status': {
        backgroundColor: grey[50],
      },
    },
    '&.row-status-draft .col-title, &.row-status-draft .col-status': {
      color: grey[800],
      '& .title-status': {
        backgroundColor: grey[800],
      },
    },
    '&.row-status-approved .col-title, &.row-status-approved .col-status': {
      color: green[600],
      '& .title-status': {
        backgroundColor: green[600],
      },
    },

    '&.row-status-approve-on .col-title, &.row-status-approve-on .col-status': {
      color: green[300],
      '& .title-status': {
        backgroundColor: green[300],
      },
    },

    '&.row-status-ready .col-title, &.row-status-ready .col-status': {
      color: yellow[200],
      '& .title-status': {
        backgroundColor: yellow[200],
      },
    },

    '&.row-status-not-approved .col-title, &.row-status-not-approved .col-status': {
      color: red[400],
      '& .title-status': {
        backgroundColor: red[400],
      },
    },

    '&.row-status-revoked .col-title, &.row-status-revoked .col-status': {
      color: grey[400],
      '& .title-status': {
        backgroundColor: grey[400],
      },
    },
  },
  column: {
    fontSize: 12,
    '&.col-select': {
      width: '1%',
    },
    '&.col-title': {
      width: '27%',
      fontWeight: 500,
    },
    '&.col-title .title-wrapper': {
      display: 'flex',
      flexDirection: 'row',
      placeItems: 'center',
    },
    '&.col-title .title-wrapper .title-status': {
      flex: 0,
      marginRight: 8,
      padding: 8,
      border: `solid 1px ${grey[600]}`,
      borderRadius: 16,
    },
    '&.col-title .title-wrapper .title-text': {
      flex: 'auto',
    },
    '&.col-created, &.col-updated, &.col-approved': {
      width: '10%',
      '& .user-info': {
        fontWeight: 700,
        marginBottom: theme.spacing(0.5),
      },
      '& .date-info': {
        fontSize: '0.75rem',
      },
    },
    '&.col-categories': {
      width: '15%',
    },
    '&.col-tags': {
      width: '14%',
    },
    '&.col-status': {
      width: '1%',
      '& .text-value': {
        fontWeight: 700,
        marginBottom: theme.spacing(0.5),
      },
      '& .user-info': {
        fontWeight: 500,
        fontSize: '0.75rem',
      },
      '& .date-info': {
        fontSize: '0.75rem',
      },
    },
    '&.col-priority': {
      minWidth: 65,
    },
    '&.col-segments': {
      width: '8%',
      fontWeight: 500,
    },
    '&.col-actions': {
      width: '1%',
      whiteSpace: 'nowrap',
      textAlign: 'right',
    },
  },
});
