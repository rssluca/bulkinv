import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import navbarStyle from "../../assets/jss/components/navbarStyle.js";
import classNames from "classnames";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import logo from "../../assets/img/logo_white.png";

const Navbar = props => {
  const {
    classes,
    currentRolePath,
    currentFullPath,
    routes,
    drawerToggle,
    mobileOpen
  } = props;

  const drawer = (
    <div>
      <ListItem className={classNames(classes.item, classes.logo)}>
        <img src={logo} alt="Bulk Inv." />
      </ListItem>
      <List component="nav">
        <ListItem className={classes.categoryHeader}>
          <ListItemText
            classes={{
              primary: classes.categoryHeaderPrimary
            }}
          >
            Menu
          </ListItemText>
        </ListItem>
        {routes.map((prop, key) => {
          if (prop.parent === currentRolePath) {
            const active =
              currentFullPath === prop.parent + prop.path ? true : false;
            const Icon = prop.icon;

            return (
              <ListItem
                key={key}
                className={classNames(
                  classes.item,
                  classes.itemActionable,
                  active && classes.itemActiveItem
                )}
                component={RouterLink}
                to={prop.parent + prop.path}
                button
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary,
                    textDense: classes.textDense
                  }}
                >
                  {prop.name}
                </ListItemText>
              </ListItem>
            );
          } else {
            // Return something (null) if nothing else
            return null;
          }
        })}
      </List>
    </div>
  );

  return (
    <nav className={classes.drawer}>
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation="css">
        <Drawer
          container={props.container}
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={drawerToggle}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
};

Navbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(navbarStyle)(Navbar);
