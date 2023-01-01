import { useState, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCart from "./ShoppingCart.module.scss";
import classes from "./Account.module.scss";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Router from "next/router";
import { updateUserApi } from "../../services/api";

export default function Account() {
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { currentUser, seCurrentUser } = useContext(StateContext);

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [post, setPost] = useState(currentUser.post);
  const [alert, setAlert] = useState("");

  const logOut = () => {
    setUserLogin(false);
    setToggleContainer("");
    localStorage.removeItem("currentUser");
    seCurrentUser(null);
    Router.push("/");
  };

  const handleUpdate = async () => {
    if (!name || !phone || !address || !post) {
      setAlert("همه اطلاعات را وارد کنید");
    } else if (phone.length !== 11 || phone.slice(0, 2) !== "09") {
      setAlert("شماره موبایل اشتباه است");
    } else if (post.length !== 10) {
      setAlert("کد پستی صحیح ده رقمی وارد کنید");
    } else {
      await updateUser();
    }
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  // update user info into db/state/localstorage
  const updateUser = async () => {
    const user = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      post: post.trim(),
      _id: currentUser["_id"],
    };
    let data = await updateUserApi(user);
    seCurrentUser(data);
    localStorage.setItem("currentUser", JSON.stringify(data));
    setAlert("اطلاعات با موفقیت ذخیره شد");
    setTimeout(() => {
      setToggleContainer("");
      setMenu(true);
    }, 1000);
  };

  return (
    <div className={ShoppingCart.slider} style={{ height: window.innerHeight }}>
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

        <div className="wish-list">
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
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                autoComplete="off"
                dir="rtl"
                disabled={true}
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
            <button className="mainButton" onClick={() => handleUpdate()}>
              ذخیره
            </button>
            <div className={classes.logout} onClick={() => logOut()}>
              <p>خروج از حساب</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
