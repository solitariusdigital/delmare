import { useState, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./ShoppingCart.module.scss";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { convertNumber } from "../../services/utility";
import Image from "next/image";
import brand from "../../assets/brand.svg";

// import item from "../../assets/mainItem.jpg";
import item from "../../assets/two.jpg";

export default function ShoppingCart() {
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [post, setPost] = useState("");

  const [alert, setAlert] = useState("");
  const [checkOut, setCheckout] = useState(false);

  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  }, [shoppingCart]);

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

  const handleCheckOut = () => {
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
    <div className={classes.slider}>
      <div className={classes.menu}>
        <div className={classes.topBar}>
          <CloseIcon className="icon" onClick={() => setToggleContainer("")} />
          {!checkOut && (
            <div className={classes.title}>
              <p className={classes.count}>{shoppingCart.length}</p>
              <p>سبد خرید</p>
            </div>
          )}
          {checkOut && (
            <div className={classes.brand}>
              <Image src={brand} alt="brand" />
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
          // items list
          <div className={classes.items}>
            {shoppingCart
              .map((cart, index) => (
                <div key={index} className={classes.item}>
                  <div className={classes.cart}>
                    <Image
                      className={classes.image}
                      width={110}
                      height={140}
                      src={item}
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
                          style={{ backgroundColor: cart.color }}
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
        ) : (
          // checkout from
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
