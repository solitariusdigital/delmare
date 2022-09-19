import { useContext } from "react";
import { StateContext } from "../../context/stateContext";
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import classes from "./MainNavigation.module.scss";
import Router from "next/router";

import Image from "next/image";
import brand from "../../assets/brand.svg";

function MainNavigation() {
  const { menu, setMenu } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const navigation = [
    {
      title: "new",
      link: "/collections/new",
    },
    {
      title: "sale",
      link: "/collections/sale",
    },
    {
      title: "brands",
      link: "/collections",
    },
    {
      title: "loggers",
      link: "/collections",
    },
  ];

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.bar}>
          <ShoppingCartIcon className={classes.container} />
          <div className={classes.brand}>
            <Image src={brand} alt="brand" onClick={() => Router.push("/")} />
          </div>
          <MenuIcon className="icon" onClick={() => setMenu(true)} />
        </div>
        {bar && (
          <div className={classes.navigation}>
            {navigation.map((nav, index) => (
              <div key={index}>
                <Link href={nav.link}>{nav.title}</Link>
              </div>
            ))}
          </div>
        )}
      </div>
      {menu && <BurgerMenu />}
    </div>
  );
}

export default MainNavigation;
