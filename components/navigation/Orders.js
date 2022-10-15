import { useState, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./ShoppingCart.module.scss";

export default function Orders() {
  const { toggleContainer, setToggleContainer } = useContext(StateContext);

  return (
    <div className={classes.background}>
      <div className={classes.menu}>
        <div className={classes.topBar}>
          <CloseIcon className="icon" onClick={() => setToggleContainer("")} />
        </div>

        <div>Orders</div>
      </div>
    </div>
  );
}
