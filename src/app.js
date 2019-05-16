import React, { useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
// import ProtectedRoute from "./components/ProtectedRoute";
import { createBrowserHistory } from "history";

// Context and reducers
import { useSessionValue } from "./components/Session";
// import userReducer from "../components/reducers/userReducer.js";

import * as ROUTES from "./constants/routes";
import NotFound from "./components/NotFound";

// core components
import Dashboard from "./layouts/Dashboard.js";
import Auth from "./layouts/Auth.js";

const hist = createBrowserHistory();

const App = () => {
  const [{ firebase }, dispatch] = useSessionValue();

  // User details won't be refreshed because only auth is being listended to, not the user data binded
  useEffect(
    () => {
      const unsubscribe = firebase.onAuthUserListener(
        authUser => {
          // if (app.authUser !== authUser) {
          localStorage.setItem("authUser", JSON.stringify(authUser));

          dispatch({
            type: "setAuthUser",
            authUser: authUser
          });

          firebase.auth.currentUser
            .getIdTokenResult()
            .then(idTokenResult => {
              console.log(idTokenResult.claims);
            })
            .catch(error => {
              console.log(error);
            });
        },
        // Firebase fallback function
        () => {
          localStorage.removeItem("authUser");
          dispatch({
            type: "setAuthUser",
            authUser: null
          });
        }
      );

      return () => unsubscribe();
    },
    [dispatch, firebase]
  );

  return (
    <Router history={hist}>
      <Switch>
        <Route path={ROUTES.APP} exact component={Dashboard} />
        <Route path={ROUTES.ADMIN} component={Dashboard} />
        <Route path={ROUTES.SIGN_IN} component={Auth} />
        <Route path={ROUTES.PASSWORD_FORGET} component={Auth} />
        <Route path="/404" component={NotFound} />
        <Redirect from="*" to="/404" />
      </Switch>
    </Router>
  );
};

export default App;
