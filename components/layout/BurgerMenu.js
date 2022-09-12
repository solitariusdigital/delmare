import { useContext } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./BurgerMenu.module.scss";

import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

export default function BurgerMenu() {
  const { menu, setMenu } = useContext(StateContext);

  const navigation = [
    {
      title: "حساب من",
      icon: <AccountBoxIcon />,
    },
    {
      title: "سبد خرید",
      icon: <ShoppingCartIcon />,
    },
    {
      title: "سبد آرزوها",
      icon: <FavoriteIcon />,
    },
    {
      title: "پیگیری سفارش",
      icon: <LocalShippingIcon />,
    },
    {
      title: "تراکنش",
      icon: <ChangeCircleIcon />,
    },
  ];

  return (
    <div className={classes.container}>
      <div className={classes.menu}>
        <div className={classes.cross}>
          <CloseIcon className="icon" onClick={() => setMenu(false)} />
        </div>
        <div className={classes.list}>
          {navigation.map((nav, index) => (
            <div className={classes.item} key={index}>
              {nav.icon}
              <p>{nav.title}</p>
            </div>
          ))}
        </div>
        <div className={classes.brandContainer}>
          <button className="subButton">Log in</button>
          <button className="mainButton">Sign up</button>
          <p className="brand">DELMARE</p>
        </div>
      </div>
    </div>
  );
}
