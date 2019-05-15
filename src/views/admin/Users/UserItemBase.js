import React, { useState, useEffect } from "react";
import { useSessionValue } from "../../../components/Session";
import useReactRouter from "use-react-router";
const UserItemBase = () => {
  const [{ firebase }] = useSessionValue();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(null);
  const { match } = useReactRouter();
  useEffect(
    () => {
      setLoading(true);

      const unsubscribe = firebase.user(match.params.id).onSnapshot(snapshot => {
        setUser(snapshot.data());
      });
      setLoading(false);

      return () => unsubscribe;
    },
    [user, firebase, match.params.id]
  );

  const onSendPasswordResetEmail = () => {
    firebase.doPasswordReset(user.email);
    setResetSuccess("Email sent!");
  };

  return (
    <div>
      <h2>User ({match.params.id})</h2>
      {loading && <div>Loading ...</div>}

      {user && (
        <div>
          <span>
            <strong>ID:</strong> {user.uid}
          </span>
          <span>
            <strong>E-Mail:</strong> {user.email}
          </span>
          <span>
            <strong>First Name:</strong> {user.name.first}
          </span>
          <span>
            <strong>Last Name:</strong> {user.name.last}
          </span>
          <span>
            <button type="button" onClick={onSendPasswordResetEmail}>
              Send Password Reset
            </button>
          </span>
          {resetSuccess && <div>{resetSuccess}</div>}
        </div>
      )}
    </div>
  );
};

export default UserItemBase;
