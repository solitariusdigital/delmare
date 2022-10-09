import { useState, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./ShoppingCart.module.scss";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { convertNumber } from "../services/utility";

export default function ShoppingCart() {
  const { card, setCard } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);

  const [checkOut, setCheckout] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [post, setPost] = useState("");
  const [alert, setAlert] = useState("");

  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  }, [shoppingCart]);

  const deleteCard = (index) => {
    setShoppingCart(
      shoppingCart.filter((card, i) => {
        return i !== index;
      })
    );
  };

  const calculateTotal = () => {
    let prices = [];
    shoppingCart.map((card) => {
      prices.push(card.price);
    });
    const total = prices.reduce((partialSum, a) => partialSum + a, 0);
    return convertNumber(total);
  };

  const handleCheckOut = () => {
    if (name === "" || number === "" || address === "" || post === "") {
      setAlert("همه اطلاعات را وارد کنید");
      setTimeout(() => {
        setAlert("");
      }, 3000);
      return;
    }
    console.log(name, number, address, post);
  };

  return (
    <div className={classes.background}>
      <div className={classes.menu}>
        <div className={classes.topBar}>
          <CloseIcon className="icon" onClick={() => setCard(false)} />
          {!checkOut && (
            <div className={classes.title}>
              <p className={classes.count}>{shoppingCart.length}</p>
              <p>سبد خرید</p>
            </div>
          )}
          {checkOut && (
            <ArrowBackIosNewIcon
              className={classes.back}
              sx={{ color: "#000000", fontSize: 30 }}
              onClick={() => {
                setCheckout(false);
              }}
            />
          )}
        </div>

        {!checkOut ? (
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
                    <p>{convertNumber(card.price)} T</p>
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
        ) : (
          <div className={classes.form}>
            <p className={classes.title}>با دلماره متفاوت دیده شوید</p>
            <div className={classes.input}>
              <p className={classes.label}>نام و نام خانوادگی</p>
              <input
                type="text"
                id="name"
                name="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoComplete="off"
                required
                dir="rtl"
              />
            </div>
            <div className={classes.input}>
              <p className={classes.label}>شماره موبایل</p>
              <input
                type="number"
                id="number"
                name="number"
                onChange={(e) => setNumber(e.target.value)}
                value={number}
                autoComplete="off"
                required
                dir="rtl"
              />
            </div>
            <div className={classes.input}>
              <p className={classes.label}>آدرس تحویل</p>
              <textarea
                type="text"
                id="address"
                name="address"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                autoComplete="off"
                required
                dir="rtl"
              ></textarea>
            </div>
            <div className={classes.input}>
              <p className={classes.label}>کد پستی</p>
              <input
                type="number"
                id="post"
                name="post"
                onChange={(e) => setPost(e.target.value)}
                value={post}
                autoComplete="off"
                required
                dir="rtl"
              />
            </div>
            <div className={classes.alert}>{alert}</div>
          </div>
        )}

        <div className={classes.details}>
          <div className={classes.detail}>
            <p>{shoppingCart.length}</p>
            <p>تعداد آیتم ها</p>
          </div>
          <div className={classes.detail}>
            <p>{calculateTotal()} T</p>
            <p>جمع سبد خرید</p>
          </div>

          {!checkOut ? (
            <button
              className={`mainButton ${classes.button}`}
              disabled={shoppingCart.length === 0}
              onClick={() => setCheckout(true)}
            >
              {shoppingCart.length > 0 ? "ادامه" : "سبد خرید خالی"}
            </button>
          ) : (
            <button
              className={`mainButton ${classes.button}`}
              disabled={shoppingCart.length === 0}
              onClick={() => handleCheckOut()}
            >
              پرداخت
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
