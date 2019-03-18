import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import * as ROLES from "../../constants/roles";
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

import routes from "../../constants/dashboardRoutes.js";

const Navbar = props => {
  const { classes, pathname, drawerToggle, mobileOpen, authUser } = props;

  const drawer = (
    <div>
      <ListItem className={classNames(classes.item, classes.itemCategory)}>
        <Typography classes={{ root: classes.logo }} variant="h4">
          BulkInv.
        </Typography>
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
          if (prop.layout === "/app") {
            const active = pathname === prop.layout + prop.path ? true : false;
            const Icon = prop.icon;

            // Add Admin link only if user is admin
            if (
              !authUser.roles.includes(ROLES.ADMIN) &&
              prop.name === "Admin"
            ) {
              return null;
            }

            return (
              <ListItem
                key={key}
                className={classNames(
                  classes.item,
                  classes.itemActionable,
                  active && classes.itemActiveItem
                )}
                component={RouterLink}
                to={prop.layout + prop.path}
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
