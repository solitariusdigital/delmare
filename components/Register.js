import { useState, useContext } from "react";
import { Fragment } from "react";
import classes from "./Register.module.scss";
import Kavenegar from "kavenegar";
import { tokenGenerator } from "../services/utility";

function Register({ props }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [checkToken, setCheckToken] = useState("");
  const [alert, setAlert] = useState("");

  const verifyPhone = () => {
    if (phone.length === 0) {
      setAlert("موبایل را وارد کنید");
      setTimeout(() => {
        setAlert("");
      }, 3000);
      return;
    }

    if (phone.length === 11 && phone.slice(0, 2) === "09") {
      let id = tokenGenerator();
      setToken(id);
      console.log(id);
      setAlert("رمز پویا ارسال شد");
      setTimeout(() => {
        setAlert("");
      }, 3000);

      // const api = Kavenegar.KavenegarApi({
      //   apikey: process.env.NEXT_PUBLIC_KAVENEGAR,
      // });
      // api.VerifyLookup(
      //   {
      //     receptor: "09121089341",
      //     token: token,
      //     template: "registerverify",
      //   },
      //   function (response, status) {
      //     console.log(response);
      //     console.log(status);
      //   }
      // );
    } else {
      setAlert("شماره موبایل اشتباه است");
      setTimeout(() => {
        setAlert("");
      }, 3000);
    }
  };

  const handleRegister = (type) => {
    console.log(token, Number(checkToken));
    if (token === Number(checkToken)) {
      console.log(type);
      setName("");
      setPhone("");
      setCheckToken("");
      setTimeout(() => {
        setAlert("");
      }, 3000);
    } else {
      setCheckToken("");
      setAlert("رمز پویا اشتباه است");
      setTimeout(() => {
        setAlert("");
      }, 3000);
    }
  };

  return (
    <Fragment>
      {props.login && (
        <div className={classes.form}>
          <p className={classes.title}>ورود به دلماره</p>
          <div className={classes.input}>
            <p className={classes.label}>موبایل</p>
            <input
              type="tel"
              id="phone"
              name="phone"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              autoComplete="off"
            />
          </div>
          <button className="mainButton" onClick={() => verifyPhone()}>
            رمز پویا
          </button>
          <div className={classes.input}>
            <p className={classes.label}>رمز پویا</p>
            <input
              type="tel"
              id="number"
              name="number"
              onChange={(e) => setCheckToken(e.target.value)}
              value={checkToken}
              autoComplete="off"
            />
          </div>
          <div className={classes.formAction}>
            <p className={classes.alert}>{alert}</p>
            {checkToken.length === 6 && (
              <button
                className="mainButton"
                onClick={() => handleRegister("signin")}
              >
                Log in
              </button>
            )}
            <p
              className={classes.subTitle}
              onClick={() => {
                props.setSignup(true);
                props.setLogin(false);
                setAlert("");
              }}
            >
              Sign up
            </p>
          </div>
        </div>
      )}

      {props.signup && (
        <div className={classes.form}>
          <p className={classes.title}>ثبت نام در دلماره</p>
          <div className={classes.input}>
            <p className={classes.label}>نام و نام خانوادگی</p>
            <input
              type="text"
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              autoComplete="off"
              dir="rtl"
            />
          </div>
          <div className={classes.input}>
            <p className={classes.label}>موبایل</p>
            <input
              type="tel"
              id="phone"
              name="phone"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              autoComplete="off"
            />
          </div>
          <button className="mainButton" onClick={() => verifyPhone()}>
            رمز پویا
          </button>
          <div className={classes.input}>
            <p className={classes.label}>رمز پویا</p>
            <input
              type="tel"
              id="number"
              name="number"
              onChange={(e) => setCheckToken(e.target.value)}
              value={checkToken}
              autoComplete="off"
            />
          </div>
          <div className={classes.formAction}>
            <p className={classes.alert}>{alert}</p>
            {checkToken.length === 6 && (
              <button
                className="mainButton"
                onClick={() => handleRegister("signup")}
              >
                ورود
              </button>
            )}
            <p
              className={classes.subTitle}
              onClick={() => {
                props.setSignup(false);
                props.setLogin(true);
                setAlert("");
              }}
            >
              Log in
            </p>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Register;
