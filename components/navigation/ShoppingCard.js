import { useState, useContext } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./ShoppingCard.module.scss";

export default function ShoppingCard() {
  const { card, setCard } = useContext(StateContext);
  const { shoppingCard, setShoppingCard } = useContext(StateContext);

  const deleteCard = (index) => {
    setShoppingCard(
      shoppingCard.filter((card, i) => {
        return i !== index;
      })
    );
    localStorage.setItem("shoppingCard", JSON.stringify(shoppingCard));
  };

  return (
    <div className={classes.background}>
      <div className={classes.menu}>
        <div className={classes.topBar}>
          <CloseIcon className="icon" onClick={() => setCard(false)} />
          <div className={classes.title}>
            <p>Shopping card</p>
            <p className={classes.count}>{shoppingCard.length}</p>
          </div>
        </div>
        <div className={classes.items}>
          {shoppingCard.map((card, index) => (
            <div key={index} className={classes.item}>
              <div className={classes.close}>
                <CloseIcon
                  className="icon icon-red"
                  onClick={() => deleteCard(index)}
                />
              </div>
              <p>{card.price}</p>
              <p>{card.size}</p>
              <p>{card.color}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
