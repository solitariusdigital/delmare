import { useState, useEffect, useContext, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import classes from "./Product.module.scss";
import Image from "next/image";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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
  const [displayDetails, setDisplayDetails] = useState(false);

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
    setDisplayDetails(false);
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
          id: selectedProduct.id,
          title: selectedProduct.title,
          size: selectedSize,
          color: selectedColor,
          price: selectedProduct.price,
          image: selectedProduct.images.main,
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
      if (currentUser.favourites.includes(product["_id"])) {
        currentUser.favourites.splice(
          currentUser.favourites.indexOf(product["_id"]),
          1
        );
        setLike(false);
      } else {
        currentUser.favourites.push(product["_id"]);
        setLike(true);
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
              sx={{ color: "#1b1b1b", fontSize: 30 }}
              onClick={() => {
                setDisplayProduct(false);
                setBar(true);
              }}
            />
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
                <VisibilityIcon className={classes.icon} />
                <p>{selectedProduct.views}</p>
              </div>
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
          <div className={classes.product}>
            <p className={classes.description}>{selectedProduct.description}</p>
            <div
              className={classes.list}
              onClick={() => {
                setDisplayDetails(true);
              }}
            >
              <p>{convertNumber(selectedProduct.price)} T</p>
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
              sx={{ color: "#1b1b1b", fontSize: 30 }}
              onClick={() => {
                back();
              }}
            />
            <div className={classes.item}>
              <p>{convertNumber(selectedProduct.price)} T</p>
              <p>{selectedProduct.title}</p>
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
                    onClick={() => {
                      selectDetails("color", color.type, index);
                    }}
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
                <div className={classes.info}>
                  <Image
                    src={selectedProduct.images.table}
                    alt="image"
                    layout="fill"
                    objectFit="contain"
                    priority={true}
                  />
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
                <div className={classes.info}>
                  <p>Shimpment</p>
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
                <div className={classes.info}>
                  <p>Return</p>
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
