/* eslint-disable */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
import { compose } from "recompose";

// Dashboard should only be accessible to logged in users
import { withAuthorization } from "../components/Session";
import { AuthUserContext } from "../components/Session";

import routes from "../constants/dashboardRoutes.js";

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import dashboardStyle from "../assets/jss/layouts/dashboardStyle.js";
import theme from "../assets/jss/themes/dashboardTheme.js";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === "/app") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
    })}
    <Redirect from="/app" to="/app/dashboard" />
  </Switch>
);

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

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
          <Header drawerToggle={this.handleDrawerToggle} />
          <Navbar
            pathname={this.props.location.pathname}
            drawerToggle={this.handleDrawerToggle}
            mobileOpen={this.state.mobileOpen}
            authUser={this.context}
          />

          <main className={classes.content}>
            <div className={classes.toolbar} />
            {switchRoutes}
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
