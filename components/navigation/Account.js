import { useState, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCart from "./ShoppingCart.module.scss";
import classes from "./Account.module.scss";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Account() {
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);

  return (
    <div className={ShoppingCart.background}>
      <div className={ShoppingCart.menu}>
        <div className={ShoppingCart.topBar}>
          <CloseIcon className="icon" onClick={() => setToggleContainer("")} />
          <div className={ShoppingCart.title}>
            <p>حساب من</p>
          </div>
          <div className="shoppingcart-icon">
            <ShoppingCartIcon
              className="icon"
              onClick={() => setToggleContainer("cart")}
            />
            <p>{shoppingCart.length === 0 ? "" : shoppingCart.length}</p>
          </div>
        </div>

        <div>
          <div>
            <p className={classes.label}>نام و نام خانوادگی</p>
            <p></p>
          </div>
          <div>
            <p className={classes.label}>شماره موبایل</p>

            <p></p>
          </div>
          <div>
            <p className={classes.label}>آدرس تحویل</p>

            <p></p>
          </div>
          <div>
            <p className={classes.label}>کد پستی</p>

            <p></p>
          </div>
        </div>
      </div>
    </div>
  );
}
