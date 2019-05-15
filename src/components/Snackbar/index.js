import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import WarningIcon from "@material-ui/icons/Warning";
import { withStyles } from "@material-ui/core/styles";

// When setting the state in theparent component do not enter anything as value
// defaultProps is used
//    const [snackbarProps, setSnackbarProps] = useState();

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const styles = theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
});

const CustomizedSnackbar = props => {
  const { snackbarProps, setSnackbarProps, classes, className } = props;
  const Icon = variantIcon[snackbarProps.variant];

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarProps({
      open: false,
      variant: snackbarProps.variant,
      message: snackbarProps.message
    });
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      open={snackbarProps.open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <SnackbarContent
        className={classNames(classes[snackbarProps.variant], className)}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={classNames(classes.icon, classes.iconVariant)} />
            {snackbarProps.message}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={handleClose}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>
        ]}
      />
    </Snackbar>
  );
};

CustomizedSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string
};

CustomizedSnackbar.defaultProps = {
  snackbarProps: {
    open: false,
    variant: "info",
    message: ""
  }
};

export default withStyles(styles)(CustomizedSnackbar);
