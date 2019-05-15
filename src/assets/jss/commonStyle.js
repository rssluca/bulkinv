import green from "@material-ui/core/colors/green";
import orange from "@material-ui/core/colors/orange";

const styles = theme => ({
  dropboxText: {
    display: "inline-flex"
  },
  rightSubmit: {
    marginLeft: 25
  },
  button: {
    margin: theme.spacing.unit
  },
  smallButton: {
    minWidth: 10,
    padding: 4
  },
  marginBottom: {
    marginBottom: theme.spacing.unit
  },
  marginBottom2: {
    marginBottom: theme.spacing.unit * 2
  },
  marginBottom4: {
    marginBottom: theme.spacing.unit * 4
  },
  marginTop: {
    marginTop: theme.spacing.unit
  },
  marginTop3: {
    marginTop: theme.spacing.unit * 3
  },
  marginLeft: {
    marginLeft: theme.spacing.unit
  },
  marginRight: {
    marginRight: theme.spacing.unit
  },
  marginRight4: {
    marginRight: theme.spacing.unit * 4
  },
  iconSmall: {
    fontSize: 20
  },
  iconText: {
    display: "inline-flex",
    verticalAlign: "middle",
    marginRight: 10,
    marginBottom: 5
  },
  textCenter: {
    textAlign: "center"
  },
  textRight: {
    textAlign: "right"
  },
  loadingText: {
    flex: 1,
    marginTop: 100,
    textAlign: "center"
  },
  textField: {
    marginRight: theme.spacing.unit * 2,
    width: 200
  },
  menu: {
    width: 200
  },
  languageTextField: {
    width: 80
  },
  languageMenu: {
    width: 80
  },
  dense: {
    marginTop: 19
  },
  checkIcon: {
    color: green[500]
  },
  warningIcon: {
    color: orange[500]
  },
  iconHoverSecondary: {
    "&:hover": {
      color: theme.palette.secondary.main
    }
  },
  iconHoverDisabled: {
    "&:hover": {
      color: theme.palette.text.disabled
    }
  },
  iconHoverPrimary: {
    "&:hover": {
      color: theme.palette.primary.main
    }
  }
});

export default styles;
