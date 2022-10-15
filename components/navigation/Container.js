import { useContext, useState } from "react";
import { StateContext } from "../../context/stateContext";
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import ShoppingCart from "./ShoppingCart";

import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import classes from "./Container.module.scss";
import Router from "next/router";

import Image from "next/image";
import brand from "../../assets/brand.svg";

function Container() {
  const { menu, setMenu } = useContext(StateContext);
  const { cart, setCart } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { navigation, setNavigation } = useContext(StateContext);

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
          <div className={classes.card}>
            <ShoppingCartIcon className="icon" onClick={() => setCart(true)} />
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
      {cart && <ShoppingCart />}
      {cart && <ShoppingCart />}
    </div>
  );
}

export default Container;
