import React from "react";
import { Switch, Route } from "react-router-dom";
import CategoryListBase from "./CategoryListBase.js";
import CategoryItemBase from "./CategoryItemBase.js";

const CategoryList = CategoryListBase;
const CategoryItem = CategoryItemBase;

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

export default AdminCategoriesPage;
