export default (theme) => ({
  root: {},
  formControl: {},
  inputLabel: {},
  fieldsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  switch: {
    order: 0,
    // flex: 0,
  },
  slider: {
    order: 2,
    flex: 'auto',
    //    height: 40,
    //    paddingTop: 20,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  number: {
    order: 1,
    flex: 0,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
});
