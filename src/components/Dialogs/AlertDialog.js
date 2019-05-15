import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import commonStyle from "../../assets/jss/commonStyle.js";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import WarningIcon from "@material-ui/icons/Warning";
import ErrorIcon from "@material-ui/icons/Error";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import CheckIcon from "@material-ui/icons/Check";
import Collapse from "@material-ui/core/Collapse";

// Had to set open separately otherwise artifact is seen
// const [alertDialogOpen, setAlertDialogOpen] = useState(false);
// When setting the state in theparent component do not enter anything as value
//  const [alertDialogProps, setAlertDialogProps] = useState();

const styles = theme => ({
  progress: {}
});

const AlertDialog = props => {
  const {
    alertDialogOpen,
    setAlertDialogOpen,
    alertDialogProps,
    classes
  } = props;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Not using success for now since green check might mislead if an error occurs and error snippet is shown.
  // Will need to check later
  const [success] = useState(false);

  // Handle third party open
  useEffect(
    () => {
      if (alertDialogOpen === true) {
        setOpen(true);
      }
    },
    [alertDialogOpen]
  );

  // Handle external closing (in particular if loading is set to true show a check icon for a second )
  useEffect(
    () => {
      // Not using success for now since green check might mislead if an error occurs and error snippet is shown.
      // Will need to check later
      // if (alertDialogOpen === false && loading === true) {
      //   setLoading(false);
      //   // setSuccess(true);
      //
      //   setTimeout(() => {
      //     // setSuccess(false);
      //     setOpen(false);
      //   }, 1000);
      // } else if (alertDialogOpen === false && loading === false) {
      //   setOpen(false);
      // }
      if (alertDialogOpen === false) {
        setOpen(false);
      }
    },
    [alertDialogOpen]
  );

  const handleClose = () => {
    setAlertDialogOpen(false);
    setOpen(false);
    setLoading(false);
  };

  const handleButtonClick = () => {
    if (alertDialogProps.showLoading === true) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    // Execute passed action if any
    if (alertDialogProps.action !== null) {
      alertDialogProps.action();
    }
  };

  /*  We use grid to make sure the circular progress is centered if in use.
   *  Otherwise we will hide all grids and set the left one to only and 12 in size
   *
   *  We also remove DialogContentText if we are passing a React element (Typography)
   *
   */
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableBackdropClick={alertDialogProps.type === "progress" ? true : false}
      disableEscapeKeyDown={alertDialogProps.type === "progress" ? true : false}
      fullWidth={true}
      maxWidth={"sm"}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {alertDialogProps.icon === "success" && (
          <CheckIcon
            size="small"
            color="inherit"
            className={classNames(classes.checkIcon, classes.iconText)}
          />
        )}
        {alertDialogProps.icon === "warning" && (
          <WarningIcon
            size="small"
            color="inherit"
            className={classNames(classes.warningIcon, classes.iconText)}
          />
        )}
        {alertDialogProps.icon === "error" && (
          <ErrorIcon
            size="small"
            color="secondary"
            className={classes.iconText}
          />
        )}

        {alertDialogProps.title}
      </DialogTitle>
      <DialogContent>
        {!React.isValidElement(alertDialogProps.message) ? (
          <DialogContentText id="alert-dialog-description">
            {alertDialogProps.message}
          </DialogContentText>
        ) : (
          alertDialogProps.message
        )}
      </DialogContent>
      <DialogActions>
        {alertDialogProps.type !== "progress" && (
          <Grid
            container
            spacing={0}
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={5} />
            <Grid item xs={2} className={classes.textCenter}>
              {loading && (
                <CircularProgress
                  className={classes.progress}
                  size={24}
                  thickness={4}
                />
              )}
              <Collapse in={success}>
                <CheckIcon className={classes.checkIcon} />
              </Collapse>
            </Grid>

            <Grid
              item
              xs={alertDialogProps.showLoading === true ? 12 : 5}
              className={classes.textRight}
            >
              <Button
                onClick={handleClose}
                color={
                  alertDialogProps.type === "continue" ? "secondary" : "primary"
                }
                disabled={loading}
              >
                {alertDialogProps.type === "continue"
                  ? alertDialogProps.no
                    ? alertDialogProps.no
                    : "Cancel"
                  : "Ok"}
              </Button>
              {alertDialogProps.type === "continue" && (
                <Button
                  onClick={handleButtonClick}
                  disabled={loading}
                  color="primary"
                  autoFocus
                >
                  {alertDialogProps.yes ? alertDialogProps.yes : "Ok"}
                </Button>
              )}
            </Grid>
          </Grid>
        )}
      </DialogActions>
    </Dialog>
  );
};

AlertDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  action: PropTypes.object,
  type: PropTypes.oneOf(["confirm", "continue", "progress"])
};

AlertDialog.defaultProps = {
  alertDialogProps: {
    showLoading: false,
    action: null,
    icon: null,
    type: null,
    yes: null,
    no: null,
    title: "",
    message: ""
  }
};

export default withStyles(commonStyle, styles)(AlertDialog);
