import { Fragment, useContext } from "react";
import { StateContext } from "../../context/stateContext";
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import classes from "./MainNavigation.module.scss";

function MainNavigation() {
  const { menu, setMenu } = useContext(StateContext);

  const navigation = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "Profile",
      link: "/profile",
    },
    {
      title: "New",
      link: "/new",
    },
  ];

  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.header}>
          <div className={classes.bar}>
            <ShoppingCartIcon className="icon" />
            <p>DELMARE</p>
            <MenuIcon className="icon" onClick={() => setMenu(true)} />
          </div>
          <div className={classes.navigation}>
            {navigation.map((nav, index) => (
              <div key={index}>
                <Link href={nav.link}>{nav.title}</Link>
              </div>
            ))}
          </div>
        </div>
        {menu && <BurgerMenu />}
      </div>
    </Fragment>
  );
}

export default MainNavigation;
