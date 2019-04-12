import React from "react";
import { Switch, Route } from "react-router-dom";

import { withFirebase } from "../../../components/Firebase";

import ProductListBase from "./ProductListBase.js";
import AddProductBase from "./AddProductBase.js";

const ProductList = withFirebase(ProductListBase);
const AddProduct = withFirebase(AddProductBase);

const ProductsPage = props => {
  // Take the fullPath varuable from the dashboard main file and
  // pass it down to the list component so that it can be used for the links
  return (
    <Switch>
      <Route exact path={`${props.fullPath}/add`} component={AddProduct} />
      <Route
        exact
        path={props.fullPath}
        render={() => <ProductList fullPath={props.fullPath} />}
      />
    </Switch>
  );
};

export default ProductsPage;
