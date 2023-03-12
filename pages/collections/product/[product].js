/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useContext, Fragment } from "react";
import { StateContext } from "../../../context/stateContext";
import classes from "../../product.module.scss";
import Image from "next/image";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FiberManualRecordOutlined from "@mui/icons-material/FiberManualRecordOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { convertNumber, abbreviateNumber } from "../../../services/utility";
import {
  updateUserApi,
  getProductApi,
  getProducstApi,
  updateProductApi,
} from "../../../services/api";
import payment from "../../../assets/payment.png";
import quality from "../../../assets/quality.png";
import post from "../../../assets/post.png";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dbConnect from "../../../services/dbConnect";
import ProductModel from "../../../models/Product";
import Router from "next/router";
import { useRouter } from "next/router";
import ShareIcon from "@mui/icons-material/Share";
import secureLocalStorage from "react-secure-storage";
import Head from "next/head";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

export default function Product({ product, favourite }) {
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { menue, setMenu } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const [alert, setAlert] = useState("");

  // product image variables
  const [mainItem, setMainItem] = useState(product.images.main);
  const [itemOne, setItemOne] = useState(product.images.one);
  const [itemTwo, setItemTwo] = useState(product.images.two);
  const [itemThree, setItemThree] = useState(product.images.three);
  // to control image display
  const [itemOneDisplay, setitemOneDisplay] = useState(false);
  const [itemTwoDisplay, setitemTwoDisplay] = useState(false);
  const [itemThreeDisplay, setitemThreeDisplay] = useState(false);
  // to control extra information
  const [sizeGuide, setSizeGuide] = useState(false);
  const [shipmentMethod, setShipmentMethod] = useState(false);
  const [returnPolicy, setReturnPolicy] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  // product options
  const [colors, setColors] = useState([]);
  const [productSizes, setProductSizes] = useState(product.size);
  // customer selections
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCount, setSelectedCount] = useState("");
  // product prices
  const [discount, setDiscount] = useState(product.discount);
  const [price, setPrice] = useState(product.price);
  const [percentage, setPercentage] = useState(product.percentage);

  const [like, setLike] = useState(favourite);
  const [displayPopup, setDisplayPopuo] = useState(false);
  const [active, setActive] = useState(true);
  const [display, setDisplay] = useState(true);

  const router = useRouter();

  // navigation back/forward actions
  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        window.scrollTo(0, 0);
      }
      return true;
    });
    return () => {
      router.beforePopState(() => true);
    };
  }, [router]);

  // manage product states on arrow back
  useEffect(() => {
    setMainItem(product.images.main);
    setItemOne(product.images.one);
    setItemTwo(product.images.two);
    setItemThree(product.images.three);
    setProductSizes(product.size);
    colors.length = 0;
  }, [
    colors,
    product.images.main,
    product.images.one,
    product.images.three,
    product.images.two,
    product.size,
  ]);

  useEffect(() => {
    setActive(product.activate);
    setDisplay(product.display);

    const fetchData = async () => {
      const data = await getProducstApi();
      setSimilarProducts(
        data
          .filter((pro) => {
            return (
              pro.category === product.category && pro["_id"] !== product["_id"]
            );
          })
          .sort(() => 0.5 - Math.random())
          .slice(0, 2)
      );
    };
    fetchData().catch(console.error);
  }, [setSimilarProducts, product]);

  useEffect(() => {
    setBar(false);
    secureLocalStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    Object.keys(productSizes).forEach((size) => {
      productSizes[size]["type"] = size;
      productSizes[size]["selected"] = false;
    });
  }, [setBar, shoppingCart, productSizes]);

  useEffect(() => {
    const fetchData = async () => {
      // update views count
      if (
        !currentUser ||
        JSON.parse(secureLocalStorage.getItem("currentUser"))["permission"] !==
          "admin"
      ) {
        let updateData = {
          ...product,
          views: product.views + 1.5,
        };
        await updateProductApi(updateData);
      }
    };
    fetchData().catch(console.error);
  }, [currentUser, product]);

  const toggleImages = (type) => {
    switch (type) {
      case "one":
        setItemTwo(product.images.two);
        setItemThree(product.images.three);
        setitemTwoDisplay(false);
        setitemThreeDisplay(false);
        if (itemOneDisplay) {
          setItemOne(product.images.one);
          setMainItem(product.images.main);
          setitemOneDisplay(false);
        } else {
          setItemOne(product.images.main);
          setMainItem(product.images.one);
          setitemOneDisplay(true);
        }
        break;
      case "two":
        setItemOne(product.images.one);
        setItemThree(product.images.three);
        setitemOneDisplay(false);
        setitemThreeDisplay(false);
        if (itemTwoDisplay) {
          setItemTwo(product.images.two);
          setMainItem(product.images.main);
          setitemTwoDisplay(false);
        } else {
          setItemTwo(product.images.main);
          setMainItem(product.images.two);
          setitemTwoDisplay(true);
        }
        break;
      case "three":
        setItemOne(product.images.one);
        setItemTwo(product.images.two);
        setitemOneDisplay(false);
        setitemTwoDisplay(false);
        if (itemThreeDisplay) {
          setItemThree(product.images.three);
          setMainItem(product.images.main);
          setitemThreeDisplay(false);
        } else {
          setItemThree(product.images.main);
          setMainItem(product.images.three);
          setitemThreeDisplay(true);
        }
        break;
    }
  };

  const back = () => {
    // secureLocalStorage.removeItem("bloggerId");
    setSelectedColor("");
    setSelectedSize("");
    clearDetails();
    colors.length = 0;
    router.back();
  };

  const clearDetails = () => {
    colors.map((color) => {
      color.selected = false;
    });
    Object.keys(productSizes).forEach((size) => {
      productSizes[size].selected = false;
    });
  };

  const selectDetails = (detail, type, i, count) => {
    setAlert("");
    switch (detail) {
      case "color":
        setSelectedCount(count);
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
        setSelectedCount("");
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
            if (colors.length === 1) {
              colors[0].selected = true;
              setSelectedColor(colors[0].type);
              setSelectedCount(colors[0].count);
            }
          } else {
            productSizes[size].selected = false;
          }
        });
    }
  };

  // assign bloggerId to be added into shopping cart
  const assignBloggerId = () => {
    let bloggerDelmareId = "DELMAREH";
    let bloggerIdContainer = JSON.parse(
      secureLocalStorage.getItem("bloggerDelmareId")
    );
    if (bloggerIdContainer) {
      bloggerIdContainer.forEach((item) => {
        if (product["_id"] === Object.keys(item)[0]) {
          bloggerDelmareId = Object.values(item)[0];
        }
      });
    }
    return bloggerDelmareId;
  };

  const addToCart = () => {
    if (selectedColor === "" || selectedSize === "") {
      setAlert("رنگ یا اندازه را انتخاب کنید");
    } else {
      let bloggerDelmareId = assignBloggerId();
      // add item to shopping cart
      setShoppingCart([
        ...shoppingCart,
        {
          _id: product["_id"],
          delmareId: product.delmareId,
          title: product.title,
          bloggerDelmareId: bloggerDelmareId,
          size: selectedSize,
          color: selectedColor,
          price: product.sale ? product.discount : product.price,
          image: product.images.main,
          percentage: product.percentage,
          deliveryType: product.deliveryType,
          sale: product.sale,
        },
      ]);

      clearDetails();
      setSelectedColor("");
      setSelectedSize("");
      setToggleContainer("cart");
      colors.length = 0;
      window.scrollTo(0, 0);
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
      secureLocalStorage.setItem("currentUser", JSON.stringify(currentUser));
      await updateUserApi(currentUser);
    }
  };

  const checFavourites = (product) => {
    if (currentUser) {
      return currentUser.favourites.includes(product["_id"]);
    }
  };

  const selectProduct = async (id) => {
    const product = await getProductApi(id);
    setProductSizes(product.size);
    setMainItem(product.images.main);
    setItemOne(product.images.one);
    setItemTwo(product.images.two);
    setItemThree(product.images.three);
    colors.length = 0;
    setSelectedSize("");
    Router.push(`/collections/product/${id}`);
    window.scrollTo(0, 0);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `https://delmareh.com/collections/product/${product["_id"]}`
    );
    document.querySelector(".shareIcon").classList.add(classes.shareIcon);
    setTimeout(() => {
      document.querySelector(".shareIcon").classList.remove(classes.shareIcon);
    }, 1000);
  };

  const productActivation = async (type) => {
    let confirm = window.confirm(
      `${type === "activate" ? "اتمام موجودی" : "موجود در انبار"} مطمئنی؟`
    );
    if (confirm) {
      const updateData = await getProductApi(product["_id"]);
      switch (type) {
        case "activate":
          setActive(false);
          updateData.activate = false;
          break;
        case "deactivate":
          setActive(true);
          updateData.activate = true;
          break;
      }
      await updateProductApi(updateData);
    }
  };

  const productArchive = async (type) => {
    let confirm = window.confirm("وارد آرکایو میشه و پنهان، مطمئنی؟");
    if (confirm) {
      const updateData = await getProductApi(product["_id"]);
      switch (type) {
        case "display":
          setDisplay(true);
          updateData.display = true;
          break;
        case "hide":
          setDisplay(false);
          updateData.display = false;
          break;
      }
      await updateProductApi(updateData);
    }
  };

  return (
    <Fragment>
      <Head>
        <title>Fashion Product</title>
        <meta name="description" content="Fashion product" />
      </Head>
      <div className={classes.productContainer}>
        <div className={classes.topBar}>
          <ArrowBackIosNewIcon
            className="icon"
            onClick={() => {
              back();
            }}
            sx={{ fontSize: 30 }}
          />
          {product.sale && (
            <div className={classes.sale}>
              <p>{product.percentage}% OFF</p>
            </div>
          )}
          <div className={classes.sectionId}>
            <p>{product.delmareId}</p>
            <p className={classes.title}>کد آیتم</p>
          </div>
        </div>
        <div className={classes.productImages}>
          <div className={classes.product}>
            <Image
              className={classes.image}
              src={mainItem}
              blurDataURL={mainItem}
              placeholder="blur"
              alt="image"
              layout="fill"
              objectFit="cover"
              priority
              loading="eager"
              onClick={() => {
                setDisplayPopuo(true);
                window.scrollTo(0, 0);
              }}
            />
            <div className={classes.banner}>
              <div className={classes.social}>
                {currentUser && currentUser.permission === "blogger" ? (
                  <div>
                    {checFavourites(product) ? (
                      <StarIcon
                        className={classes.iconPink}
                        onClick={() => favourProduct(product)}
                      />
                    ) : (
                      <StarBorderIcon
                        className={classes.icon}
                        onClick={() => favourProduct(product)}
                      />
                    )}
                  </div>
                ) : (
                  <div>
                    {checFavourites(product) ? (
                      <FavoriteIcon
                        className={classes.iconRed}
                        onClick={() => favourProduct(product)}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        className={classes.icon}
                        onClick={() => favourProduct(product)}
                      />
                    )}
                  </div>
                )}
              </div>
              <div className={classes.social}>
                <p>{abbreviateNumber(Math.round(product.views))}</p>
                <VisibilityIcon className="icon" />
              </div>
              <ShareIcon
                className="icon shareIcon"
                onClick={() => copyLink()}
                sx={{ fontSize: 18 }}
              />
            </div>
          </div>
          <div className={classes.subItemProduct}>
            <div
              className={classes.subProduct}
              onClick={() => {
                toggleImages("one");
              }}
            >
              <Image
                className={classes.productImage}
                src={itemOne}
                blurDataURL={itemOne}
                placeholder="blur"
                alt="image"
                width={100}
                height={115}
                objectFit="cover"
                priority
                loading="eager"
              />
            </div>
            <div
              className={classes.subProduct}
              onClick={() => {
                toggleImages("two");
              }}
            >
              <Image
                className={classes.productImage}
                src={itemTwo}
                blurDataURL={itemTwo}
                placeholder="blur"
                alt="image"
                width={100}
                height={115}
                objectFit="cover"
                priority
                loading="eager"
              />
            </div>
            <div
              className={classes.subProduct}
              onClick={() => {
                toggleImages("three");
              }}
            >
              <Image
                className={classes.productImage}
                src={itemThree}
                blurDataURL={itemThree}
                placeholder="blur"
                alt="image"
                width={100}
                height={115}
                objectFit="cover"
                priority
                loading="eager"
              />
            </div>
          </div>
          {displayPopup && (
            <div className={classes.imagePopup}>
              <Image
                className={classes.image}
                src={mainItem}
                blurDataURL={mainItem}
                placeholder="blur"
                alt="image"
                layout="fill"
                objectFit="cover"
                priority
                loading="eager"
                onClick={() => {
                  setDisplayPopuo(false);
                  window.scrollTo(0, 0);
                }}
              />
            </div>
          )}
        </div>
        <div className={classes.productDetails}>
          <div className={classes.priceContainer}>
            {product.sale ? (
              <div className={classes.discount}>
                <p className={classes.discountPrice}>
                  {convertNumber(discount)} T
                </p>
                <p className={classes.price}>{convertNumber(price)}</p>
                {product.sale && (
                  <div className={classes.sale}>
                    <p>{percentage}% OFF</p>
                  </div>
                )}
              </div>
            ) : (
              <p>{convertNumber(price)} T</p>
            )}
            <p>{product.title}</p>
          </div>
          <p className={classes.description}>{product.description}</p>
          {active && (
            <Fragment>
              <div className={classes.section}>
                <p className={classes.title}>انتخاب اندازه</p>
                <div className={classes.box}>
                  {Object.keys(productSizes).map((size, index) => (
                    <div
                      key={index}
                      className={
                        productSizes[size].selected
                          ? classes.selectedSize
                          : classes.size
                      }
                      onClick={() =>
                        selectDetails("size", productSizes[size].type, index, 0)
                      }
                    >
                      <p>{size}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className={classes.section}>
                {colors.length > 0 && (
                  <p className={classes.title}>انتخاب رنگ</p>
                )}
                <div className={classes.box}>
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      className={
                        color.selected ? classes.selectedColor : classes.color
                      }
                      style={{ backgroundColor: `#${color.type}` }}
                      onClick={() =>
                        selectDetails("color", color.type, index, color.count)
                      }
                    ></div>
                  ))}
                </div>
              </div>
            </Fragment>
          )}
          <div className={classes.rowDetails}>
            <p>تحویل</p>
            {active ? (
              <p className={classes.title}>{product.deliveryType}</p>
            ) : (
              <p className={classes.title}>اتمام موجودی</p>
            )}
          </div>
        </div>
        {colors.length > 0 && (
          <div className={classes.countContainer}>
            <div className={classes.count}>
              {selectedCount === 0 ? (
                <p>اتمام موجودی</p>
              ) : (
                <div className={classes.count}>
                  {selectedCount}
                  {selectedCount !== "" && <p>موجودی</p>}
                </div>
              )}
            </div>
          </div>
        )}
        <div className={classes.alert}>{alert}</div>
        {active && (
          <button
            className={classes.button}
            disabled={selectedCount === 0}
            onClick={() => {
              addToCart();
            }}
          >
            افزودن به سبد خرید
          </button>
        )}
        {!currentUser ||
          (JSON.parse(secureLocalStorage.getItem("currentUser"))[
            "permission"
          ] === "admin" && (
            <div className={classes.adminAction}>
              <Fragment>
                {!active ? (
                  <button
                    className={classes.activate}
                    onClick={() => {
                      productActivation("deactivate");
                    }}
                  >
                    فعال
                  </button>
                ) : (
                  <button
                    className={classes.deactivate}
                    onClick={() => {
                      productActivation("activate");
                    }}
                  >
                    غیر فعال
                  </button>
                )}
              </Fragment>
              <Fragment>
                {!display ? (
                  <button
                    className={classes.activate}
                    onClick={() => {
                      productArchive("display");
                    }}
                  >
                    نمایش
                  </button>
                ) : (
                  <button
                    className={classes.hidden}
                    onClick={() => {
                      productArchive("hide");
                    }}
                  >
                    پنهان
                  </button>
                )}
              </Fragment>
            </div>
          ))}

        <div className={classes.designContainer}>
          <div className={classes.rowDetails}>
            <p>برند</p>
            <p className={classes.title}>
              {product.brandType === "اورجینال" ? "خارجی" : product.brand}
            </p>
          </div>
          <div className={classes.rowDetails}>
            <p>نوع</p>
            <p className={classes.title}>{product.brandType}</p>
          </div>
          <div className={classes.rowDetails}>
            <p>دسته</p>
            <p className={classes.title}>{product.category}</p>
          </div>
          <div className={classes.rowDetails}>
            <p>فصل</p>
            <p className={classes.title}>{product.season}</p>
          </div>
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
                  <div>
                    <p className={classes.description}>
                      تک سایز - FS : Free Size
                    </p>
                    <p className={classes.description}>
                      اسکارف، اکسسوری، ساعت، عینک، کلاه و کیف، تک سایز هستند
                    </p>
                  </div>
                </div>
                {product.images.table !== "" && (
                  <Fragment>
                    <div className={classes.row}>
                      <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                      <p className={classes.description}>
                        اندازه در جدول به سانتی متر است
                      </p>
                    </div>
                    <div className={classes.table}>
                      <Image
                        src={product.images.table}
                        blurDataURL={product.images.table}
                        placeholder="blur"
                        alt="image"
                        layout="fill"
                        objectFit="contain"
                        priority
                        loading="eager"
                      />
                    </div>
                  </Fragment>
                )}
                {product.images.graph !== "" && (
                  <Fragment>
                    <div className={classes.table}>
                      <Image
                        src={product.images.graph}
                        blurDataURL={product.images.graph}
                        placeholder="blur"
                        alt="image"
                        layout="fill"
                        objectFit="contain"
                        priority
                        loading="eager"
                      />
                    </div>
                  </Fragment>
                )}
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
                    ارسال رایگان سفارش به تمام کشور در صورتی که جمع کل مبلغ
                    پرداختی در سبد خرید مشتری برابر با 1,000,000 تومان یا بیشتر
                    باشد
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
                    این راستا می‏‌کوشیم تا هر سفارش در شرایط مطلوب به دست مشتری
                    برسد. با وجود این ممکن است مشتریان عزیز پس از خرید با مسایلی
                    روبرو شوند که در چنین مواردی خدماتی در چارچوب خدمات پس از
                    فروش در نظر گرفته شده است. مدت زمان لازم جهت استفاده از این
                    خدمات 24 ساعت است
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
                    اگر کالای خریداری شده از نظر مشخصات یا ظاهر با اطلاعات محصول
                    مغایرت داشته باشد
                  </p>
                </div>
                <div className={classes.row}>
                  <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                  <p className={classes.description}>
                    اگر مغایرت بدون استفاده از کالا قابل مشاهده است، مثل رنگ یا
                    مشخصات درج شده روی آن، باید کالا در شرایط اولیه خود باشد و
                    از آن استفاده نشده باشد
                  </p>
                </div>
                <div className={classes.row}>
                  <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                  <p className={classes.description}>
                    در صورتی که امکان تشخیص مغایرت تنها با باز کردن بسته بندی
                    ممکن باشد، لازم است کارتن و جعبه اصلی محصولات نگهداری شود و
                    از دور ریختن آن جداً خودداری شود
                  </p>
                </div>
                <div className={classes.row}>
                  <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                  <p className={classes.description}>
                    استفاده از این سرویس تنها در صورتی امکانپذیر است که کالا در
                    کارتن یا جعبه اصلی خود به دلماره بازگردانده شود. برچسب زدن
                    یا نوشتن توضیحات، آدرس یا هر مورد دیگری روی کارتن یا جعبه
                    اصلی کالا و یا پاره و مخدوش کردن آن، امکان استفاده از ضمانت
                    بازگشت را از بین خواهد برد
                  </p>
                </div>
                <p className={classes.title}>اگر مشتری از خرید خود منصرف شود</p>
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
                    اگر پس از دریافت کالا مشتری از خرید خود منصرف شود، حداکثر تا
                    12 ساعت باید انصراف خود را به واحد خدمات پس از فروش اطلاع
                    دهد
                  </p>
                </div>
                <div className={classes.row}>
                  <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                  <p className={classes.description}>
                    در این حالت، برگرداندن کالا پس از تایید کارشناس خدمات پس از
                    فروش، تنها در صورتی امکانپذیر است که در شرایط اولیه خود
                    (پلمپ) باشد، از آن استفاده نشده باشد. همچنین اگر کالا به‌
                    همراه هدیه فروخته شده باشد، بازگرداندن هدیه همراه آن نیز
                    الزامی است. لازم به ذکر است کالاهایی که به دلیل ماهیت خاص یا
                    استفاده شخصی و با توجه به لزوم رعایت مسایل بهداشتی
                    نمی‌توانند بازپس داده شوند، از شمول این بند خارج هستند
                  </p>
                </div>
                <div className={classes.row}>
                  <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                  <p className={classes.description}>
                    لطفاً توجه داشته باشید که هرگونه تغییر در شرایط اولیه کالا،
                    امکان استفاده از این سرویس را از بین خواهد برد
                  </p>
                </div>
                <p className={classes.title}>اگر سایز کالا مناسب نباشد</p>
                <div className={classes.row}>
                  <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                  <p className={classes.description}>
                    درخواست بازگشت کالا تنها در صورتی پذیرفته می‌شود که اندازه
                    محصول با جدول سایز کالا منطبق نباشد و کفش یا پوشاک تنها تست
                    شده باشند و در وضعیت اولیه و نو باشند، و روی پوشاک هیچگونه
                    آثار استفاده مانند لکه، رنگ پریدگی یا بوی عطر و بدن وجود
                    نداشته باشد، و برچسب، مارک، دکمه و سایر ملحقات جدا نشده باشد
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
                    استفاده از مواد آرایشی بهداشتی نسبت به کسب اطلاعات حرفه‌ای و
                    اخذ مشاوره از متخصص مربوط اقدام کند. همچنین، نظراتی که
                    کاربران در خصوص کالا در اپلیکیشن درج کرده‌اند، تجربه یا
                    اطلاعات شخصی افراد است و برای آنها و دلماره مسئولیتی ایجاد
                    نمی‌کند. همچنین دلماره مسئولیتی در قبال درستی اطلاعات فراهم
                    شده روی بسته‌بندی کالا ندارد و مسئولیت آن با شرکت تولید
                    کننده کالا است
                  </p>
                </div>
                <div className={classes.row}>
                  <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                  <p className={classes.description}>
                    درصورت عدم آگاهی، اطلاع و ناتوانی مشتری در استفاده از
                    محصولات آرایشی و بهداشتی و یا ایجاد خسارت نسبت به خود یا
                    محصول، تمامی مسئولیت‌‌های آن بر عهده مشتری است و فروشگاه
                    دلماره در این خصوص هیچگونه تعهدی نخواهد داشت. - در صورت
                    تایید معیوب بودن کالای مرجوعی توسط شرکت تامین یا تولیدکننده،
                    دلماره صرفاً هزینه کالا یا سرویس را مطابق فاکتور (حداکثر تا
                    یک هفته از تاریخ فاکتور) به مشتری برمی‌گرداند
                  </p>
                </div>
                <div className={classes.row}>
                  <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
                  <p className={classes.description}>
                    دلماره نسبت به عوارض جسمی و بیماری‌های ناشی از استفاده
                    محصولات آرایشی و بهداشتی (از قبیل حساسیت‌های پوستی، جراحات و
                    ...) مسئولیت و پاسخگویی ندارد. انجام پیگیری‌های لازم باید
                    توسط مشتری و از طریق شرکت‌های مربوط ( نمایندگی‌ها و
                    تامین‌کنندگان رسمی کالا) انجام شود
                  </p>
                </div>
                <p className={classes.title}>کدام کالاها قابل بازگشت نیستند؟</p>
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
                    لباس های نوزادی به دلیل مسایل بهداشتی امکان بازگشت ندارند
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

        <div className={classes.graphic}>
          <div className={classes.row}>
            <div>
              <Image
                className={classes.image}
                src={payment}
                alt="ایمن"
                objectFit="contain"
                width={100}
                height={100}
              />
              <p>پرداخت ایمن</p>
            </div>
            <div>
              <Image
                className={classes.image}
                src={post}
                alt="ارسال"
                objectFit="contain"
                width={100}
                height={100}
              />
              <p>ارسال به تمام کشور</p>
            </div>
            <div>
              <Image
                className={classes.image}
                src={quality}
                alt="کیفیت"
                objectFit="contain"
                width={100}
                height={100}
              />
              <p>ضمانت کیفیت</p>
            </div>
          </div>
        </div>

        {similarProducts.length !== 0 && (
          <div className={classes.similarContainer}>
            <p className={classes.title}>آیتم مشابه</p>
            <div className={`collection-grid ${classes.grid}`}>
              {similarProducts.map((product, index) => (
                <div key={index} className="product">
                  <div className="banner">
                    <p className="title">{product.title}</p>
                    <div className="social">
                      {currentUser && currentUser.permission === "blogger" ? (
                        <div>
                          {checFavourites(product) ? (
                            <StarIcon
                              className="iconPink"
                              onClick={() => favourProduct(product)}
                            />
                          ) : (
                            <StarBorderIcon
                              className="icon"
                              onClick={() => favourProduct(product)}
                            />
                          )}
                        </div>
                      ) : (
                        <div>
                          {checFavourites(product) ? (
                            <FavoriteIcon
                              className="iconRed"
                              onClick={() => favourProduct(product)}
                            />
                          ) : (
                            <FavoriteBorderIcon
                              className="icon"
                              onClick={() => favourProduct(product)}
                            />
                          )}
                        </div>
                      )}
                      <div className="social">
                        <VisibilityIcon className="icon" />
                        <p>{abbreviateNumber(Math.round(product.views))}</p>
                      </div>
                    </div>
                  </div>
                  <Image
                    onClick={() => selectProduct(product["_id"])}
                    className={classes.image}
                    src={product.images.main}
                    blurDataURL={product.images.main}
                    placeholder="blur"
                    alt="image"
                    layout="fill"
                    objectFit="cover"
                    priority
                    loading="eager"
                  />
                  {product.sale && (
                    <div className="sale">
                      <p>{product.percentage}%</p>
                    </div>
                  )}
                  {!product.activate && (
                    <div className="activate">
                      <p>تمام</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={classes.graphic}>
          <a
            referrerPolicy="origin"
            rel="noopener"
            target="_blank"
            href="https://trustseal.enamad.ir/?id=311141&amp;Code=GPyVAMJIOJVa0l6MNns2"
          >
            <img
              referrerPolicy="origin"
              src="https://Trustseal.eNamad.ir/logo.aspx?id=311141&amp;Code=GPyVAMJIOJVa0l6MNns2"
              id="GPyVAMJIOJVa0l6MNns2"
              decoding="async"
              alt="enamad logo"
            />
          </a>
          <p>نماد اعتماد الکترونیکی</p>
        </div>
      </div>
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    let productId = context.params.product;
    const product = await ProductModel.findById(productId);

    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
