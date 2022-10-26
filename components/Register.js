import { useState, useContext, useRef, Fragment, useEffect } from "react";
import { StateContext } from "../context/stateContext";
import classes from "./Register.module.scss";
import Kavenegar from "kavenegar";
import { tokenGenerator } from "../services/utility";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import loadingImage from "../assets/loader.png";
import Router from "next/router";
import { createUserApi } from "../services/user";

function Register() {
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { isLoading, setIsLoading } = useContext(StateContext);
  const { currentUser, seCurrentUser } = useContext(StateContext);
  const { appUsers, setAppUsers } = useContext(StateContext);

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
      setAlert("شماره موبایل را وارد کنید");
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
      //     receptor: phone,
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

  const handleRegister = async () => {
    if (token === Number(checkToken)) {
      setIsLoading(true);
      let userExist = false;
      // check if user already exist in db
      appUsers.forEach((user) => {
        if (user.phone === phone) {
          userExist = true;
          setUserLogin(true);
          seCurrentUser(user);
          localStorage.setItem("currentUser", JSON.stringify(user));
          setMenu(false);
        }
      });
      // if user does not exist create a new one
      if (!userExist) {
        await createUser();
      }
    } else {
      setAlert("کد فعال سازی اشتباه است");
    }
    setToken("");
    setCheckToken("");
    setIsLoading(false);
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };
  // create new user into db/state/localstorage
  const createUser = async () => {
    const user = {
      name: name,
      phone: phone,
      address: "",
      post: "",
    };
    let data = await createUserApi(user);
    if (data.hasOwnProperty("error")) {
      setAlert("خطا در برقراری ارتباط");
    } else {
      setMenu(false);
      setUserLogin(true);
      seCurrentUser(data);
      localStorage.setItem("currentUser", JSON.stringify(data));
      Router.push("/");
    }
    setDisplayCounter(false);
    resetCounter();
    setCounter(10);
  };

  return (
    <Fragment>
      <div className={classes.form}>
        <p className={classes.title}>به دلماره خوش آمدید</p>
        <div className={classes.input}>
          <div className={classes.bar}>
            <p className={classes.label}>نام و نام خانوادگی</p>
            <CloseIcon
              className="icon"
              onClick={() => setName("")}
              sx={{ fontSize: 16 }}
            />
          </div>
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
          <div className={classes.bar}>
            <p className={classes.label}>
              موبایل
              <span>*</span>
            </p>
            <CloseIcon
              className="icon"
              onClick={() => setPhone("")}
              sx={{ fontSize: 16 }}
            />
          </div>
          <input
            type="tel"
            id="phone"
            name="phone"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            autoComplete="off"
            dir="rtl"
          />
        </div>
        {displayCounter ? (
          <div className={classes.activationContainer}>
            <div className={classes.activationCode}>
              <p className={classes.alert}>{counter}</p>
              <p className={classes.alert}>ثانیه تا درخواست مجدد کد</p>
            </div>
          </div>
        ) : (
          <div className={classes.activationContainer}>
            <button className="mainButton" onClick={() => verifyPhone()}>
              کد فعال سازی
            </button>
          </div>
        )}
        <div className={classes.input}>
          <div className={classes.bar}>
            <p className={classes.label}>
              کد فعال سازی
              <span>*</span>
            </p>
            <CloseIcon
              className="icon"
              onClick={() => setCheckToken("")}
              sx={{ fontSize: 16 }}
            />
          </div>

          <input
            type="tel"
            id="number"
            name="number"
            onChange={(e) => setCheckToken(e.target.value)}
            value={checkToken}
            autoComplete="off"
            dir="rtl"
          />
        </div>
        <div className={classes.formAction}>
          <p className={classes.alert}>{alert}</p>
          {checkToken.length === 6 && (
            <button className="mainButton" onClick={() => handleRegister()}>
              ورود
            </button>
          )}
          {isLoading && (
            <Image width={50} height={50} src={loadingImage} alt="isLoading" />
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default Register;
