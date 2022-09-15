import { ClassNames } from "@emotion/react";
import { useState, useContext } from "react";
import { Fragment } from "react";
import classes from "./Register.module.scss";

function Register({ props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    setEmail("");
    setPassword("");
    console.log("login");
  };

  return (
    <Fragment>
      {props.login && (
        <form className={classes.form} name="login" onSubmit={handleLogin}>
          <p className={classes.title}>Log in</p>
          <div className={classes.input}>
            <p className={classes.label}>Your email</p>
            <input
              placeholder="sara@delmare.com"
              type="email"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              autoComplete="off"
              required
            />
          </div>

          <div className={classes.input}>
            <p className={classes.label}>Your password</p>
            <input
              placeholder="Password"
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          <div className={classes.formAction}>
            <p className={classes.subTitle} href="/resetpassword">
              Forgot password?
            </p>
            <p>{errorMessage}</p>
            <button className="mainButton" type="submit" disabled={false}>
              Log in
            </button>
            <p
              className={classes.subTitle}
              onClick={() => {
                props.setSignup(true);
                props.setLogin(false);
              }}
            >
              Sign up
            </p>
          </div>
        </form>
      )}
      {props.signup && <div>Signup</div>}
    </Fragment>
  );
}

export default Register;
