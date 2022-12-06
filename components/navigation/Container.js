import { useContext, useState, useEffect, useRef } from "react";
import { StateContext } from "../../context/stateContext";
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import Account from "./Account";
import ShoppingCart from "./ShoppingCart";
import WishList from "./WishList";
import Orders from "./Orders";
import About from "./About";
import AddHomeScreen from "./AddHomeScreen";
import SearchIcon from "@mui/icons-material/Search";
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
  const { search, setSearch } = useContext(StateContext);
  const { searchControl, setSearchControl } = useContext(StateContext);
  const { tempInvoice, setTempInvoice } = useContext(StateContext);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("currentUser"))) {
      setUserLogin(true);
      seCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
    }
    // check if user is using pwa
    if (!window.matchMedia("(display-mode: standalone)").matches) {
      setToggleContainer("screen");
    }
  }, [setToggleContainer, setUserLogin, seCurrentUser, navigation]);

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
        if (nav.title === "برند") {
          setSearchControl(false);
        } else {
          setSearchControl(true);
        }
        nav.active = true;
      } else {
        nav.active = false;
      }
    });
    setNavigation([...navigation]);
  };

  const navigateLandingPage = () => {
    setSearchControl(false);
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
          <div className={classes.brand} onClick={() => navigateLandingPage()}>
            <Image src={brand} alt="brand" />
          </div>
          <div className="shoppingcart-icon">
            {searchControl && (
              <SearchIcon
                className="icon search"
                onClick={() => setSearch(!search)}
              />
            )}
            <MenuIcon className="icon" onClick={() => setMenu(true)} />
          </div>
        </div>
        {bar && (
          <div className={classes.navigation}>
            {navigation
              .map((nav, index) => (
                <div
                  key={index}
                  className={!nav.active ? classes.nav : classes.navActive}
                  onClick={() => activateNav(index)}
                >
                  <Link href={nav.link}>{nav.title}</Link>
                </div>
              ))
              .reverse()}
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
      {toggleContainer === "about" && <About />}
    </div>
  );
}

export default Container;
