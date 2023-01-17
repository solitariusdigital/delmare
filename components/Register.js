import { useState, useContext, useRef, Fragment, useEffect } from "react";
import { StateContext } from "../context/stateContext";
import classes from "./Register.module.scss";
import Kavenegar from "kavenegar";
import { fourGenerator } from "../services/utility";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import loadingImage from "../assets/loader.png";
import { createUserApi, getUsersApi, getMessageApi } from "../services/api";
import secureLocalStorage from "react-secure-storage";

function Register() {
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { isLoading, setIsLoading } = useContext(StateContext);
  const { currentUser, seCurrentUser } = useContext(StateContext);
  const { appUsers, setAppUsers } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);
  const { kavenegarKey, setKavenegarKey } = useContext(StateContext);

  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [checkToken, setCheckToken] = useState("");
  const [alert, setAlert] = useState("");
  const [displayCounter, setDisplayCounter] = useState(false);
  const [counter, setCounter] = useState(59);
  const [message, setMessage] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUsersApi();
      setAppUsers(data);
    };
    fetchData().catch(console.error);
  }, [setAppUsers]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMessageApi();
      setMessage(data[0].message);
    };
    fetchData().catch(console.error);
  }, [setAppUsers]);

  let intervalRef = useRef(null);
  const startCounter = () => {
    intervalRef.current = setInterval(() => {
      setCounter(counter--);
      if (counter < 0) {
        resetCounter();
        setDisplayCounter(false);
        setCounter(59);
        setToken("");
        setCheckToken("");
      }
    }, 1500);
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
      setDisplayCounter(true);
      let tokenId = fourGenerator();
      setToken(tokenId);

      const api = Kavenegar.KavenegarApi({
        apikey: kavenegarKey,
      });
      api.VerifyLookup(
        {
          receptor: phone,
          token: tokenId.toString(),
          template: "registerverify",
        },
        function (response, status) {
          if (status === 200) {
            setAlert("کد تایید ارسال شد");
          } else {
            setAlert("خطا در سامانه ارسال کد تایید");
          }
          startCounter();
        }
      );
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
          secureLocalStorage.setItem("currentUser", JSON.stringify(user));
          setRegister(false);
        }
      });
      // if user does not exist create a new one
      if (!userExist) {
        await createUser();
      }
    } else {
      setAlert("کد تایید اشتباه است");
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
      name: "",
      phone: phone.trim(),
      address: "",
      post: "",
      birthday: "",
      permission: "customer",
    };
    let data = await createUserApi(user);
    if (data.hasOwnProperty("error")) {
      setAlert("خطا در برقراری ارتباط");
    } else {
      setRegister(false);
      setUserLogin(true);
      seCurrentUser(data);
      secureLocalStorage.setItem("currentUser", JSON.stringify(data));
    }
    setDisplayCounter(false);
    resetCounter();
    setCounter(59);
  };

  return (
    <Fragment>
      <div className={classes.form}>
        <p className={classes.title}>به دلماره خوش آمدید</p>
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
              کد تایید
            </button>
          </div>
        )}
        <div className={classes.input}>
          <div className={classes.bar}>
            <p className={classes.label}>
              کد تایید
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
          {checkToken.length === 4 && (
            <button className="mainButton" onClick={() => handleRegister()}>
              ورود / ​ثبت نام
            </button>
          )}
          {isLoading && (
            <Image width={50} height={50} src={loadingImage} alt="isLoading" />
          )}
        </div>
        {message.active && <p className={classes.message}>{message.text}</p>}
      </div>
    </Fragment>
  );
}

export default Register;
