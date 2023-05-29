export default (theme) => ({
  form: {
    padding: '10px 16px',
  },

  title: theme.title,

  logo: {
    ...theme.logo.medium,
    margin: 'auto',
    backgroundSize: 'contain',
  },

  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  registerButton: {},

  backButton: {},
});
