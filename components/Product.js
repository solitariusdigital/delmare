import { useState, useEffect, useContext, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import classes from "./Product.module.scss";
import Image from "next/image";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FiberManualRecordOutlined from "@mui/icons-material/FiberManualRecordOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { convertNumber } from "../services/utility";
import { updateUserApi } from "../services/api";

function Product({ favourite }) {
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { displayProduct, setDisplayProduct } = useContext(StateContext);
  const { selectedProduct, setSelectedProduct } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const { currentUser, seCurrentUser } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { menue, setMenu } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);

  const [alert, setAlert] = useState("");
  const [displayDetails, setDisplayDetails] = useState(true);

  // item image variables
  const [mainItem, setMainItem] = useState(selectedProduct.images.main);
  const [itemOne, setItemOne] = useState(selectedProduct.images.one);
  const [itemTwo, setItemTwo] = useState(selectedProduct.images.two);
  const [itemThree, setItemThree] = useState(selectedProduct.images.three);
  // to control image display
  const [itemOneDisplay, setitemOneDisplay] = useState(false);
  const [itemTwoDisplay, setitemTwoDisplay] = useState(false);
  const [itemThreeDisplay, setitemThreeDisplay] = useState(false);
  // to control extra information
  const [sizeGuide, setSizeGuide] = useState(false);
  const [shipmentMethod, setShipmentMethod] = useState(false);
  const [returnPolicy, setReturnPolicy] = useState(false);
  // product options
  const [colors, setColors] = useState([]);
  const [productSizes, setProductSizes] = useState(selectedProduct.size);
  // customer selections
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [like, setLike] = useState(favourite);

  useEffect(() => {
    setBar(false);
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));

    Object.keys(productSizes).forEach((size) => {
      productSizes[size]["type"] = size;
      productSizes[size]["selected"] = false;
    });
  }, [setBar, shoppingCart, productSizes]);

  const toggleImages = (type) => {
    switch (type) {
      case "one":
        setItemTwo(selectedProduct.images.two);
        setItemThree(selectedProduct.images.three);
        setitemTwoDisplay(false);
        setitemThreeDisplay(false);
        if (itemOneDisplay) {
          setItemOne(selectedProduct.images.one);
          setMainItem(selectedProduct.images.main);
          setitemOneDisplay(false);
        } else {
          setItemOne(selectedProduct.images.main);
          setMainItem(selectedProduct.images.one);
          setitemOneDisplay(true);
        }
        break;
      case "two":
        setItemOne(selectedProduct.images.one);
        setItemThree(selectedProduct.images.three);
        setitemOneDisplay(false);
        setitemThreeDisplay(false);
        if (itemTwoDisplay) {
          setItemTwo(selectedProduct.images.two);
          setMainItem(selectedProduct.images.main);
          setitemTwoDisplay(false);
        } else {
          setItemTwo(selectedProduct.images.main);
          setMainItem(selectedProduct.images.two);
          setitemTwoDisplay(true);
        }
        break;
      case "three":
        setItemOne(selectedProduct.images.one);
        setItemTwo(selectedProduct.images.two);
        setitemOneDisplay(false);
        setitemTwoDisplay(false);
        if (itemThreeDisplay) {
          setItemThree(selectedProduct.images.three);
          setMainItem(selectedProduct.images.main);
          setitemThreeDisplay(false);
        } else {
          setItemThree(selectedProduct.images.main);
          setMainItem(selectedProduct.images.three);
          setitemThreeDisplay(true);
        }
        break;
    }
  };

  const back = () => {
    setDisplayProduct(false);
    setBar(true);
    setSelectedColor("");
    setSelectedSize("");
    clearDetails();
    colors.length = 0;
  };

  const clearDetails = () => {
    colors.map((color, index) => {
      color.selected = false;
    });
    Object.keys(productSizes).forEach((size, index) => {
      productSizes[size].selected = false;
    });
  };

  const selectDetails = (detail, type, i) => {
    setAlert("");

    switch (detail) {
      case "color":
        setSelectedColor(type);
        colors.map((color, index) => {
          if (i === index) {
            color.selected = true;
          } else {
            color.selected = false;
          }
        });
        break;
      case "size":
        colors.length = 0;
        setSelectedColor("");
        setSelectedSize(type);
        Object.keys(productSizes).forEach((size, index) => {
          if (i === index) {
            productSizes[size].selected = true;
            for (const [color, count] of Object.entries(
              productSizes[size].colors
            )) {
              colors.push({
                type: color,
                count: count,
                selected: false,
              });
            }
          } else {
            productSizes[size].selected = false;
          }
        });
    }
  };

  const addToCart = () => {
    if (selectedColor === "" || selectedSize === "") {
      setAlert("رنگ یا اندازه را انتخاب کنید");
    } else {
      setAlert("آیتم به سبد خرید اضافه شد");
      setShoppingCart([
        ...shoppingCart,
        {
          _id: selectedProduct["_id"],
          delmareId: selectedProduct.delmareId,
          title: selectedProduct.title,
          size: selectedSize,
          color: selectedColor,
          price: selectedProduct.sale
            ? selectedProduct.discount
            : selectedProduct.price,
          image: selectedProduct.images.main,
          percentage: selectedProduct.percentage,
          sale: selectedProduct.sale,
        },
      ]);
      clearDetails();
      setSelectedColor("");
      setSelectedSize("");
    }
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  const favourProduct = async (product) => {
    if (!userLogIn) {
      setMenu(true);
      setRegister(true);
      return;
    }

    if (currentUser) {
      setLike(!like);
      if (currentUser.favourites.includes(product["_id"])) {
        currentUser.favourites.splice(
          currentUser.favourites.indexOf(product["_id"]),
          1
        );
      } else {
        currentUser.favourites.unshift(product["_id"]);
      }
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      await updateUserApi(currentUser);
    }
  };
  const checFavourites = (product) => {
    if (currentUser) {
      return currentUser.favourites.includes(product["_id"]);
    }
  };

  return (
    <Fragment>
      {/* product */}
      {!displayDetails && (
        <div>
          <div className={classes.productContainer}>
            <ArrowBackIosNewIcon
              className={classes.back}
              sx={{ fontSize: 30 }}
              onClick={() => {
                setDisplayProduct(false);
                setBar(true);
              }}
            />
            {selectedProduct.sale && (
              <div className={classes.sale}>
                <p>{selectedProduct.percentage}% OFF</p>
              </div>
            )}
            <Image
              className={classes.image}
              src={selectedProduct.images.main}
              alt="image"
              layout="fill"
              objectFit="cover"
              priority={true}
            />
            <div className={classes.banner}>
              <div className={classes.social}>
                <div>
                  {checFavourites(selectedProduct) ? (
                    <FavoriteIcon
                      className={classes.iconRed}
                      onClick={() => favourProduct(selectedProduct)}
                    />
                  ) : (
                    <FavoriteBorderIcon
                      className={classes.icon}
                      onClick={() => favourProduct(selectedProduct)}
                    />
                  )}
                </div>
              </div>
              <div className={classes.social}>
                <p>{Math.round(selectedProduct.views)}</p>
                <VisibilityIcon className={classes.icon} />
              </div>
            </div>
          </div>
          <div className={classes.product}>
            <p className={classes.description}>{selectedProduct.description}</p>
            <div className={classes.row}>
              <p className={classes.title}>{selectedProduct.designer}</p>
              <p>طراح</p>
            </div>
            <div
              className={classes.action}
              onClick={() => {
                setDisplayDetails(true);
              }}
            >
              {selectedProduct.sale ? (
                <Fragment>
                  <p className={classes.price}>
                    {convertNumber(selectedProduct.price)} T
                  </p>
                  <p className={classes.discount}>
                    {convertNumber(selectedProduct.discount)} T
                  </p>
                </Fragment>
              ) : (
                <p>{convertNumber(selectedProduct.price)} T</p>
              )}
              <p>{selectedProduct.title}</p>
            </div>
          </div>
        </div>
      )}
      {/* item details */}
      {displayDetails && (
        <div className={classes.itemContainer}>
          <div className={classes.topBar}>
            <ArrowBackIosNewIcon
              className="icon"
              onClick={() => {
                back();
              }}
              sx={{ fontSize: 30 }}
            />
            {selectedProduct.sale && (
              <div className={classes.sale}>
                <p>{selectedProduct.percentage}% OFF</p>
              </div>
            )}
            <div className={classes.sectionId}>
              <p>{selectedProduct.delmareId}</p>
              <p className={classes.title}>کد آیتم</p>
            </div>
          </div>
          <div className={classes.itemDetails}>
            <div className={classes.item}>
              <Image
                className={classes.image}
                src={mainItem}
                alt="image"
                layout="fill"
                objectFit="cover"
                priority={true}
              />
              <div className={classes.banner}>
                <div className={classes.social}>
                  <div>
                    {checFavourites(selectedProduct) ? (
                      <FavoriteIcon
                        className={classes.iconRed}
                        onClick={() => favourProduct(selectedProduct)}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        className={classes.icon}
                        onClick={() => favourProduct(selectedProduct)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.subItemDetail}>
              <div
                className={classes.subItem}
                onClick={() => {
                  toggleImages("one");
                }}
              >
                <Image
                  className={classes.detailImage}
                  src={itemOne}
                  alt="image"
                  width={100}
                  height={115}
                  objectFit="cover"
                  priority={true}
                />
              </div>
              <div
                className={classes.subItem}
                onClick={() => {
                  toggleImages("two");
                }}
              >
                <Image
                  className={classes.detailImage}
                  src={itemTwo}
                  alt="image"
                  width={100}
                  height={115}
                  objectFit="cover"
                  priority={true}
                />
              </div>
              <div
                className={classes.subItem}
                onClick={() => {
                  toggleImages("three");
                }}
              >
                <Image
                  className={classes.detailImage}
                  src={itemThree}
                  alt="image"
                  width={100}
                  height={115}
                  objectFit="cover"
                  priority={true}
                />
              </div>
            </div>
          </div>

          <div className={classes.details}>
            <div className={classes.priceContainer}>
              {selectedProduct.sale ? (
                <Fragment>
                  <p className={classes.price}>
                    {convertNumber(selectedProduct.price)} T
                  </p>
                  <p className={classes.discount}>
                    {convertNumber(selectedProduct.discount)} T
                  </p>
                </Fragment>
              ) : (
                <p>{convertNumber(selectedProduct.price)} T</p>
              )}
              <p>{selectedProduct.title}</p>
            </div>

            <div className={classes.section}>
              <div className={classes.box}>
                {Object.keys(productSizes).map((size, index) => (
                  <div
                    key={index}
                    className={
                      productSizes[size].selected
                        ? classes.selectedSize
                        : classes.size
                    }
                    onClick={() => {
                      selectDetails("size", productSizes[size].type, index);
                    }}
                  >
                    <p>{size}</p>
                  </div>
                ))}
              </div>
              <p className={classes.title}>اندازه</p>
            </div>
            <div className={classes.section}>
              <div className={classes.box}>
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className={
                      color.selected ? classes.selectedColor : classes.color
                    }
                    style={{ backgroundColor: `#${color.type}` }}
                    onClick={() =>
                      color.count > 0
                        ? selectDetails("color", color.type, index)
                        : setAlert("اتمام موجودی")
                    }
                  >
                    <p>{color.count}</p>
                  </div>
                ))}
              </div>
              {colors.length > 0 && (
                <p className={classes.title}>رنگ و موجودی</p>
              )}
            </div>
          </div>

          <div className={classes.alert}>{alert}</div>

          <button
            className={classes.button}
            onClick={() => {
              addToCart();
            }}
          >
            افزودن به سبد خرید
          </button>

          <div className={classes.designContainer}>
            <div className={classes.row}>
              <p className={classes.category}>{selectedProduct.category}</p>
              <p className={classes.title}>{selectedProduct.designer}</p>
              <p>طراح</p>
            </div>
            <p className={classes.description}>{selectedProduct.description}</p>
          </div>

          <div className={classes.information}>
            <div className={classes.section}>
              <div
                className={classes.item}
                onClick={() => {
                  setSizeGuide(!sizeGuide);
                  setShipmentMethod(false);
                  setReturnPolicy(false);
                }}
              >
                <p>راهنمای اندازه</p>
                {sizeGuide ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              {sizeGuide && (
                <div className={classes.information}>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      اندازه به سانتی متر است
                    </p>
                  </div>
                  <div className={classes.table}>
                    <Image
                      src={selectedProduct.images.table}
                      alt="image"
                      layout="fill"
                      objectFit="contain"
                      priority={true}
                    />
                  </div>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      شامل : اسکارف، عینک، کیف، اکسسوری، کلاه - FS : Free Size
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className={classes.section}>
              <div
                className={classes.item}
                onClick={() => {
                  setShipmentMethod(!shipmentMethod);
                  setSizeGuide(false);
                  setReturnPolicy(false);
                }}
              >
                <p>روش ارسال</p>
                {shipmentMethod ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              {shipmentMethod && (
                <div className={classes.information}>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      ارسال رایگان سفارش تهران وشهرستان در صورتی که جمع کل مبلغ
                      پرداختی در سبد خرید مشتری برابر با 1,000,000 تومان یا
                      بیشتر باشد
                    </p>
                  </div>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      ارسال سفارش از طریق تیپاکس برای خریدهای کمتر از 1,000,000
                      تومان به عهده مشتری خواهد بود و در درب منزل قابل پرداخت
                      خواهد بود
                    </p>
                  </div>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      ارسال سفارش از طریق پیک در تهران برای خریدهای کمتر از
                      1,000,000 تومان به عهده مشتری خواهد بود و در درب منزل قابل
                      پرداخت خواهد بود
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className={classes.section}>
              <div
                className={classes.item}
                onClick={() => {
                  setReturnPolicy(!returnPolicy);
                  setSizeGuide(false);
                  setShipmentMethod(false);
                }}
              >
                <p>شرایط بازگرداندن</p>
                {returnPolicy ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              {returnPolicy && (
                <div className={classes.information}>
                  <p className={classes.title}> رویه‌های بازگرداندن کالا</p>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      رضایتمندی مشتریان همواره از اولویت‏‌های دلماره است. ما در
                      این راستا می‏‌کوشیم تا هر سفارش در شرایط مطلوب به دست
                      مشتری برسد. با وجود این ممکن است مشتریان عزیز پس از خرید
                      با مسایلی روبرو شوند که در چنین مواردی خدماتی در چارچوب
                      خدمات پس از فروش در نظر گرفته شده است. مدت زمان لازم جهت
                      استفاده از این خدمات 24 ساعت است
                    </p>
                  </div>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      اگر کالای خریداری شده ایراد، زدگی یا پارگی داشته باشد در
                      صورت تایید کارشناسان ما، هزینه کالا به مشتری قابل بازگشت
                      خواهد بود
                    </p>
                  </div>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      اگر کالای خریداری شده از نظر مشخصات یا ظاهر با اطلاعات
                      محصول مغایرت داشته باشد
                    </p>
                  </div>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      اگر مغایرت بدون استفاده از کالا قابل مشاهده است، مثل رنگ
                      یا مشخصات درج شده روی آن، باید کالا در شرایط اولیه خود
                      باشد و از آن استفاده نشده باشد
                    </p>
                  </div>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      در صورتی که امکان تشخیص مغایرت تنها با باز کردن بسته بندی
                      ممکن باشد، لازم است کارتن و جعبه اصلی محصولات نگهداری شود
                      و از دور ریختن آن جداً خودداری شود
                    </p>
                  </div>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      استفاده از این سرویس تنها در صورتی امکانپذیر است که کالا
                      در کارتن یا جعبه اصلی خود به دلماره بازگردانده شود. برچسب
                      زدن یا نوشتن توضیحات، آدرس یا هر مورد دیگری روی کارتن یا
                      جعبه اصلی کالا و یا پاره و مخدوش کردن آن، امکان استفاده از
                      ضمانت بازگشت را از بین خواهد برد
                    </p>
                  </div>
                  <p className={classes.title}>
                    اگر مشتری از خرید خود منصرف شود
                  </p>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      اگر هنوز سفارش ارسال نشده باشد، باید هر چه سریعتر به واحد
                      پیگیری سفارش دلماره اطلاع داده شود
                    </p>
                  </div>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      اگر پس از دریافت کالا مشتری از خرید خود منصرف شود، حداکثر
                      تا 12 ساعت باید انصراف خود را به واحد خدمات پس از فروش
                      اطلاع دهد
                    </p>
                  </div>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      در این حالت، برگرداندن کالا پس از تایید کارشناس خدمات پس
                      از فروش، تنها در صورتی امکانپذیر است که در شرایط اولیه خود
                      (پلمپ) باشد، از آن استفاده نشده باشد. همچنین اگر کالا به‌
                      همراه هدیه فروخته شده باشد، بازگرداندن هدیه همراه آن نیز
                      الزامی است. لازم به ذکر است کالاهایی که به دلیل ماهیت خاص
                      یا استفاده شخصی و با توجه به لزوم رعایت مسایل بهداشتی
                      نمی‌توانند بازپس داده شوند، از شمول این بند خارج هستند
                    </p>
                  </div>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      لطفاً توجه داشته باشید که هرگونه تغییر در شرایط اولیه
                      کالا، امکان استفاده از این سرویس را از بین خواهد برد
                    </p>
                  </div>
                  <p className={classes.title}>اگر سایز کالا مناسب نباشد</p>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      درخواست بازگشت کالا تنها در صورتی پذیرفته می‌شود که اندازه
                      محصول با جدول سایز کالا منطبق نباشد و کفش یا پوشاک تنها
                      تست شده باشند و در وضعیت اولیه و نو باشند، و روی پوشاک
                      هیچگونه آثار استفاده مانند لکه، رنگ پریدگی یا بوی عطر و
                      بدن وجود نداشته باشد، و برچسب، مارک، دکمه و سایر ملحقات
                      جدا نشده باشد
                    </p>
                  </div>
                  <p className={classes.title}>
                    ضوابط مربوط به فروش محصولات آرایشی و بهداشتی
                  </p>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      اطلاعات هر محصول آرایشی بهداشتی در دلماره ، صرفاً برای
                      اطلاع‌ رسانی است و جنبه مشاوره ندارد. خریدار باید قبل از
                      استفاده از مواد آرایشی بهداشتی نسبت به کسب اطلاعات حرفه‌ای
                      و اخذ مشاوره از متخصص مربوط اقدام کند. همچنین، نظراتی که
                      کاربران در خصوص کالا در اپلیکیشن درج کرده‌اند، تجربه یا
                      اطلاعات شخصی افراد است و برای آنها و دلماره مسئولیتی ایجاد
                      نمی‌کند. همچنین دلماره مسئولیتی در قبال درستی اطلاعات
                      فراهم شده روی بسته‌بندی کالا ندارد و مسئولیت آن با شرکت
                      تولیدکننده کالاست
                    </p>
                  </div>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      درصورت عدم آگاهی، اطلاع و ناتوانی مشتری در استفاده از
                      محصولات آرایشی و بهداشتی و یا ایجاد خسارت نسبت به خود یا
                      محصول، تمامی مسئولیت‌‌های آن بر عهده مشتری است و فروشگاه
                      دلماره در این خصوص هیچگونه تعهدی نخواهد داشت. - در صورت
                      تایید معیوب بودن کالای مرجوعی توسط شرکت تامین یا
                      تولیدکننده، دلماره صرفاً هزینه کالا یا سرویس را مطابق
                      فاکتور (حداکثر تا یک هفته از تاریخ فاکتور) به مشتری
                      برمی‌گرداند
                    </p>
                  </div>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      دلماره نسبت به عوارض جسمی و بیماری‌های ناشی از استفاده
                      محصولات آرایشی و بهداشتی (از قبیل حساسیت‌های پوستی، جراحات
                      و ...) مسئولیت و پاسخگویی ندارد. انجام پیگیری‌های لازم
                      باید توسط مشتری و از طریق شرکت‌های مربوط ( نمایندگی‌ها و
                      تامین‌کنندگان رسمی کالا) انجام شود
                    </p>
                  </div>
                  <p className={classes.title}>
                    کدام کالاها قابل بازگشت نیستند؟
                  </p>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      زیورآلات و اکسسوری ها مانند گوشواره و اکسسوری های مشابه که
                      تماس مستقیم با پوست دارند امکان بازگشت سلیقه ای ندارند
                    </p>
                  </div>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      لوازم آرایشی، کرم ها و لوسیون ها مطابق قوانین وزارت بهداشت
                      به صورت پلمپ فروخته شده و امکان بازگشت ندارند
                    </p>
                  </div>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      لباس های نوزادی به دلیل مسایل بهداشتی قابل بازگشت ندارند
                    </p>
                  </div>
                  <div className={classes.row}>
                    <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                    <p className={classes.description}>
                      لباس های زیر مانند شورت های مردانه، زنانه یا بچه گانه به
                      دلیل مسایل بهداشتی قابل بازگشت نیستند
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Product;
