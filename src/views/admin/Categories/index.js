import React from "react";
import { Switch, Route } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../../../components/Firebase";
import { withAuthorization } from "../../../components/Auth";

import CategoryListBase from "./CategoryListBase.js";
import CategoryItemBase from "./CategoryItemBase.js";

const CategoryList = withFirebase(CategoryListBase);
const CategoryItem = withFirebase(CategoryItemBase);

const AdminCategoriesPage = props => {
  // Take the fullPath varuable from the dashboard main file and
  // pass it down to the list component so that it can be used for the links
  return (
    <Switch>
      <Route exact path={`${props.fullPath}/:id`} component={CategoryItem} />
      <Route
        exact
        path={props.fullPath}
        render={() => <CategoryList fullPath={props.fullPath} />}
      />
    </Switch>
  );
};

const condition = authUser =>
  authUser &&
  authUser.roles.hasOwnProperty("bulkinv") &&
  authUser.roles.bulkinv.includes("ADMIN");

export default compose(withAuthorization(condition))(AdminCategoriesPage);
