/* eslint-disable */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import { compose } from "recompose";

import CssBaseline from "@material-ui/core/CssBaseline";
import withStyles from "@material-ui/core/styles/withStyles";

import authStyles from "../assets/jss/layouts/authStyle.js";
import SignIn from "../views/SignIn";
import PasswordForget from "../views/PasswordForget";

import * as ROUTES from "../constants/routes";

const Auth = props => {
  const { classes } = props;

  return (
    <main className={classes.main}>
      <CssBaseline />
      <Switch>
        <Route
          path={ROUTES.SIGN_IN}
          component={() => <SignIn classes={classes} />}
        />
        <Route
          path={ROUTES.PASSWORD_FORGET}
          component={() => <PasswordForget classes={classes} />}
        />
      </Switch>
    </main>
  );
};

SignIn.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(authStyles)(Auth);
