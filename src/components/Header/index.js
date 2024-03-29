import React, { useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import headerStyle from "../../assets/jss/components/headerStyle.js";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useSessionValue } from "../../components/Session";
import SignOutButton from "../SignOutBtn";

const Header = props => {
  const { classes, drawerToggle, pageTitle } = props;
  const [{ app }, dispatch] = useSessionValue();

  // We place any initial session state (context API) here under useEffect
  useEffect(
    () => {
      // if pageTitle different
      dispatch({
        type: "setTitle",
        newTitle: pageTitle
      });
    },
    [pageTitle, dispatch]
  );

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton color="inherit" aria-label="Open drawer" onClick={drawerToggle} className={classes.menuButton}>
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" color="inherit" noWrap>
            {app.headerTitle}
          </Typography>
          <div className={classes.grow} />
          <SignOutButton />
        </Toolbar>
      </AppBar>
    </div>
  );
};

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(headerStyle)(Header);
