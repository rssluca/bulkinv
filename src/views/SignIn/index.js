import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import * as ROUTES from "../../constants/routes";
import useReactRouter from "use-react-router";
import { useSessionValue } from "../../components/Session";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import logo from "../../assets/img/logo_main_black_text.png";

import useDocumentTitle from "../../hooks/useDocumentTitle.js";

const SignInPage = props => {
  const [{ firebase, app }] = useSessionValue();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { classes } = props;
  const { history } = useReactRouter();

  useDocumentTitle("SignIn");

  // Redirect to app if already logged in
  useEffect(() => {
    app.authUser && history.push(ROUTES.APP);
  }, [app.authUser, history]);

  const onSubmit = event => {
    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setEmail("");
        setPassword("");
        setError(null);
        history.push(ROUTES.APP);
      })
      .catch(error => {
        setError(error);
      });

    event.preventDefault();
  };

  return (
    <Paper className={classes.paper}>
      <img src={logo} alt="Bulk Inv." className={classes.marginBottom2} />
      <form className={classes.form} onSubmit={onSubmit}>
        <Typography component="h1" variant="h5" align="left">
          <LockOutlinedIcon className={classes.lockIcon} /> Sign in
        </Typography>
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
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            id="password"
            autoComplete="current-password"
          />
        </FormControl>
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign in
        </Button>
        {error && <p>{error.message}</p>}
        <p />
        <Link component={RouterLink} to={ROUTES.PASSWORD_FORGET}>
          Forgot Password?
        </Link>
      </form>
    </Paper>
  );
};

export default SignInPage;
