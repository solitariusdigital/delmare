import { useState, useContext } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./ShoppingCart.module.scss";

export default function ShoppingCart() {
  const { card, setCard } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);

  const deleteCard = (index) => {
    setShoppingCart(
      shoppingCart.filter((card, i) => {
        return i !== index;
      })
    );
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  };

  return (
    <div className={classes.background}>
      <div className={classes.menu}>
        <div className={classes.topBar}>
          <CloseIcon className="icon" onClick={() => setCard(false)} />
          <div className={classes.title}>
            <p className={classes.count}>{shoppingCart.length}</p>
            <p>سبد خرید</p>
          </div>
        </div>
        <div className={classes.items}>
          {shoppingCart
            .map((card, index) => (
              <div key={index} className={classes.item}>
                <div className={classes.close}>
                  <CloseIcon
                    className="icon icon-red"
                    onClick={() => deleteCard(index)}
                  />
                </div>
                <div className={classes.row}>
                  <p>{card.price} T</p>
                  <p>{card.title}</p>
                </div>
                <div className={classes.row}>
                  <div className={classes.size}>{card.size}</div>
                  <div
                    className={classes.color}
                    style={{ backgroundColor: card.color }}
                  ></div>
                </div>
              </div>
            ))
            .reverse()}
        </div>
        <div className={classes.btnContainer}>
          <button
            className={`mainButton ${classes.button}`}
            disabled={shoppingCart.length === 0}
          >
            {shoppingCart.length > 0 ? "افزودن به سبد خرید" : "empty"}
          </button>
        </div>
      </div>
    </div>
  );
}
