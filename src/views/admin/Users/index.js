import React from "react";
import { Switch, Route } from "react-router-dom";

import UserListBase from "./UserListBase.js";
import UserItemBase from "./UserItemBase.js";
import AddUserBase from "./AddUserBase.js";

const UserList = UserListBase;
const UserItem = UserItemBase;
const AddUser = AddUserBase;

const AdminUsersPage = props => {
  // Take the fullPath varuable from the dashboard main file and
  // pass it down to the list component so that it can be used for the links
  return (
    <Switch>
      <Route exact path={`${props.fullPath}/new`} render={() => <AddUser />} />
      <Route exact path={`${props.fullPath}/:id`} render={() => <UserItem />} />
      <Route
        exact
        path={props.fullPath}
        render={() => <UserList fullPath={props.fullPath} />}
      />
    </Switch>
  );
};

export default AdminUsersPage;
