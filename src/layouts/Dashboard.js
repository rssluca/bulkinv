/* eslint-disable */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
import { compose } from "recompose";
import * as ROLES from "../constants/roles.js";
import routes from "../constants/appRoutes.js";

// Dashboard should only be accessible to logged in users
import { withAuthorization } from "../components/Session";
import { AuthUserContext } from "../components/Session";

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import dashboardStyle from "../assets/jss/layouts/dashboardStyle.js";
import theme from "../assets/jss/themes/dashboardTheme.js";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

const getPageTitle = currentFullPath => {
  let propName = null;
  routes.map((prop, key) => {
    if (
      currentFullPath.includes(prop.parent) &&
      currentFullPath.includes(prop.path)
    ) {
      propName = prop.name;
    }
  });
  return propName;
};

const switchRoutes = currentRolePath => {
  // Store the first path in the map loop below, we will use it to redirect to main path
  let firstPath = null;
  return (
    <Switch>
      {routes.map((prop, key) => {
        if (prop.parent === currentRolePath) {
          if (!firstPath) {
            firstPath = prop.path;
          }
          // We do this way to pass the path
          const Component = prop.component;

          return (
            <Route
              path={prop.parent + prop.path}
              render={() => <Component fullPath={prop.parent + prop.path} />}
              key={key}
            />
          );
        }
      })}
      <Redirect from={currentRolePath} to={currentRolePath + firstPath} />
    </Switch>
  );
};

class Dashboard extends Component {
  static contextType = AuthUserContext;

  state = {
    mobileOpen: false
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { classes } = this.props;
    const currentRolePath = this.context.roles.includes(ROLES.ADMIN)
      ? "/admin"
      : "/app";
    const currentFullPath = this.props.location.pathname;

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
          <Header
            pageTitle={getPageTitle(currentFullPath)}
            drawerToggle={this.handleDrawerToggle}
          />
          <Navbar
            routes={routes}
            currentRolePath={currentRolePath}
            currentFullPath={currentFullPath}
            drawerToggle={this.handleDrawerToggle}
            mobileOpen={this.state.mobileOpen}
          />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {switchRoutes(currentRolePath)}
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

const condition = authUser => !!authUser;

export default compose(
  withStyles(dashboardStyle),
  withAuthorization(condition)
)(Dashboard);
