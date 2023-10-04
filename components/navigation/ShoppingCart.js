import { useState, useContext, useEffect, Fragment } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./ShoppingCart.module.scss";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { convertNumber, calculatePercentage } from "../../services/utility";
import Image from "next/image";
import brand from "../../assets/brand.svg";
import {
  getProductApi,
  getCareApi,
  getMellatApi,
  getUserApi,
} from "../../services/api";
import graphic from "../../assets/shoppingCart.png";
import Router from "next/router";
import loadingImage from "../../assets/loader.png";
import secureLocalStorage from "react-secure-storage";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

export default function ShoppingCart() {
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);
  const [loyaltyPoint, setLoyaltyPoint] = useState(0);

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
      setLoyaltyPoint(currentUser.loyalty);
      const fetchData = async () => {
        try {
          const user = await getUserApi(currentUser["_id"]);
          setName(user.name);
          setPhone(user.phone);
          setAddress(user.address);
          setPost(user.post);
          secureLocalStorage.setItem("currentUser", JSON.stringify(user));
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
    secureLocalStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  }, [currentUser, shoppingCart]);

  useEffect(() => {
    const checkProductsData = async (product) => {
      try {
        const getProduct =
          (await getProductApi(product["_id"])) ||
          (await getCareApi(product["_id"]));
        const isActivated = getProduct.activate;
        let count = null;
        switch (getProduct.group) {
          case "clothing":
            count = getProduct.size[product.size].colors[product.color];
            break;
          case "care":
            count = getProduct.count;
            break;
        }
        const message = isActivated && count > 0 ? "" : "اتمام موجودی";
        product.price = getProduct.sale
          ? getProduct.discount
          : getProduct.price;
        product.message = message;
        setAvailability(!availability);
      } catch (error) {
        console.error(error);
      }
    };
    const checkAllProductsData = async () => {
      try {
        await Promise.all(
          shoppingCart.map((product) => checkProductsData(product))
        );
      } catch (error) {
        console.error(error);
      }
    };
    checkAllProductsData();
  }, [shoppingCart, checkout, availability]);

  // remove bloggerId from shopping cart on deleteCart
  const deleteBloggerId = (productId) => {
    let bloggerIdContainer = JSON.parse(
      secureLocalStorage.getItem("bloggerDelmareId")
    );
    if (bloggerIdContainer) {
      bloggerIdContainer = bloggerIdContainer.filter(
        (item) => productId !== Object.keys(item)[0]
      );
      secureLocalStorage.setItem(
        "bloggerDelmareId",
        JSON.stringify(bloggerIdContainer)
      );
    }
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
    const total = shoppingCart.reduce(
      (partialSum, cart) => partialSum + cart.price,
      0
    );
    return total;
  };

  const calculateLoyaltyDiscount = (loyaltyPoint) => {
    let max = 200000;
    let useLoyaltyPoint = loyaltyPoint <= max ? loyaltyPoint : max;
    return useLoyaltyPoint;
  };

  // clear shopping cart from duplicate selections based on id and color and size
  const continueShopping = () => {
    secureLocalStorage.setItem(
      "useLoyaltyPoint",
      JSON.stringify(calculateLoyaltyDiscount(loyaltyPoint))
    );
    const uniqueShoppingCart = shoppingCart.filter(
      (obj, index) =>
        index ===
        shoppingCart.findIndex(
          (item) =>
            obj["_id"] === item["_id"] &&
            obj.color === item.color &&
            obj.size === item.size
        )
    );
    if (uniqueShoppingCart.length !== shoppingCart.length) {
      setShoppingCart(uniqueShoppingCart);
      setAlert("آیتم مشابه از سبد حذف شد");
      setTimeout(() => {
        setAlert("");
      }, 3000);
    }
    setCheckout(true);
  };

  const handleCheckout = async () => {
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

  // check if product count exist and is available
  const allAreTrue = (array) => array.every((item) => item);
  const initializePayment = async () => {
    try {
      const itemCheck = await Promise.all(
        shoppingCart.map(async (product) => {
          const getProduct =
            (await getProductApi(product["_id"])) ||
            (await getCareApi(product["_id"]));
          switch (getProduct.group) {
            case "clothing":
              return (
                getProduct.size[product.size].colors[product.color] > 0 &&
                getProduct.activate
              );
            case "care":
              return getProduct.count > 0 && getProduct.activate;
          }
        })
      );
      if (allAreTrue(itemCheck)) {
        openPaymentPortal();
      } else {
        setAlert(`آیتم انتخاب شده موجود نمیباشد`);
        setTimeout(() => {
          setCheckoutClicked(false);
          setCheckout(false);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkSaleItemsClearForCredit = () => {
    return shoppingCart.every((item) => !item.sale);
  };

  // make a request to bank to get refId then direct user to payment page
  const openPaymentPortal = async () => {
    try {
      setPayment(true);
      let totalAmount = null;
      if (checkSaleItemsClearForCredit()) {
        totalAmount =
          calculateTotal() - calculateLoyaltyDiscount(loyaltyPoint) + "0";
      } else {
        totalAmount = calculateTotal() + "0";
      }
      const pay = await getMellatApi(totalAmount);
      const refId = pay.RefId;
      if (pay.hasOwnProperty("error")) {
        setAlert(pay.error);
      } else {
        setCheckoutClicked(false);
        setTimeout(() => {
          setPayment(false);
        }, 5000);
        const paymentUrl = `https://bpm.shaparak.ir/pgwchannel/startpay.mellat?RefId=${refId}`;
        Router.push(paymentUrl);
      }
    } catch (error) {
      console.error(error);
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
              <Fragment>
                <div className={classes.row}>
                  <MonetizationOnIcon className="gold-icon" />
                  <p>{convertNumber(loyaltyPoint)} T</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.count}>{shoppingCart.length}</p>
                  <p>آیتم</p>
                </div>
              </Fragment>
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
                          {cart.group === "clothing" && (
                            <div
                              className={classes.color}
                              style={{ backgroundColor: `#${cart.color}` }}
                            ></div>
                          )}
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
                        sx={{ fontSize: 20 }}
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
            // checkout info
            <div>
              {userLogIn ? (
                <div className={classes.register}>
                  <div className={classes.info}>
                    <div className={classes.bar}>
                      <p className={classes.label}>نام و نام خانوادگی</p>
                      <p>{name}</p>
                    </div>
                  </div>
                  <div className={classes.info}>
                    <div className={classes.bar}>
                      <p className={classes.label}>موبایل</p>
                      <p>{phone}</p>
                    </div>
                  </div>
                  <div className={classes.info}>
                    <div className={classes.bar}>
                      <p className={classes.label}>آدرس تحویل</p>
                      <p>{address}</p>
                    </div>
                  </div>
                  <div className={classes.info}>
                    <div className={classes.bar}>
                      <p className={classes.label}>کد پستی</p>
                      <p>{post}</p>
                    </div>
                  </div>
                  <button
                    className={`mainButton ${classes.button}`}
                    onClick={() => setToggleContainer("account")}
                  >
                    ویرایش
                  </button>
                  <div className={classes.alert}>{alert}</div>
                </div>
              ) : (
                <div className={classes.register}>
                  <p>جهت تکمیل خرید</p>
                  <p>وارد حساب کاربری شوید یا ثبت نام کنید</p>
                  <button
                    className={`mainButton ${classes.button}`}
                    disabled={shoppingCart.length === 0}
                    onClick={() => handleCheckout()}
                  >
                    ورود ​/ ثبت نام
                  </button>
                  <div className={classes.alert}>{alert}</div>
                </div>
              )}
            </div>
          )}
          <div className={classes.details}>
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
                onClick={() => handleCheckout()}
              >
                {userLogIn ? "درگاه پرداخت بانکی" : "ورود ​/ ثبت نام"}
              </button>
            )}
            <div className={classes.row}>
              <p className={classes.value}>{shoppingCart.length}</p>
              <p className={classes.title}>تعداد آیتم</p>
            </div>
            {loyaltyPoint !== 0 && checkSaleItemsClearForCredit() && (
              <div className={classes.row}>
                <p className={classes.value}>
                  {convertNumber(calculateLoyaltyDiscount(loyaltyPoint))} T
                </p>
                <p className={classes.title}>اعتبار قابل استفاده</p>
              </div>
            )}
            <div className={classes.row}>
              {loyaltyPoint !== 0 &&
              shoppingCart.length > 0 &&
              checkSaleItemsClearForCredit() &&
              calculateLoyaltyDiscount(loyaltyPoint) <= 200000 ? (
                <div className={classes.discountRow}>
                  <p className={classes.value}>
                    {convertNumber(
                      calculateTotal() - calculateLoyaltyDiscount(loyaltyPoint)
                    )}{" "}
                    T
                  </p>
                  <p className={classes.price}>
                    {convertNumber(calculateTotal())} T
                  </p>
                </div>
              ) : (
                <p className={classes.value}>
                  {convertNumber(calculateTotal())} T
                </p>
              )}
              <div className={classes.discountRow}>
                <p className={classes.title}>مبلغ پرداخت</p>
              </div>
            </div>
            <div className={classes.row}>
              {calculateTotal() - calculateLoyaltyDiscount(loyaltyPoint) >=
              2000000 ? (
                <p className={classes.value}>رایگان</p>
              ) : (
                <p className={classes.value}>
                  {shoppingCart.length > 0 ? "پرداخت موقع تحویل" : ""}
                </p>
              )}
              <p className={classes.title}>هزینه ارسال</p>
            </div>
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
