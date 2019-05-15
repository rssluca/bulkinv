import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

import { useSessionValue } from "../../components/Session";
import * as ROUTES from "../../constants/routes";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const PasswordForgetPage = () => {
  const [{ firebase }] = useSessionValue();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const { classes } = this.props;
  const onSubmit = event => {
    firebase
      .doPasswordReset(email)
      .then(() => {
        setEmail("");
        setSuccess(null);
        setError(null);
      })
      .catch(error => {
        setError(error);
      });

    event.preventDefault();
  };

  return (
    <Paper className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Retrieve Password
      </Typography>
      <form className={classes.form} onSubmit={onSubmit}>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="email">Email Address</InputLabel>
          <Input
            id="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
};

export default PasswordForgetPage;
