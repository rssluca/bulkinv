const styles = theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  },
  toolbar: theme.mixins.toolbar,
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

export default styles;
