import { ClassNames } from "@emotion/react";
import { useState, useContext } from "react";
import { Fragment } from "react";
import classes from "./Register.module.scss";

function Register({ props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    setEmail("");
    setPassword("");
    setName("");
    console.log(email, password);
  };

  const handleSignup = (event) => {
    event.preventDefault();
    setEmail("");
    setPassword("");
    setName("");
    console.log(email, password, name);
  };

  return (
    <Fragment>
      {props.login && (
        <form className={classes.form} name="login" onSubmit={handleLogin}>
          <p className={classes.title}>ورود به دلماره</p>
          <div className={classes.input}>
            <p className={classes.label}>Email</p>
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
            <p className={classes.label}>Password</p>
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

      {props.signup && (
        <form className={classes.form} name="signup" onSubmit={handleSignup}>
          <p className={classes.title}>ثبت نام در دلماره</p>
          <div className={classes.input}>
            <p className={classes.label}>Name</p>
            <input
              placeholder="دلارام ایرانی"
              type="text"
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              autoComplete="off"
              required
            />
          </div>
          <div className={classes.input}>
            <p className={classes.label}>Email</p>
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
            <p className={classes.label}>Password</p>
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
            <p>{errorMessage}</p>
            <button className="mainButton" type="submit" disabled={false}>
              Sign up
            </button>
            <p
              className={classes.subTitle}
              onClick={() => {
                props.setSignup(false);
                props.setLogin(true);
              }}
            >
              Log in
            </p>
          </div>
        </form>
      )}
    </Fragment>
  );
}

export default Register;
