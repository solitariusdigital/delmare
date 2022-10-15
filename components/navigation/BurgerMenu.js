import { useState, useContext } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./BurgerMenu.module.scss";

import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

import Image from "next/image";
import logo from "../../assets/logo.png";

import Register from "../Register";

export default function BurgerMenu() {
  const { menu, setMenu } = useContext(StateContext);
  const { cart, setCart } = useContext(StateContext);

  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);

  const navigation = [
    {
      title: "حساب من",
      icon: <AccountBoxIcon />,
    },
    {
      title: "سبد خرید",
      icon: <ShoppingCartIcon />,
      call: () => {
        setCart(true);
        setMenu(false);
      },
    },
    {
      title: "سبد آرزوها",
      icon: <FavoriteIcon />,
    },
    {
      title: "پیگیری سفارش",
      icon: <LocalShippingIcon />,
    },
    {
      title: "تراکنش",
      icon: <ChangeCircleIcon />,
    },
  ];

  return (
    <div className={classes.background}>
      <div className={classes.menu}>
        <div className={classes.cross}>
          <CloseIcon className="icon" onClick={() => setMenu(false)} />
        </div>

        <div className={classes.items}>
          {!login && !signup && (
            <div>
              <div className={classes.list}>
                {navigation.map((nav, index) => (
                  <div className={classes.item} key={index} onClick={nav.call}>
                    {nav.icon}
                    <p>{nav.title}</p>
                  </div>
                ))}
              </div>

              <div className={classes.buttonContainer}>
                <button
                  className="subButton"
                  onClick={() => {
                    setLogin(true);
                    setSignup(false);
                  }}
                >
                  Log in
                </button>
                <button
                  className="mainButton"
                  onClick={() => {
                    setSignup(true);
                    setLogin(false);
                  }}
                >
                  Sign up
                </button>
              </div>
            </div>
          )}

          <Register props={{ login, signup, setLogin, setSignup }}></Register>

          <div className={classes.logo}>
            <Image width={100} height={140} src={logo} alt="logo" />
          </div>
        </div>
      </div>
      <div className={classes.close} onClick={() => setMenu(false)}></div>
    </div>
  );
}
