// https://medium.com/simply/state-management-with-react-hooks-and-context-api-at-10-lines-of-code-baf6be8302c
import React, { createContext, useContext, useReducer } from "react";
export const SessionContext = createContext();
export const SessionProvider = ({ reducer, initialState, children }) => (
  <SessionContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </SessionContext.Provider>
);
export const useSessionValue = () => useContext(SessionContext);
