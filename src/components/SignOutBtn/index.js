import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import ExitIcon from "@material-ui/icons/ExitToApp";
import { useSessionValue } from "../Session";

const SignOutButton = () => {
  const [{ firebase }] = useSessionValue();

  const onSignOut = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("storeSettings");
    localStorage.removeItem("categorySettings");
    firebase.doSignOut();
  };

  return (
    <Tooltip title="Sign Out">
      <IconButton color="inherit" aria-label="Sign Out" onClick={onSignOut}>
        <ExitIcon />
      </IconButton>
    </Tooltip>
  );
};
export default SignOutButton;
