import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCart from "./ShoppingCart.module.scss";
import classes from "./Account.module.scss";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Router from "next/router";
import {
  updateUserApi,
  getBloggersApi,
  getInvoiceApi,
} from "../../services/api";
import secureLocalStorage from "react-secure-storage";
import Person4Icon from "@mui/icons-material/Person4";
import SellIcon from "@mui/icons-material/Sell";
import classesPage from "../../pages/page.module.scss";
import Image from "next/image";
import {
  convertNumber,
  convertDate,
  calculatePercentage,
} from "../../services/utility";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StarIcon from "@mui/icons-material/Star";

export default function Account() {
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [post, setPost] = useState(currentUser.post);
  const [alert, setAlert] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [monthDay, setMonthDay] = useState("");
  const [controlNavigation, setControlNavigation] = useState(false);
  const [blogger, setBlogger] = useState({});
  const [invoices, setInvoices] = useState([]);

  const days = [...Array(31).keys()].map((i) => i + 1);
  const months = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser.permission === "blogger") {
        const bloggersData = await getBloggersApi();
        const invoicesData = await getInvoiceApi();
        setBlogger(
          bloggersData.filter(
            (blogger) => blogger.userId === currentUser["_id"]
          )[0]
        );
        setInvoices(
          invoicesData.filter(
            (invoice) => invoice.bloggerDelmareId === blogger.delmareId
          )
        );
      }
    };
    fetchData().catch(console.error);
  }, [blogger.delmareId, currentUser, currentUser.permission]);

  const calculateTotalSale = () => {
    let price = [];
    invoices.forEach((invoice) => {
      price.push(calculatePercentage(15, invoice.price));
    });
    return price.reduce((partialSum, a) => partialSum + a, 0);
  };

  const logOut = () => {
    setUserLogin(false);
    setToggleContainer("");
    secureLocalStorage.removeItem("currentUser");
    setCurrentUser(null);
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
      _id: currentUser["_id"],
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      post: post.trim(),
      birthday:
        currentUser.birthday === ""
          ? `${monthDay} ${birthDay}`
          : currentUser.birthday,
    };
    let data = await updateUserApi(user);
    setCurrentUser(data);
    secureLocalStorage.setItem("currentUser", JSON.stringify(data));
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
            {currentUser.permission === "blogger" ? (
              <p>حساب بلاگر</p>
            ) : (
              <p>حساب من</p>
            )}
          </div>
          <div className="shoppingcart-icon">
            <ShoppingCartIcon
              className="icon"
              onClick={() => setToggleContainer("cart")}
            />
            <p>{shoppingCart.length === 0 ? "" : shoppingCart.length}</p>
          </div>
        </div>
        <div className="container-list">
          {currentUser.permission === "blogger" && (
            <div className={classes.navigation}>
              <p
                className={!controlNavigation ? classes.nav : classes.navActive}
                onClick={() => setControlNavigation(true)}
              >
                گزارشات
              </p>
              <p
                className={controlNavigation ? classes.nav : classes.navActive}
                onClick={() => setControlNavigation(false)}
              >
                مشخصات
              </p>
            </div>
          )}
          {!controlNavigation ? (
            <div className={classes.infoCard}>
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
              <div className={classes.row}>
                <p className={classes.label}>ثبت روز تولد برای دریافت هدیه</p>
                <p>{currentUser.birthday}</p>
              </div>
              {currentUser.birthday === "" && (
                <Fragment>
                  <div className={classes.input}>
                    <select
                      defaultValue={"default"}
                      onChange={(e) => setMonthDay(e.target.value)}
                    >
                      <option value="default" disabled>
                        ماه تولد
                      </option>
                      {months.map((month, index) => {
                        return (
                          <option key={index} value={month}>
                            {month}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className={classes.input}>
                    <select
                      defaultValue={"default"}
                      onChange={(e) => setBirthDay(e.target.value)}
                    >
                      <option value="default" disabled>
                        روز تولد
                      </option>
                      {days.map((day, index) => {
                        return (
                          <option key={index} value={day}>
                            {day}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </Fragment>
              )}
              <div className={classes.alert}>{alert}</div>
              <button className="mainButton" onClick={() => handleUpdate()}>
                ذخیره
              </button>
              <div className={classes.logout} onClick={() => logOut()}>
                <p>خروج از حساب</p>
              </div>
            </div>
          ) : (
            <div className={classes.invoiceContainer}>
              <div className={classes.invoiceData}>
                <div className={classes.social}>
                  <p>{invoices.length}</p>
                  <div className={classes.row}>
                    <p>فروش</p>
                    <SellIcon sx={{ fontSize: 22 }} />
                  </div>
                </div>
                <div className={classes.social}>
                  <p>{convertNumber(calculateTotalSale())} T</p>
                  <div className={classes.row}>
                    <p>درآمد</p>
                    <MonetizationOnIcon sx={{ fontSize: 22 }} />
                  </div>
                </div>
              </div>
              <div className={classes.invoiceData}>
                <div className={classes.social}>
                  <p>{blogger.followers.length}</p>
                  <div className={classes.row}>
                    <p>فالورز</p>
                    <Person4Icon sx={{ fontSize: 22 }} />
                  </div>
                </div>
                <div className={classes.social}>
                  <p>{currentUser.favourites.length}</p>
                  <div className={classes.row}>
                    <p>برگزیده</p>
                    <StarIcon sx={{ fontSize: 22 }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {controlNavigation && (
            <div className={classes.invoiceContainer}>
              {invoices.map((invoice, index) => (
                <div key={index} className={classesPage.infoCard}>
                  <div className={classesPage.row}>
                    <div>
                      <div className={classesPage.subRow}>
                        <p className={classesPage.title}>پورسانت</p>
                        <p>
                          {convertNumber(
                            calculatePercentage(15, invoice.price)
                          )}{" "}
                          T
                        </p>
                        <p>
                          {convertNumber(calculateTotalSale(15, invoice.price))}{" "}
                          T
                        </p>
                      </div>
                      <div className={classesPage.subRow}>
                        <p className={classesPage.title}>قیمت فروش</p>
                        <p>{convertNumber(invoice.price)} T</p>
                      </div>
                      <div className={classesPage.subRow}>
                        <p className={classesPage.title}>آیتم</p>
                        <p>{invoice.title}</p>
                      </div>
                      <div className={classesPage.subRow}>
                        <p className={classesPage.title}>کد آیتم</p>
                        <p>{invoice.delmareId}</p>
                      </div>
                      <div className={classesPage.subRow}>
                        <p className={classesPage.title}>تاریخ فروش</p>
                        <p suppressHydrationWarning>
                          {convertDate(invoice.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Image
                      className={classesPage.image}
                      src={invoice.image}
                      objectFit="cover"
                      width={100}
                      height={140}
                      alt="image"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
