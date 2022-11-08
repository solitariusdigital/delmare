import { useState, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./ShoppingCart.module.scss";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { convertNumber } from "../../services/utility";
import Image from "next/image";
import brand from "../../assets/brand.svg";

// import item from "../../assets/mainItem.jpg";
import { updateUserApi } from "../../services/user";

export default function ShoppingCart() {
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { currentUser, seCurrentUser } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [post, setPost] = useState("");
  const [alert, setAlert] = useState("");
  const [checkout, setCheckout] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone);
      setAddress(currentUser.address);
      setPost(currentUser.post);
    }
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  }, [shoppingCart, currentUser]);

  const deletecart = (index) => {
    setShoppingCart(
      shoppingCart.filter((cart, i) => {
        return i !== index;
      })
    );
  };

  const calculateTotal = () => {
    let prices = [];
    shoppingCart.map((cart) => {
      prices.push(cart.price);
    });
    const total = prices.reduce((partialSum, a) => partialSum + a, 0);
    return convertNumber(total);
  };

  const checkoutConfirmation = async () => {
    if (!name || !phone || !address || !post) {
      setAlert("همه اطلاعات را وارد کنید");
    } else if (phone.length !== 11 || phone.slice(0, 2) !== "09") {
      setAlert("شماره موبایل اشتباه است");
    } else if (post.length !== 10) {
      setAlert("کد پستی صحیح ده رقمی وارد کنید");
    } else {
      await updateUser();
    }
  };

  const handlecheckout = async () => {
    if (userLogIn) {
      checkoutConfirmation();
    } else {
      setToggleContainer("");
      setMenu(true);
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
      id: currentUser["_id"],
    };
    let data = await updateUserApi(user);
    seCurrentUser(data);
    localStorage.setItem("currentUser", JSON.stringify(data));
    setAlert("تا لحظاتی دیگر وارد درگاه پرداخت میشوید");
  };

  return (
    <div className={classes.slider}>
      <div className={classes.menu}>
        <div className={classes.topBar}>
          <CloseIcon className="icon" onClick={() => setToggleContainer("")} />
          {!checkout && (
            <div className={classes.title}>
              <p className={classes.count}>{shoppingCart.length}</p>
              <p>سبد خرید</p>
            </div>
          )}
          {checkout && (
            <div className={classes.brand}>
              <Image src={brand} alt="brand" />
            </div>
          )}
          {checkout && (
            <ArrowBackIosNewIcon
              className={classes.back}
              sx={{ color: "#1b1b1b", fontSize: 30 }}
              onClick={() => {
                setCheckout(false);
              }}
            />
          )}
        </div>

        {!checkout && (
          // cart list
          <div className={classes.items}>
            {shoppingCart
              .map((cart, index) => (
                <div key={index} className={classes.item}>
                  <div className={classes.cart}>
                    <Image
                      className={classes.image}
                      width={110}
                      height={140}
                      objectFit="cover"
                      src={cart.image}
                      alt="image"
                    />
                    <div className={classes.information}>
                      <div className={classes.title}>
                        <p>{convertNumber(cart.price)} T</p>
                        <p>{cart.title}</p>
                      </div>
                      <div className={classes.options}>
                        <div className={classes.size}>{cart.size}</div>
                        <div
                          className={classes.color}
                          style={{ backgroundColor: `#${cart.color}` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className={classes.close}>
                    <CloseIcon
                      className="icon icon-grey"
                      onClick={() => deletecart(index)}
                    />
                  </div>
                </div>
              ))
              .reverse()}
          </div>
        )}

        {checkout && (
          // checkout from
          <div>
            {userLogIn ? (
              <div className={classes.form}>
                <p className={classes.title}>با دلماره متفاوت دیده شوید</p>
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
              </div>
            ) : (
              <div className={classes.register}>
                <p>جهت تکمیل کردن خرید</p>
                <p>وارد حساب کاربری شوید یا ثبت نام کنید</p>
                <button
                  className={`mainButton ${classes.button}`}
                  disabled={shoppingCart.length === 0}
                  onClick={() => handlecheckout()}
                >
                  ورود ​/ ثبت نام
                </button>
              </div>
            )}
          </div>
        )}

        <div className={classes.details}>
          <div className={classes.detail}>
            <p className={classes.value}>{shoppingCart.length}</p>
            <p>تعداد آیتم ها</p>
          </div>
          <div className={classes.detail}>
            <p className={classes.value}>{calculateTotal()} T</p>
            <p>جمع سبد خرید</p>
          </div>

          {!checkout ? (
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
              onClick={() => handlecheckout()}
            >
              {userLogIn ? "پرداخت" : "ورود ​/ ثبت نام"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
