import { useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import BurgerMenu from "./BurgerMenu";
import Account from "./Account";
import ShoppingCart from "./ShoppingCart";
import WishList from "./WishList";
import Orders from "./Orders";
import About from "./About";
import Download from "./Download";
import Follow from "./Follow";
import AddHomeScreen from "./AddHomeScreen";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import classes from "./Container.module.scss";
import Router from "next/router";
import Image from "next/image";
import brand from "../../assets/brand.svg";
import secureLocalStorage from "react-secure-storage";
import { updateUserApi } from "../../services/api";

function Container() {
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { navigation, setNavigation } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { search, setSearch } = useContext(StateContext);
  const { searchControl, setSearchControl } = useContext(StateContext);
  const { gallery, setGallery } = useContext(StateContext);

  useEffect(() => {
    const fetchData = async () => {
      if (JSON.parse(secureLocalStorage.getItem("currentUser"))) {
        setUserLogin(true);
        setCurrentUser(JSON.parse(secureLocalStorage.getItem("currentUser")));
        await updateUserApi(
          JSON.parse(secureLocalStorage.getItem("currentUser"))
        );
      }
    };
    fetchData().catch(console.error);
  }, [setUserLogin, setCurrentUser]);

  useEffect(() => {
    if (JSON.parse(secureLocalStorage.getItem("shoppingCart"))) {
      setShoppingCart(JSON.parse(secureLocalStorage.getItem("shoppingCart")));
    } else {
      secureLocalStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activateNav = (link, index) => {
    setGallery([]);
    Router.push(link);
    navigation.map((nav, i) => {
      if (i === index) {
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
          <div
            className={classes.brandContainer}
            onClick={() => navigateLandingPage()}
          >
            <div className={classes.brand}>
              <Image src={brand} alt="brand" />
            </div>
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
                  onClick={() => activateNav(nav.link, index)}
                >
                  <p>{nav.title}</p>
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
      {toggleContainer === "download" && <Download />}
      {toggleContainer === "follow" && <Follow />}
    </div>
  );
}

export default Container;
