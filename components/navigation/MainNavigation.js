import { useContext } from "react";
import { StateContext } from "../../context/stateContext";
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import ShoppingCard from "./ShoppingCard";

import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import classes from "./MainNavigation.module.scss";
import Router from "next/router";

import Image from "next/image";
import brand from "../../assets/brand.svg";

function MainNavigation() {
  const { menu, setMenu } = useContext(StateContext);
  const { card, setCard } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);

  const { shoppingCard, setShoppingCard } = useContext(StateContext);

  const navigation = [
    {
      title: "New",
      link: "/collections/new",
    },
    {
      title: "Sale",
      link: "/collections/sale",
    },
    {
      title: "Brands",
      link: "/collections/brands",
    },
    {
      title: "Bloggers",
      link: "/collections/bloggers",
    },
  ];

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.bar}>
          <div className={classes.card}>
            <ShoppingCartIcon className="icon" onClick={() => setCard(true)} />
            <p>{shoppingCard.length === 0 ? "" : shoppingCard.length}</p>
          </div>
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
      {card && <ShoppingCard />}
    </div>
  );
}

export default MainNavigation;
