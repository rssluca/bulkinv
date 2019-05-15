const styles = theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  },
  toolbar: theme.mixins.toolbar,
  progress: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)"
  }
});

export default styles;
