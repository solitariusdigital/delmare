import { Fragment, useContext } from "react";
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

  return (
    <div className={classes.menu}>
      <CloseIcon className="icon" onClick={() => setMenu(false)} />
      <div className={classes.list}>
        <div className={classes.item}>
          <AccountBoxIcon />
          <p>حساب من</p>
        </div>
        <div className={classes.item}>
          <ShoppingCartIcon />
          <p>سبد خرید</p>
        </div>
        <div className={classes.item}>
          <FavoriteIcon />
          <p>سبد آرزوها</p>
        </div>
        <div className={classes.item}>
          <LocalShippingIcon />
          <p>پیگیری سفارش</p>
        </div>
        <div className={classes.item}>
          <ChangeCircleIcon />
          <p>تراکنش ها</p>
        </div>
      </div>
    </div>
  );
}
