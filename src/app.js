import React, { useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";

// Context and reducers
import { useSessionValue } from "./components/Session";
// import userReducer from "../components/reducers/userReducer.js";

import * as ROUTES from "./constants/routes";
import NotFound from "./components/NotFound";

// core components
import LandingPage from "./views/Landing";
import Dashboard from "./layouts/Dashboard.js";
import Auth from "./layouts/Auth.js";

const hist = createBrowserHistory();

const App = () => {
  const [{ firebase, app }, dispatch] = useSessionValue();

  // User details won't be refreshed because only auth is being listended to, not the user data binded
  useEffect(
    () => {
      const unsubscribe = firebase.onAuthUserListener(
        authUser => {
          if (app.authUser !== authUser) {
            localStorage.setItem("authUser", JSON.stringify(authUser));

            dispatch({
              type: "setAuthUser",
              authUser: authUser
            });

            // const setclaim = firebase.functions.httpsCallable("api/set_custom_claims");
            // setclaim()
            //   .then(data => {
            //     console.log("DONE");
            //
            //     firebase.auth.currentUser.getIdToken(true);
            //   })
            //   .catch(err => {
            //     console.log("Errrrrrrr", err);
            //   });
            //
            // firebase.auth.currentUser
            //   .getIdTokenResult()
            //   .then(idTokenResult => {
            //     console.log(idTokenResult.claims);
            //   })
            //   .catch(error => {
            //     console.log(error);
            //   });
          }
        },
        () => {
          // Update only if app.authUser is set
          if (app.authUser !== null) {
            // console.log("Not logged", app.authUser);
            localStorage.removeItem("authUser");
            dispatch({
              type: "setAuthUser",
              authUser: null
            });
          }
        }
      );

      return () => unsubscribe();
    },
    [app.authUser, dispatch, firebase]
  );

  // Load store settings
  useEffect(
    () => {
      // Super admin does not have a current_store, we do not need this state
      if (app.authUser !== null && app.authUser.hasOwnProperty("current_store")) {
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
              localStorage.setItem("storeSettings", JSON.stringify(snapshot.data()));
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
      if (app.authUser !== null && app.authUser.hasOwnProperty("current_store")) {
        const unsubscribe = firebase.db
          .collection("categories")
          .doc(app.authUser.current_store.category[0])
          .onSnapshot(
            snapshot => {
              // console.log(snapshot.data());
              localStorage.setItem("categorySettings", JSON.stringify(snapshot.data()));
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

  return (
    <Router history={hist}>
      <Switch>
        <Route path={ROUTES.LANDING} exact component={LandingPage} />
        <Route path={ROUTES.APP} component={Dashboard} />
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
