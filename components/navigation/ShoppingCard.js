import { useState, useContext } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./ShoppingCard.module.scss";

export default function ShoppingCard() {
  const { card, setCard } = useContext(StateContext);

  return (
    <div className={classes.background}>
      <div className={classes.menu}>
        <div className={classes.cross}>
          <CloseIcon className="icon" onClick={() => setCard(false)} />
        </div>
        <div className={classes.card}>
          <p>Shopping card</p>
        </div>
      </div>
    </div>
  );
}
