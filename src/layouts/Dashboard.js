/* eslint-disable */
import React, { Component, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
import { compose } from "recompose";
import routes from "../constants/appRoutes.js";

// Dashboard should only be accessible to logged in users
import { withAuthorization } from "../components/Auth";

// Context and reducers
import { SessionProvider, useSessionValue } from "../components/Session";
import appReducer from "../components/reducers/appReducer.js";
// import userReducer from "../components/reducers/userReducer.js";

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import dashboardStyle from "../assets/jss/layouts/dashboardStyle.js";
import theme from "../assets/jss/themes/dashboardTheme.js";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

// We need to return page title by using map and matching parent/path
// NOT SURE THIS IS THE BEST THING TO DO
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
      {currentRolePath === "/admin" && (
        <Redirect from="/app" to="/admin/dashboard" />
      )}
      <Redirect from={currentRolePath} to={currentRolePath + firstPath} />
    </Switch>
  );
};

const Dashboard = props => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const initialState = {
    appSession: { headerTitle: "" }
  };

  const mainReducer = ({ appSession }, action) => ({
    appSession: appReducer(appSession, action)
    // userSession: userReducer(userSession, action)
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const { classes, authUser } = props;

  const currentRolePath =
    authUser.roles.hasOwnProperty("bulkinv") &&
    authUser.roles.bulkinv.includes("ADMIN")
      ? "/admin"
      : "/app";

  const currentFullPath = currentFullPath;

  return (
    <SessionProvider initialState={initialState} reducer={mainReducer}>
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
          <Header
            pageTitle={getPageTitle(props.location.pathname)}
            drawerToggle={handleDrawerToggle}
          />
          <Navbar
            routes={routes}
            currentRolePath={currentRolePath}
            currentFullPath={currentFullPath}
            drawerToggle={handleDrawerToggle}
            mobileOpen={mobileOpen}
          />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {switchRoutes(currentRolePath)}
          </main>
        </div>
      </MuiThemeProvider>
    </SessionProvider>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

const condition = authUser => !!authUser;

export default compose(
  withStyles(dashboardStyle),
  withAuthorization(condition)
)(Dashboard);
