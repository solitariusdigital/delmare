import { useContext, useState, useEffect, useRef } from "react";
import { StateContext } from "../../context/stateContext";
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import Account from "./Account";
import ShoppingCart from "./ShoppingCart";
import WishList from "./WishList";
import Orders from "./Orders";
import Transactions from "./Transactions";
import AddHomeScreen from "./AddHomeScreen";
import { getMobileOperatingSystem } from "../../services/utility";

import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import classes from "./Container.module.scss";
import Router from "next/router";

import Image from "next/image";
import brand from "../../assets/brand.svg";

function Container() {
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { navigation, setNavigation } = useContext(StateContext);
  const { currentUser, seCurrentUser } = useContext(StateContext);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("currentUser"))) {
      setUserLogin(true);
      seCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
    }
    // check if user is using pwa
    if (!window.matchMedia("(display-mode: standalone)").matches) {
      setToggleContainer("screen");
    }
  }, [setToggleContainer, setUserLogin, seCurrentUser]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("shoppingCart"))) {
      setShoppingCart(JSON.parse(localStorage.getItem("shoppingCart")));
    } else {
      localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activateNav = (index) => {
    navigation.map((nav, i) => {
      if (i === index) {
        nav.active = !nav.active;
      } else {
        nav.active = false;
      }
    });
    setNavigation([...navigation]);
  };

  const navigateLandingPage = () => {
    Router.push("/");
    navigation.map((nav, i) => {
      nav.active = false;
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.bar}>
          <div className="shoppingcart-icon">
            <ShoppingCartIcon
              className="icon"
              onClick={() => setToggleContainer("cart")}
            />
            <p>{shoppingCart.length === 0 ? "" : shoppingCart.length}</p>
          </div>
          <div className={classes.brand}>
            <Image
              src={brand}
              alt="brand"
              onClick={() => navigateLandingPage()}
            />
          </div>
          <MenuIcon className="icon" onClick={() => setMenu(true)} />
        </div>
        {bar && (
          <div className={classes.navigation}>
            {navigation.map((nav, index) => (
              <div
                key={index}
                className={!nav.active ? classes.nav : classes.navActive}
                onClick={() => activateNav(index)}
              >
                <Link href={nav.link}>{nav.title}</Link>
              </div>
            ))}
          </div>
        )}
      </div>
      {menu && <BurgerMenu />}
      {/* container layouts / pages navigation from menu */}
      {toggleContainer === "empty" && <p></p>}
      {toggleContainer === "screen" && <AddHomeScreen />}
      {toggleContainer === "account" && <Account />}
      {toggleContainer === "cart" && <ShoppingCart />}
      {toggleContainer === "wish" && <WishList />}
      {toggleContainer === "orders" && <Orders />}
      {toggleContainer === "transactions" && <Transactions />}
    </div>
  );
}

export default Container;
