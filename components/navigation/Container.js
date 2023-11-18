import { Fragment, useContext } from "react";
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import classes from "./Container.module.scss";
import Router from "next/router";
import Image from "next/legacy/image";
import brand from "../../assets/brand.svg";
import lemon from "../../assets/lemon.png";

function Container() {
  const { menu, setMenu } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const { collectionsToggle, setCollectionsToggle } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);
  const { search, setSearch } = useContext(StateContext);
  const { searchControl, setSearchControl } = useContext(StateContext);
  const { toggleType, setToggleType } = useContext(StateContext);

  const collections = [
    {
      title: "کالکشن مد",
      link: "/collections/gallery",
    },
    {
      title: "محصولات بهداشتی",
      link: "/collections/skin",
    },
  ];

  const activateNav = (link, index) => {
    sessionStorage.removeItem("positionY");
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
            onClick={() => window.location.assign("/")}
          >
            <Image width={40} height={40} src={lemon} alt="lemon" priority />
            <div className={classes.brand}>
              <Image src={brand} alt="brand" />
            </div>
            <Image width={40} height={40} src={lemon} alt="lemon" priority />
          </div>

          <div className="shoppingcart-icon">
            {searchControl && (
              <UnfoldMoreIcon
                className="icon search"
                onClick={() => setSearch(!search)}
                sx={{ fontSize: 28 }}
              />
            )}
            <div className={classes.menuIcon}>
              <MenuIcon className="icon" onClick={() => setMenu(true)} />
            </div>
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
