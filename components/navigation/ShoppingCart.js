import { useState, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./ShoppingCart.module.scss";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { convertNumber } from "../../services/utility";
import Image from "next/image";
import brand from "../../assets/brand.svg";
import { updateUserApi, getProductApi, getMellatApi } from "../../services/api";
import graphic from "../../assets/shoppingCart.png";
import Router from "next/router";
import loadingImage from "../../assets/loader.png";
import secureLocalStorage from "react-secure-storage";

export default function ShoppingCart() {
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [post, setPost] = useState("");
  const [alert, setAlert] = useState("");
  const [checkout, setCheckout] = useState(false);
  const [payment, setPayment] = useState(false);
  const [checkoutClicked, setCheckoutClicked] = useState(false);
  const [availability, setAvailability] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone);
      setAddress(currentUser.address);
      setPost(currentUser.post);
    }
    secureLocalStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  }, [shoppingCart, currentUser]);

  useEffect(() => {
    const checkProductsData = async (product) => {
      let getProduct = await getProductApi(product["_id"]);
      if (
        !getProduct.activate ||
        getProduct.size[product.size].colors[product.color] === 0
      ) {
        product.message = "اتمام موجودی";
        setAvailability(!availability);
      } else {
        product.message = "";
        setAvailability(!availability);
      }
    };

    shoppingCart.forEach((product) => {
      checkProductsData(product);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shoppingCart, checkout]);

  // remove bloggerId from shopping cart on deleteCart
  const deleteBloggerId = (productId) => {
    let bloggerIdContainer = JSON.parse(
      secureLocalStorage.getItem("bloggerDelmareId")
    );
    if (bloggerIdContainer) {
      bloggerIdContainer = bloggerIdContainer.filter((item) => {
        return productId !== Object.keys(item)[0];
      });
    }
    secureLocalStorage.setItem(
      "bloggerDelmareId",
      JSON.stringify(bloggerIdContainer)
    );
  };

  const deleteCart = (index, productId) => {
    deleteBloggerId(productId);
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
    return total;
  };

  // clear shopping cart from duplicate selections based on id and color and size
  const continueShopping = () => {
    const uniqueShoppingCart = shoppingCart.filter((obj, index) => {
      return (
        index ===
        shoppingCart.findIndex(
          (o) =>
            obj["_id"] === o["_id"] &&
            obj.color === o.color &&
            obj.size === o.size
        )
      );
    });
    if (uniqueShoppingCart.length !== shoppingCart.length) {
      setShoppingCart(uniqueShoppingCart);
      setAlert("آیتم مشابه از سبد حذف شد");
      setTimeout(() => {
        setAlert("");
      }, 3000);
    }
    setCheckout(true);
  };

  const handlecheckout = async () => {
    if (userLogIn) {
      checkoutConfirmation();
    } else {
      setToggleContainer("");
      setMenu(true);
      setRegister(true);
    }
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  const checkoutConfirmation = async () => {
    if (!name || !phone || !address || !post) {
      setAlert("همه اطلاعات را وارد کنید");
    } else if (phone.length !== 11 || phone.slice(0, 2) !== "09") {
      setAlert("شماره موبایل اشتباه است");
    } else if (post.length !== 10) {
      setAlert("کد پستی صحیح ده رقمی وارد کنید");
    } else {
      setCheckoutClicked(true);
      await initializePayment();
    }
  };

  // update user info into db/state/localstorage
  const updateUser = async () => {
    const user = {
      _id: currentUser["_id"],
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      post: post.trim(),
    };

    let data = await updateUserApi(user);
    setCurrentUser(data);
    secureLocalStorage.setItem("currentUser", JSON.stringify(data));
  };

  const allAreTrue = (arr) => {
    return arr.every((element) => element === true);
  };

  // check if product exist
  const initializePayment = async () => {
    let itemCheck = [];
    shoppingCart.forEach(async (product) => {
      let getProduct = await getProductApi(product["_id"]);
      if (getProduct.size[product.size].colors[product.color] > 0) {
        itemCheck.push(true);
      } else {
        itemCheck.push(false);
      }
    });
    setTimeout(() => {
      if (allAreTrue(itemCheck)) {
        openPaymentPortal();
      } else {
        setAlert(`آیتم انتخاب شده موجود نمیباشد`);
        setTimeout(() => {
          setCheckoutClicked(false);
          setCheckout(false);
        }, 2000);
      }
    }, 1000);
  };

  // make a request to bank to get refId then redirect user to payment page
  const openPaymentPortal = async () => {
    let refId = null;
    setPayment(true);
    let pay = await getMellatApi(calculateTotal() + "0");
    refId = pay.RefId;

    if (pay.hasOwnProperty("error")) {
      setAlert(pay.error);
    } else {
      await updateUser();
      setCheckoutClicked(false);
      setTimeout(() => {
        setPayment(false);
      }, 5000);
      Router.push(
        `https://bpm.shaparak.ir/pgwchannel/startpay.mellat?RefId=${refId}`
      );
    }
  };

  return (
    <div className={classes.slider} style={{ height: window.innerHeight }}>
      {!payment ? (
        <div className={classes.menu}>
          <div className={classes.topBar}>
            <CloseIcon
              className="icon"
              onClick={() => setToggleContainer("")}
            />
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
                className="icon"
                sx={{ fontSize: 30 }}
                onClick={() => setCheckout(false)}
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
                      <div className={classes.imageContainer}>
                        <Image
                          className={classes.image}
                          src={cart.image}
                          blurDataURL={cart.image}
                          placeholder="blur"
                          width={110}
                          height={140}
                          objectFit="cover"
                          alt="image"
                          priority
                        />
                      </div>
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
                        <div className={classes.id}>
                          <p className={classes.code}>کد آیتم</p>
                          <p>{cart.delmareId}</p>
                        </div>
                        {cart.sale && (
                          <div className={classes.sale}>
                            <p>Save {cart.percentage}%</p>
                          </div>
                        )}
                        <div className={classes.message}>
                          <p>{cart.message}</p>
                        </div>
                      </div>
                    </div>
                    <div className={classes.close}>
                      <CloseIcon
                        className="icon icon-grey"
                        onClick={() => deleteCart(index, cart["_id"])}
                      />
                    </div>
                  </div>
                ))
                .reverse()}
              {shoppingCart.length === 0 && (
                <div className={classes.graphic}>
                  <Image
                    src={graphic}
                    alt="image"
                    objectFit="contain"
                    layout="fill"
                    priority
                  />
                  <a
                    href="https://www.vecteezy.com/free-png/shopping-cart"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Graphic by Vecteezy
                  </a>
                </div>
              )}
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
                  <p>جهت تکمیل خرید</p>
                  <p>وارد حساب کاربری شوید یا ثبت نام کنید</p>
                  <button
                    className={`mainButton ${classes.button}`}
                    disabled={shoppingCart.length === 0}
                    onClick={() => handlecheckout()}
                  >
                    ورود ​/ ثبت نام
                  </button>
                  <div className={classes.alert}>{alert}</div>
                </div>
              )}
            </div>
          )}
          <div className={classes.details}>
            <div className={classes.row}>
              <p className={classes.value}>{shoppingCart.length}</p>
              <p className={classes.title}>تعداد آیتم</p>
            </div>
            <div className={classes.row}>
              <p className={classes.value}>
                {convertNumber(calculateTotal())} T
              </p>
              <p className={classes.title}>جمع سبد خرید</p>
            </div>
            <div className={classes.row}>
              {calculateTotal() >= 1000000 ? (
                <p className={classes.value}>رایگان</p>
              ) : (
                <p className={classes.value}>
                  {shoppingCart.length > 0 ? "پرداخت موقع تحویل" : ""}
                </p>
              )}
              <p className={classes.title}>هزینه ارسال</p>
            </div>
            {!checkout ? (
              <button
                className={`mainButton ${classes.button}`}
                disabled={shoppingCart.length === 0}
                onClick={() => continueShopping()}
              >
                {shoppingCart.length > 0 ? "ادامه" : "سبد خرید خالی"}
              </button>
            ) : (
              <button
                className={`mainButton ${classes.button}`}
                disabled={checkoutClicked}
                onClick={() => handlecheckout()}
              >
                {userLogIn ? "درگاه پرداخت بانکی" : "ورود ​/ ثبت نام"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className={classes.payment} style={{ height: window.innerHeight }}>
          <p>در حال انتقال و بارگذاری</p>
          <Image width={50} height={50} src={loadingImage} alt="isLoading" />
        </div>
      )}
    </div>
  );
}
