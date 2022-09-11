import Link from "next/link";

import classes from "./MainNavigation.module.scss";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

function MainNavigation() {
  let navigation = [
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
    <div className={classes.header}>
      <div className={classes.bar}>
        <ShoppingCartIcon />
        <p>DELMARE</p>
        <MenuIcon />
      </div>
      <div className={classes.navigation}>
        {navigation.map((nav, index) => (
          <div key={index}>
            <Link href={nav.link}>{nav.title}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainNavigation;
