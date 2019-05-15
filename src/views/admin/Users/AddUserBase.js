import React, { useState } from "react";
import { useSessionValue } from "../../../components/Session";
import useReactRouter from "use-react-router";
const AddUserBase = () => {
  const [{ firebase }] = useSessionValue();
  const { history } = useReactRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [storeId, setStoreId] = useState("");
  const [email, setEmail] = useState("");
  const [passwordOne, setPasswordOne] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const [error, setError] = useState(null);

  const onSubmit = event => {
    firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase database
        return firebase.user(authUser.user.uid).set(
          {
            email: email,
            name: {
              first: firstName,
              last: lastName
            },
            roles: {
              [storeId]: "admin"
            }
          },
          { merge: true }
        );
      })
      .then(authUser => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setStoreId("");
        setPasswordOne("");
        setPasswordTwo("");

        history.push(this.props.fullPath);
      })
      .catch(error => {
        setError(error);
      });

    event.preventDefault();
  };

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === "" ||
    email === "" ||
    lastName === "" ||
    storeId === "" ||
    firstName === "";

  return (
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

      {error && <p>{error.message}</p>}
    </form>
  );
};

export default AddUserBase;
