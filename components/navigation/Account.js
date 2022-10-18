import { useState, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCart from "./ShoppingCart.module.scss";
import classes from "./Account.module.scss";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Account() {
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);

  const [name, setName] = useState("شاهین عقابی");
  const [phone, setPhone] = useState("09121089341");
  const [address, setAddress] = useState(
    "تهران آزادی خ انقلاب کوچه رهایی پ ۶۹ زنگ ۵۷"
  );
  const [post, setPost] = useState("123456789");
  const [alert, setAlert] = useState("");

  const saveAccount = () => {
    if (name === "" || phone === "" || address === "" || post === "") {
      setAlert("همه اطلاعات را وارد کنید");
    } else if (phone.length !== 11 || phone.slice(0, 2) !== "09") {
      setAlert("شماره موبایل اشتباه است");
    } else {
      console.log(name, phone, address, post);
    }
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  return (
    <div className={ShoppingCart.slider}>
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

        <div className="slide-menu">
          <div className={classes.card}>
            <div className={classes.input}>
              <div className={classes.bar}>
                <p className={classes.label}>
                  نام و نام خانوادگی
                  <span>*</span>
                </p>
                <CloseIcon
                  className="icon"
                  onClick={() => setName("")}
                  sx={{ fontSize: 16 }}
                />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoComplete="off"
                dir="rtl"
              />
            </div>
            <div className={classes.input}>
              <div className={classes.bar}>
                <p className={classes.label}>
                  موبایل
                  <span>*</span>
                </p>
                <CloseIcon
                  className="icon"
                  onClick={() => setPhone("")}
                  sx={{ fontSize: 16 }}
                />
              </div>

              <input
                type="tel"
                id="phone"
                name="phone"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                autoComplete="off"
                dir="rtl"
              />
            </div>
            <div className={classes.input}>
              <div className={classes.bar}>
                <p className={classes.label}>
                  آدرس تحویل
                  <span>*</span>
                </p>
                <CloseIcon
                  className="icon"
                  onClick={() => setAddress("")}
                  sx={{ fontSize: 16 }}
                />
              </div>
              <textarea
                type="text"
                id="address"
                name="address"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                autoComplete="off"
                dir="rtl"
              ></textarea>
            </div>
            <div className={classes.input}>
              <div className={classes.bar}>
                <p className={classes.label}>
                  کد پستی
                  <span>*</span>
                </p>
                <CloseIcon
                  className="icon"
                  onClick={() => setPost("")}
                  sx={{ fontSize: 16 }}
                />
              </div>
              <input
                type="tel"
                id="post"
                name="post"
                onChange={(e) => setPost(e.target.value)}
                value={post}
                autoComplete="off"
                dir="rtl"
              />
            </div>
            <div className={classes.alert}>{alert}</div>
            <button className="mainButton" onClick={() => saveAccount()}>
              ذخیره
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
