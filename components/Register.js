import { useState, useContext, useRef, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import classes from "./Register.module.scss";
import Kavenegar from "kavenegar";
import { tokenGenerator } from "../services/utility";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import loadingImage from "../assets/loader.png";

function Register() {
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { isLoading, setIsLoading } = useContext(StateContext);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("09123456789");
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
      // setMenu(false);

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

      const user = {
        name: "Pouyan",
        phone: "09121576992",
        address: "asdasdasd",
        postCode: "2121121",
      };

      const response = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      setIsLoading(false);
      // setUserLogin(true);
      // localStorage.setItem("userSession", JSON.stringify(true));

      setDisplayCounter(false);
      resetCounter();
      setCounter(10);
    } else {
      setAlert("کد فعال سازی اشتباه است");
      setToken("");
      setCheckToken("");
      setTimeout(() => {
        setAlert("");
      }, 3000);
    }
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
            placeholder="09123456789"
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
