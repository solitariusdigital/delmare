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

  const calculateTotal = () => {
    let prices = [];
    shoppingCart.map((card) => {
      prices.push(parseFloat(card.price));
    });
    const total = prices.reduce((partialSum, a) => partialSum + a, 0);
    return total.toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
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
                    className="icon icon-grey"
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
        <div className={classes.details}>
          <div className={classes.detail}>
            <p>{shoppingCart.length}</p>
            <p>تعداد آیتم ها</p>
          </div>
          <div className={classes.detail}>
            <p>{calculateTotal()} T</p>
            <p>جمع سبد خرید</p>
          </div>
          <button
            className={`mainButton ${classes.button}`}
            disabled={shoppingCart.length === 0}
          >
            {shoppingCart.length > 0 ? "ادامه" : "سبد خرید خالی"}
          </button>
        </div>
      </div>
    </div>
  );
}
