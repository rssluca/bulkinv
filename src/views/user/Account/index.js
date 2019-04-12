import React from "react";

import { AuthUserContext, withAuthorization } from "../../../components/Auth";
import PasswordChangeForm from "../PasswordChange";

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account: {authUser.email}</h1>
        <h3>
          {authUser.name.first} {authUser.name.last}
        </h3>
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
