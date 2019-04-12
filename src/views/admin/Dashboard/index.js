import React, { Component } from "react";
import { compose } from "recompose";
import { withAuthorization } from "../../../components/Auth";

class AdminDashboardPage extends Component {
  render() {
    return (
      <div>
        <h1>Admin Dashboard</h1>
        <p>The Home Page is accessible by admins.</p>
      </div>
    );
  }
}
const condition = authUser =>
  authUser &&
  authUser.roles.hasOwnProperty("bulkinv") &&
  authUser.roles.bulkinv.includes("ADMIN");

export default compose(withAuthorization(condition))(AdminDashboardPage);
