// https://medium.com/simply/state-management-with-react-hooks-and-context-api-at-10-lines-of-code-baf6be8302c
import React, { createContext, useContext, useReducer } from "react";
import Firebase from "../Firebase";
import appReducer from "../reducers/appReducer.js";
import firebaseReducer from "../reducers/firebaseReducer.js";

const initialState = {
  firebase: new Firebase(),
  app: {
    authUser: JSON.parse(localStorage.getItem("authUser")),
    storeSettings: JSON.parse(localStorage.getItem("storeSettings")),
    categorySettings: JSON.parse(localStorage.getItem("categorySettings")),
    headerTitle: ""
  }
};

const mainReducer = ({ firebase, app }, action) => ({
  firebase: firebaseReducer(firebase, action),
  app: appReducer(app, action)
});

export const SessionContext = createContext();
export const SessionProvider = ({ children }) => (
  <SessionContext.Provider value={useReducer(mainReducer, initialState)}>
    {children}
  </SessionContext.Provider>
);

export const useSessionValue = () => useContext(SessionContext);
