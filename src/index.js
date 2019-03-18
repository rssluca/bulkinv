import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";

import Firebase, { FirebaseContext } from "./components/Firebase";
import { withAuthentication } from "./components/Session";

import * as ROUTES from "./constants/routes";

// core components
import Dashboard from "./layouts/Dashboard.js";
import Auth from "./layouts/Auth.js";

const hist = createBrowserHistory();

const App = withAuthentication(() => {
  return (
    <Router history={hist}>
      <Switch>
        <Route path={ROUTES.APP} component={Dashboard} />
        <Route path={ROUTES.SIGN_IN} component={Auth} />
        <Route path={ROUTES.PASSWORD_FORGET} component={Auth} />
      </Switch>
    </Router>
  );
});

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
