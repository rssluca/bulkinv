import React from "react";
import PasswordChangeForm from "../PasswordChange";
import { useSessionValue } from "../../../components/Session";
const AccountPage = () => {
  const [{ app }] = useSessionValue();
  return (
    <div>
      <h1>Account: {app.authUser.email}</h1>
      <h3>
        {app.authUser.name.first} {app.authUser.name.last}
      </h3>
      <PasswordChangeForm />
    </div>
  );
};

export default AccountPage;
