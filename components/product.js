import { useState, useEffect, useContext, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import classes from "./Product.module.scss";
import Image from "next/image";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloseIcon from "@mui/icons-material/Close";

import item from "../assets/mainItem.jpg";
import one from "../assets/itemOne.jpg";
import two from "../assets/itemTwo.jpg";
import three from "../assets/itemThree.jpg";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { convertNumber } from "./services/utility";

function Product() {
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { displayProduct, setDisplayProduct } = useContext(StateContext);
  const { selectedProduct, setSelectedProduct } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);

  const [displayDetails, setDisplayDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    id: null,
    image: null,
    items: null,
  });

  // item image variables
  const [mainItem, setMainItem] = useState(item);
  const [itemOne, setItemOne] = useState(one);
  const [itemTwo, setItemTwo] = useState(two);
  const [itemThree, setItemThree] = useState(three);
  // to control image display
  const [itemOneDisplay, setitemOneDisplay] = useState(false);
  const [itemTwoDisplay, setitemTwoDisplay] = useState(false);
  const [itemThreeDisplay, setitemThreeDisplay] = useState(false);
  // to control extra information
  const [extraInfo, setExtraInfo] = useState(
    "return" || "size" || "shipment" || ""
  );

  const [colors, setColors] = useState([
    {
      type: "red",
      selected: false,
    },
    {
      type: "blue",
      selected: false,
    },
    {
      type: "orange",
      selected: false,
    },
    {
      type: "pink",
      selected: false,
    },
    {
      type: "green",
      selected: false,
    },
  ]);
  const [sizes, setSizes] = useState([
    {
      type: "S",
      selected: false,
    },
    {
      type: "M",
      selected: false,
    },
    {
      type: "L",
      selected: false,
    },
    {
      type: "XL",
      selected: false,
    },
  ]);
  const [alert, setAlert] = useState("");

  // customer selections
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    setBar(false);
    setExtraInfo("");
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  }, [setBar, shoppingCart]);

  const selectItem = (item) => {
    setDisplayDetails(true);
    setSelectedItem({
      id: item.id,
      title: item.title,
      price: item.price,
    });
  };

  const toggleItems = (type) => {
    switch (type) {
      case "one":
        setItemTwo(two);
        setItemThree(three);
        setitemTwoDisplay(false);
        setitemThreeDisplay(false);
        if (itemOneDisplay) {
          setItemOne(one);
          setMainItem(item);
          setitemOneDisplay(false);
        } else {
          setItemOne(item);
          setMainItem(one);
          setitemOneDisplay(true);
        }
        break;
      case "two":
        setItemOne(one);
        setItemThree(three);
        setitemOneDisplay(false);
        setitemThreeDisplay(false);
        if (itemTwoDisplay) {
          setItemTwo(two);
          setMainItem(item);
          setitemTwoDisplay(false);
        } else {
          setItemTwo(item);
          setMainItem(two);
          setitemTwoDisplay(true);
        }
        break;
      case "three":
        setItemOne(one);
        setItemTwo(two);
        setitemOneDisplay(false);
        setitemTwoDisplay(false);
        if (itemThreeDisplay) {
          setItemThree(three);
          setMainItem(item);
          setitemThreeDisplay(false);
        } else {
          setItemThree(item);
          setMainItem(three);
          setitemThreeDisplay(true);
        }
        break;
    }
  };

  const back = () => {
    setDisplayDetails(false);
    setSelectedColor("");
    setSelectedSize("");
    setExtraInfo("");
    clearDetails();
  };

  const clearDetails = () => {
    colors.map((color, index) => {
      color.selected = false;
    });
    sizes.map((size, index) => {
      size.selected = false;
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
        setSelectedSize(type);
        sizes.map((size, index) => {
          if (i === index) {
            size.selected = true;
          } else {
            size.selected = false;
          }
        });
    }
  };

  const addToCart = () => {
    if (selectedColor === "" || selectedSize === "") {
      setAlert("رنگ یا اندازه را انتخاب کنید");
      setTimeout(() => {
        setAlert("");
      }, 3000);
      return;
    } else {
      clearDetails();
      setAlert("آیتم به سبد خرید اضافه شد");
      setTimeout(() => {
        setAlert("");
      }, 3000);
    }

    setShoppingCart([
      ...shoppingCart,
      {
        id: "0000",
        title: selectedItem.title,
        size: selectedSize,
        color: selectedColor,
        price: selectedItem.price,
        shipping: "",
      },
    ]);

    setSelectedColor("");
    setSelectedSize("");
  };

  const favourProduct = () => {};

  return (
    <Fragment>
      {/* product */}
      {!displayDetails && (
        <div>
          <div className={classes.productContainer}>
            <ArrowBackIosNewIcon
              className={classes.back}
              sx={{ color: "#000000", fontSize: 30 }}
              onClick={() => {
                setDisplayProduct(false);
                setBar(true);
              }}
            />
            <Image
              className={classes.image}
              src={selectedProduct.image}
              alt="image"
              layout="fill"
              objectFit="cover"
            />
            <div className={classes.banner}>
              <div className={classes.social}>
                <p>{selectedProduct.views}</p>
                <VisibilityIcon className={classes.icon} />
              </div>
              <div className={classes.social}>
                <p>{selectedProduct.like}</p>
                <div>
                  {selectedProduct.favoured ? (
                    <FavoriteIcon
                      className={classes.iconRed}
                      onClick={() => favourProduct()}
                    />
                  ) : (
                    <FavoriteBorderIcon
                      className={classes.icon}
                      onClick={() => favourProduct()}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={classes.product}>
            <p className={classes.description}>آیتم مورد نظر را انتخاب کنید</p>
            {selectedProduct.items.map((item, index) => (
              <div
                key={index}
                className={classes.list}
                onClick={() => {
                  selectItem(item);
                }}
              >
                <p>{convertNumber(item.price)} T</p>
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* item details */}
      {displayDetails && (
        <div className={classes.itemContainer}>
          <div className={classes.topBar}>
            <ArrowBackIosNewIcon
              sx={{ color: "#000000", fontSize: 30 }}
              onClick={() => {
                back();
              }}
            />
            <div className={classes.item}>
              <p>{convertNumber(selectedItem.price)} T</p>
              <p>{selectedItem.title}</p>
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
              />
            </div>
            <div className={classes.subItemDetail}>
              <div
                className={classes.subItem}
                onClick={() => {
                  toggleItems("one");
                }}
              >
                <Image
                  className={classes.detail}
                  src={itemOne}
                  alt="image"
                  // layout="fill"
                  // objectFit="cover"
                />
              </div>
              <div
                className={classes.subItem}
                onClick={() => {
                  toggleItems("two");
                }}
              >
                <Image
                  className={classes.detail}
                  src={itemTwo}
                  alt="image"
                  // layout="fill"
                  // objectFit="cover"
                />
              </div>
              <div
                className={classes.subItem}
                onClick={() => {
                  toggleItems("three");
                }}
              >
                <Image
                  className={classes.detail}
                  src={itemThree}
                  alt="image"
                  // layout="fill"
                  // objectFit="cover"
                />
              </div>
            </div>
          </div>

          <div className={classes.details}>
            <div className={classes.box}>
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={
                    color.selected ? classes.selectedColor : classes.color
                  }
                  style={{ backgroundColor: color.type }}
                  onClick={() => {
                    selectDetails("color", color.type, index);
                  }}
                ></div>
              ))}
            </div>
            <div className={classes.box}>
              {sizes.map((size, index) => (
                <div
                  key={index}
                  className={
                    size.selected ? classes.selectedSize : classes.size
                  }
                  onClick={() => {
                    selectDetails("size", size.type, index);
                  }}
                >
                  {size.type}
                </div>
              ))}
            </div>
          </div>

          <div className={classes.alert}>{alert}</div>

          <button
            className={`mainButton ${classes.addCartBtn}`}
            onClick={() => {
              addToCart();
            }}
          >
            افزودن به سبد خرید
          </button>

          <div className={classes.information}>
            <div
              onClick={() => {
                setExtraInfo("size");
              }}
            >
              <p>راهنمای اندازه</p>
            </div>
            <div
              onClick={() => {
                setExtraInfo("shipment");
              }}
            >
              <p>روش ارسال</p>
            </div>
            <div
              onClick={() => {
                setExtraInfo("return");
              }}
            >
              <p>شرایط بازگرداندن</p>
            </div>
          </div>

          {extraInfo !== "" && (
            <div className={classes.popUp}>
              <div className={classes.cross}>
                <CloseIcon className="icon" onClick={() => setExtraInfo("")} />
              </div>
              {extraInfo === "size" && <p>Size guide</p>}
              {extraInfo === "shipment" && <p>Shimpment info</p>}
              {extraInfo === "return" && <p>Return policy</p>}
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
}

export default Product;
