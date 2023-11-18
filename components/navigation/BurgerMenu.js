import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./BurgerMenu.module.scss";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import Person4Icon from "@mui/icons-material/Person4";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import StarsIcon from "@mui/icons-material/Stars";
import Register from "../Register";
import Image from "next/legacy/image";
import logo from "../../assets/logo.svg";
import Router from "next/router";
import HomeIcon from "@mui/icons-material/Home";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import secureLocalStorage from "react-secure-storage";
import StarIcon from "@mui/icons-material/Star";
import DownloadIcon from "@mui/icons-material/Download";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import { convertNumber } from "../../services/utility";

export default function BurgerMenu() {
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);
  const { searchControl, setSearchControl } = useContext(StateContext);
  const { referralData, setReferralData } = useContext(StateContext);
  const [lotaltyPoint, setLoyaltyPoint] = useState(0);

  const [alert, setAlert] = useState("");
  const [contact, setContact] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [desktop, setDesktop] = useState(false);

  const menuOptions = [
    {
      title:
        currentUser && currentUser.permission === "blogger"
          ? "حساب بلاگر"
          : "حساب من",
      icon: <Person4Icon />,
      call: () => {
        navigateMenu("account");
        setContact(false);
      },
    },
    {
      title:
        currentUser && currentUser.permission === "blogger"
          ? "برگزیده"
          : "سبد آرزو",
      icon:
        currentUser && currentUser.permission === "blogger" ? (
          <StarIcon />
        ) : (
          <FavoriteIcon />
        ),
      call: () => {
        navigateMenu("wish");
        setContact(false);
      },
    },
    {
      title:
        currentUser && currentUser.permission === "blogger"
          ? "کمد بلاگر"
          : "کمد من",
      icon: <ShoppingBasketIcon />,
      call: () => {
        navigateMenu("orders");
        setContact(false);
      },
    },
    {
      title: "سبد خرید",
      icon: <ShoppingCartIcon />,
      call: () => {
        navigateMenu("cart");
        setContact(false);
      },
    },
    {
      title: "بلاگرز من",
      icon: <StarsIcon />,
      call: () => {
        navigateMenu("follow");
        setContact(false);
      },
    },
    {
      title: "صفحه اصلی",
      icon: <HomeIcon />,
      call: () => {
        setMenu(false);
        setSearchControl(false);
        Router.push("/");
      },
    },
    {
      title: "دلماره",
      icon: <AutoAwesomeIcon />,
      call: () => {
        navigateMenu("about");
        setContact(false);
      },
    },
    {
      title: "تماس",
      icon: <PhoneIphoneOutlinedIcon />,
      call: () => {
        setContact(!contact);
        setAdmin(false);
        setAlert("");
      },
    },
  ];

  useEffect(() => {
    if (currentUser) {
      setLoyaltyPoint(currentUser.loyalty);
    }
    const checkDeviceType = () => {
      if (
        !window.matchMedia("(display-mode: standalone)").matches &&
        navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)
      ) {
        setDesktop(true);
      }
    };
    checkDeviceType();
  }, [currentUser, setDesktop]);

  const navigateMenu = (action) => {
    if (
      userLogIn ||
      action === "cart" ||
      action === "about" ||
      action === "download"
    ) {
      setToggleContainer(action);
      setMenu(false);
    } else {
      setAlert("برای دسترسی وارد شوید");
    }
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  const closeMenu = () => {
    setMenu(false);
    setRegister(false);
    if (referralData.user) {
      Router.push("/");
    }
  };

  return (
    <div className={classes.slider} style={{ height: window.innerHeight }}>
      <div className={classes.menu}>
        <div className={classes.cross}>
          <CloseIcon
            className="icon"
            onClick={() => {
              closeMenu();
            }}
          />
          {currentUser && (
            <Fragment>
              <div className={classes.row}>
                <MonetizationOnIcon className="gold-icon" />
                <p>{convertNumber(lotaltyPoint)} T</p>
              </div>
              <div
                className={classes.row}
                onClick={() => navigateMenu("account")}
              >
                {currentUser.permission === "admin" && <MilitaryTechIcon />}
                {currentUser.permission === "agent" && <MilitaryTechIcon />}
                {currentUser.permission === "blogger" && <StarIcon />}
                {currentUser.permission === "customer" && <Person4Icon />}
                <p>
                  {currentUser.name === ""
                    ? currentUser.phone
                    : currentUser.name}
                </p>
              </div>
            </Fragment>
          )}
        </div>
        <div className={classes.items}>
          {!register ? (
            <div>
              <div className={classes.list}>
                {menuOptions.map((nav, index) => (
                  <div className={classes.item} key={index} onClick={nav.call}>
                    {nav.icon}
                    <p>{nav.title}</p>
                  </div>
                ))}
                {desktop && (
                  <div
                    className={classes.item}
                    onClick={() => {
                      navigateMenu("download");
                      setContact(false);
                    }}
                  >
                    <DownloadIcon />
                    <p>راهنمای نصب</p>
                  </div>
                )}
                {userLogIn &&
                  (JSON.parse(secureLocalStorage.getItem("currentUser"))[
                    "permission"
                  ] === "admin" ||
                    JSON.parse(secureLocalStorage.getItem("currentUser"))[
                      "permission"
                    ] === "agent") && (
                    <div
                      className={classes.item}
                      onClick={() => {
                        setAdmin(!admin);
                        setContact(false);
                      }}
                    >
                      <MilitaryTechIcon />
                      <p>ادمین</p>
                    </div>
                  )}
              </div>
              {!userLogIn && (
                <div className={classes.buttonContainer}>
                  <button
                    className={`mainButton ${classes.button}`}
                    onClick={() => {
                      setRegister(true);
                      setContact(false);
                    }}
                  >
                    ورود / ​ثبت نام
                  </button>
                  <p className={classes.alert}>{alert}</p>
                </div>
              )}
            </div>
          ) : (
            // login form
            <Register></Register>
          )}
          {contact && (
            <div className={classes.box}>
              <div className={classes.social}>
                <InstagramIcon
                  className="icon"
                  sx={{ fontSize: 28 }}
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/delmarehofficial/",
                      "_ blank"
                    )
                  }
                />
                <TelegramIcon
                  sx={{ fontSize: 28 }}
                  className="icon"
                  onClick={() =>
                    window.open("https://t.me/odinhallofficial", "_ blank")
                  }
                />
              </div>
              {/* <div className={classes.row}>
                <p>
                  خیابان ولیعصر، ۱۰۰ متر پایینتر از سه راه توانیر، نبش بخشندگان،
                  مجتمع مدیکوسنتر، طبقه ۴، واحد ۴۰۶
                </p>
              </div> */}
              {/* <div className={classes.row}>
                <p>0933 336 3411</p>
                <p>021 8879 3585</p>
              </div> */}
            </div>
          )}
          {admin && (
            <div className={classes.box}>
              <div className={classes.row}>
                {JSON.parse(secureLocalStorage.getItem("currentUser"))[
                  "permission"
                ] === "admin" && (
                  <Fragment>
                    <button
                      className="mainButton"
                      onClick={() => Router.push("/invoice")}
                    >
                      Invoices
                    </button>
                    <button
                      className="mainButton"
                      onClick={() => Router.push("/users")}
                    >
                      Users
                    </button>
                  </Fragment>
                )}
                <button
                  className="mainButton"
                  onClick={() => Router.push("/upload")}
                >
                  Upload
                </button>
              </div>
            </div>
          )}
          {!admin && !contact && (
            <div className={classes.logo}>
              <Image width={90} height={140} src={logo} alt="logo" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
