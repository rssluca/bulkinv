import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

import * as ROUTES from "../../constants/routes";

class ListProducts extends Component {
  render() {
    // const { classes } = this.props;
    return (
      <div>
        <h1>List Products</h1>
        <p>The Home Page is accessible by every signed in user.</p>
        <Link component={RouterLink} to={ROUTES.PASSWORD_FORGET}>
          Forgot Password?
        </Link>
      </div>
    );
  }
}

export default ListProducts;
