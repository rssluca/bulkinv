import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import commonStyle from "../../assets/jss/commonStyle.js";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import WarningIcon from "@material-ui/icons/Warning";
import ErrorIcon from "@material-ui/icons/Error";

// Had to set open separately otherwise artifact is seen
// const [alertDialogOpen, setAlertDialogOpen] = useState(false);
// When setting the state in theparent component do not enter anything as value
//  const [alertDialogProps, setAlertDialogProps] = useState();

const AlertDialog = props => {
  const {
    alertDialogOpen,
    setAlertDialogOpen,
    alertDialogProps,
    classes
  } = props;

  const handleClose = () => {
    setAlertDialogOpen(false);
  };

  return (
    <Dialog
      open={alertDialogOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {alertDialogProps.icon === "warning" && (
          <WarningIcon
            size="small"
            color="secondary"
            className={classes.iconText}
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
        <DialogContentText id="alert-dialog-description">
          {alertDialogProps.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {alertDialogProps.type === "continue" ? "Cancel" : "Ok"}
        </Button>
        {alertDialogProps.type === "continue" && (
          <Button onClick={alertDialogProps.action} color="primary" autoFocus>
            Ok
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

AlertDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  action: PropTypes.object,
  type: PropTypes.oneOf(["confirm", "continue"])
};

AlertDialog.defaultProps = {
  alertDialogProps: {
    action: null,
    icon: null,
    type: null,
    title: "",
    message: ""
  }
};

export default withStyles(commonStyle)(AlertDialog);
