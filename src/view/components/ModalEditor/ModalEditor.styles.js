export default (theme) => ({
  root: {
    position: 'absolute',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  dialogTitle: {
    display: 'flex',
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
    flex: '0 auto',
    alignItems: 'center',
  },
  titleText: {
    flex: '1 auto',
  },
  closeButton: {
    flex: '0 auto',
  },
  dialogContent: {
    margin: 0,
    padding: theme.spacing(2),
    flex: '1 auto',
  },
  paper: {},

  actionButton: {},
  actionButtonText: {},
  actionIconButton: {},
  actionTooltip: {},

  titleActionButton: {},
  titleActionButtonText: {},
  titleActionIconButton: {},
  titleActionTooltip: {},

  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
    flex: '0 auto',
  },
});
