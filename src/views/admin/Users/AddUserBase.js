import React, { useState } from "react";
import { useSessionValue } from "../../../components/Session";
import useReactRouter from "use-react-router";
import Snackbar from "../../../components/Snackbar";

const AddUserBase = props => {
  const [{ firebase }] = useSessionValue();
  const { history } = useReactRouter();
  const [snackbarProps, setSnackbarProps] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [storeId, setStoreId] = useState("");
  const [email, setEmail] = useState("");
  const [passwordOne, setPasswordOne] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");

  /*  TODO
   *  Redirect on initial page on complete
   *  Check if store id exists
   *  Add multiple store ID addition
   */

  const onSubmit = event => {
    event.preventDefault();

    // Set user claim
    const setclaim = firebase.functions.httpsCallable("api/create_user");
    setclaim({
      first_name: firstName,
      last_name: lastName,
      email: email,
      store_id: storeId,
      password: passwordOne
    })
      .then(data => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setStoreId("");
        setPasswordOne("");
        setPasswordTwo("");

        history.push(props.fullPath);
      })
      .catch(err => {
        setSnackbarProps({
          open: true,
          variant: "error",
          message: "Error: " + err
        });
      });
  };

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === "" ||
    email === "" ||
    lastName === "" ||
    storeId === "" ||
    firstName === "";

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="first_name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          type="text"
          placeholder="First Name"
        />
        <input
          name="last_name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          type="text"
          placeholder="Last Name"
        />
        <input
          name="store_id"
          value={storeId}
          onChange={e => setStoreId(e.target.value)}
          type="text"
          placeholder="Store Id"
        />
        <input
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={e => setPasswordOne(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={e => setPasswordTwo(e.target.value)}
          type="password"
          placeholder="Confirm Password"
        />
        <button disabled={isInvalid} type="submit">
          Sign Up
        </button>
      </form>
      <Snackbar
        snackbarProps={snackbarProps}
        setSnackbarProps={setSnackbarProps}
      />
    </div>
  );
};

export default AddUserBase;
