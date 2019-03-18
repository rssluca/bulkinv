import React from "react";
import { withFirebase } from "../Firebase";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import ExitIcon from "@material-ui/icons/ExitToApp";

const SignOutButton = ({ firebase }) => (
  <Tooltip title="Sign Out">
    <IconButton
      color="inherit"
      aria-label="Sign Out"
      onClick={firebase.doSignOut}
    >
      <ExitIcon />
    </IconButton>
  </Tooltip>
);

export default withFirebase(SignOutButton);
