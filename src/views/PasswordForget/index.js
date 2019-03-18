import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

import { compose } from "recompose";

import { withFirebase } from "../../components/Firebase";
import * as ROUTES from "../../constants/routes";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const INITIAL_STATE = {
  email: "",
  success: null,
  error: null
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({
          ...INITIAL_STATE,
          success: "A link as been sent to your email!"
        });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, success, error } = this.state;

    const { classes } = this.props;

    return (
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Retrieve Password
        </Typography>
        <form className={classes.form} onSubmit={this.onSubmit}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input
              id="email"
              name="email"
              value={email}
              onChange={this.onChange}
              autoComplete="email"
              autoFocus
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Reset My Password
          </Button>
          {success && <p>{success}</p>}
          {error && <p>{error.message}</p>}
          <p />
          <Link component={RouterLink} to={ROUTES.SIGN_IN}>
            Back to Sign In Page
          </Link>
        </form>
      </Paper>
    );
  }
}

const PasswordForgetPage = compose(withFirebase)(PasswordForgetFormBase);

export default PasswordForgetPage;
