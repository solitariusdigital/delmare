import { useContext } from "react";
import { StateContext } from "../../context/stateContext";
import ShoppingCart from "./ShoppingCart.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddHomeScreen from "./AddHomeScreen";

export default function Download() {
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);

  return (
    <div className={ShoppingCart.slider} style={{ height: window.innerHeight }}>
      <div className={ShoppingCart.menu}>
        <div className={ShoppingCart.topBar}>
          <CloseIcon className="icon" onClick={() => setToggleContainer("")} />
          <div className={ShoppingCart.title}>
            <p>راهنمای نصب</p>
          </div>
          <div className="shoppingcart-icon">
            <ShoppingCartIcon
              className="icon"
              onClick={() => setToggleContainer("cart")}
            />
            <p>{shoppingCart.length === 0 ? "" : shoppingCart.length}</p>
          </div>
        </div>
        <AddHomeScreen />
      </div>
    </div>
  );
}
