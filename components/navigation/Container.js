import { Fragment, useContext, useEffect } from "react";
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
import { getUserApi } from "../../services/api";

function Container() {
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const { collectionsToggle, setCollectionsToggle } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { search, setSearch } = useContext(StateContext);
  const { searchControl, setSearchControl } = useContext(StateContext);
  const { gallery, setGallery } = useContext(StateContext);
  const { toggleType, setToggleType } = useContext(StateContext);

  const collections = [
    {
      title: "کالکشن لباس",
      link: "/collections/clothing",
    },
    {
      title: "لوازم بهداشتی",
      link: "/collections/care",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUserData = JSON.parse(
          secureLocalStorage.getItem("currentUser")
        );
        if (currentUserData) {
          setUserLogin(true);
          const user = await getUserApi(currentUserData["_id"]);
          setCurrentUser(user);
          secureLocalStorage.setItem("currentUser", JSON.stringify(user));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
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
    sessionStorage.removeItem("positionY");
    setGallery([]);
    navigationTopBar.map((nav, i) => {
      if (i === index) {
        Router.push(link);
        nav.active = true;
      } else {
        nav.active = false;
      }
    });
    setNavigationTopBar([...navigationTopBar]);
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
                sx={{ fontSize: 28 }}
              />
            )}
            <MenuIcon className="icon" onClick={() => setMenu(true)} />
          </div>
        </div>
        {bar && (
          <div className={classes.navigation}>
            {navigationTopBar
              .map((nav, index) => (
                <Fragment key={index}>
                  {nav.type === toggleType && (
                    <div
                      className={!nav.active ? classes.nav : classes.navActive}
                      onClick={() => activateNav(nav.link, index)}
                    >
                      <p>{nav.title}</p>
                    </div>
                  )}
                </Fragment>
              ))
              .reverse()}
          </div>
        )}
        {collectionsToggle && (
          <div className={classes.navigation}>
            {collections
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
