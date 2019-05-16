/* eslint-disable */
import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
import { compose } from "recompose";
import routes from "../routes/appRoutes.js";
import NotFound from "../components/NotFound";

// Dashboard should only be accessible to logged in users
import useAuthorization from "../hooks/useAuthorization.js";
import { useSessionValue } from "../components/Session";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import CircularProgress from "@material-ui/core/CircularProgress";
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
  let propParent = null;
  routes.map((prop, key) => {
    if (
      currentFullPath.includes(prop.parent) &&
      currentFullPath.includes(prop.path)
    ) {
      propName = prop.name;
      propParent = prop.parent;
    }
  });

  return (propParent === "/admin" ? "Admin - " : "") + propName;
};

const switchRoutes = currentRolePath => {
  // Store the first path in the map loop below, we will use it to redirect to main path
  let firstPath = "";
  console.log(currentRolePath + firstPath);
  return (
    <Switch>
      {routes.map((prop, key) => {
        if (prop.parent === currentRolePath) {
          if (firstPath !== "") {
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
        <Redirect from="/" to="/admin/dashboard" />
      )}
      <Redirect from={currentRolePath} to={currentRolePath + firstPath} />
      <Redirect to="/404" />
    </Switch>
  );
};

const getCurrentRolePath = roles => {
  return roles.hasOwnProperty("bulkinv") && roles.bulkinv.includes("admin")
    ? "/admin"
    : "/";
};

const Dashboard = props => {
  // Make sure user is authorized
  const condition = authUser => !!authUser;
  useAuthorization(condition);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [{ firebase, app }, dispatch] = useSessionValue();
  const { classes } = props;

  const currentRolePath = app.authUser
    ? getCurrentRolePath(app.authUser.roles)
    : "/";

  // Set Document title
  useDocumentTitle(getPageTitle(props.location.pathname));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Load store settings
  useEffect(
    () => {
      // Super admin does not have a current_store, we do not need this state
      if (
        app.authUser !== null &&
        !app.authUser.roles.hasOwnProperty("bulkinv")
      ) {
        const unsubscribe = firebase.db
          .collection("stores")
          .doc(app.authUser.current_store.uid)
          .collection("categories")
          .doc(app.authUser.current_store.category[0])
          .collection("settings")
          .doc(app.authUser.current_store.category[1])
          .onSnapshot(
            snapshot => {
              // console.log(snapshot.data());
              localStorage.setItem(
                "storeSettings",
                JSON.stringify(snapshot.data())
              );
              dispatch({
                type: "setStoreSettings",
                storeSettings: snapshot.data()
              });
            },
            err => {
              console.log(`Encountered error fetching store settings: ${err}`);
            }
          );

        return () => unsubscribe();
      }
    },
    [app.authUser, dispatch, firebase.db]
  );

  // // Load category settings
  useEffect(
    () => {
      // Super admin does not have a current_store, we do not need this state
      if (
        app.authUser !== null &&
        !app.authUser.roles.hasOwnProperty("bulkinv")
      ) {
        const unsubscribe = firebase.db
          .collection("categories")
          .doc(app.authUser.current_store.category[0])
          .onSnapshot(
            snapshot => {
              // console.log(snapshot.data());
              localStorage.setItem(
                "categorySettings",
                JSON.stringify(snapshot.data())
              );
              dispatch({
                type: "setCategorySettings",
                categorySettings: snapshot.data()
              });
            },
            err => {
              console.log(`Encountered error fetching category: ${err}`);
            }
          );

        return () => unsubscribe();
      }
    },
    [app.authUser, dispatch, firebase.db]
  );

  // Make sure authUser and, if app user  settings/category, are loaded
  const loading = () => {
    if (app.authUser) {
      if (
        app.authUser.roles.hasOwnProperty("bulkinv") &&
        app.authUser.roles.bulkinv.includes("admin")
      ) {
        return true;
      } else {
        if (app.storeSettings && app.categorySettings) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      {loading() ? (
        <div className={classes.root}>
          <CssBaseline />
          <Header
            pageTitle={getPageTitle(props.location.pathname)}
            drawerToggle={handleDrawerToggle}
          />
          <Navbar
            routes={routes}
            currentRolePath={currentRolePath}
            currentFullPath={props.location.pathname}
            drawerToggle={handleDrawerToggle}
            mobileOpen={mobileOpen}
          />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {switchRoutes(currentRolePath)}
          </main>
        </div>
      ) : (
        <div className={classes.progress}>
          <CircularProgress />
        </div>
      )}
    </MuiThemeProvider>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(withStyles(dashboardStyle))(Dashboard);
