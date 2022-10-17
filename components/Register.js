import { useState, useContext, useRef } from "react";
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
  const [displayCounter, setDisplayCounter] = useState(false);
  const [counter, setCounter] = useState(10);

  let intervalRef = useRef(null);
  const startCounter = () => {
    intervalRef.current = setInterval(() => {
      setCounter(counter--);
      setDisplayCounter(true);
      if (counter < 0) {
        resetCounter();
        setDisplayCounter(false);
        setCounter(10);
        setToken("");
        setCheckToken("");
      }
    }, 1000);
  };

  const resetCounter = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const verifyPhone = () => {
    if (phone.length === 0) {
      setAlert("موبایل را وارد کنید");
      setTimeout(() => {
        setAlert("");
      }, 3000);
      return;
    }

    if (phone.length === 11 && phone.slice(0, 2) === "09") {
      let tokenId = tokenGenerator();
      setToken(tokenId);

      setAlert("کد فعال سازی ارسال شد");
      startCounter();
      console.log(tokenId);

      // const api = Kavenegar.KavenegarApi({
      //   apikey: process.env.NEXT_PUBLIC_KAVENEGAR,
      // });
      // api.VerifyLookup(
      //   {
      //     receptor: "09121089341",
      //     token: tokenId.toString(),
      //     template: "registerverify",
      //   },
      //   function (response, status) {
      //     if (status === 200) {
      //       setAlert("کد فعال سازی ارسال شد");
      //     } else {
      //       setAlert("خطا در سامانه ارسال کد فعال سازی");
      //     }
      //     startCounter();
      //   }
      // );
    } else {
      setAlert("شماره موبایل اشتباه است");
    }
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  const handleRegister = () => {
    if (token === Number(checkToken)) {
      console.log("works");
      setDisplayCounter(false);
      resetCounter();
      setCounter(10);
    } else {
      setAlert("کد فعال سازی اشتباه است");
    }
    setTimeout(() => {
      setAlert("");
    }, 3000);
    setToken("");
    setCheckToken("");
    setName("");
    setPhone("");
  };

  return (
    <Fragment>
      {props.register && (
        <div className={classes.form}>
          <p className={classes.title}>به دلماره خوش آمدید</p>
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
          {displayCounter ? (
            <div className={classes.activationCode}>
              <p className={classes.alert}>{counter}</p>
              <p className={classes.alert}>ثانیه تا درخواست مجدد کد</p>
            </div>
          ) : (
            <button className="mainButton" onClick={() => verifyPhone()}>
              کد فعال سازی
            </button>
          )}
          <div className={classes.input}>
            <p className={classes.label}>کد فعال سازی</p>
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
              <button className="mainButton" onClick={() => handleRegister()}>
                ورود
              </button>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Register;
