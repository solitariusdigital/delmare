import { useState, useEffect, useContext, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import classes from "./product.module.scss";
import Image from "next/image";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloseIcon from "@mui/icons-material/Close";

import item from "../assets/mainItem.jpg";
import one from "../assets/itemOne.jpg";
import two from "../assets/itemTwo.jpg";
import three from "../assets/itemThree.jpg";

function Product({ props }) {
  const { bar, setBar } = useContext(StateContext);
  const { shoppingCard, setShoppingCard } = useContext(StateContext);

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
    "red",
    "blue",
    "orange",
    "pink",
    "green",
  ]);
  const [sizes, setSizes] = useState(["S", "M", "L", "XL"]);
  const [alert, setAlert] = useState("");

  // customer selections
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    setBar(false);
    setExtraInfo("");
  }, [setBar]);

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

  const addToCard = () => {
    if (selectedColor === "" || selectedSize === "") {
      setAlert("Please select a color or size");
      setTimeout(() => {
        setAlert("");
      }, 3000);
      return;
    }
    setShoppingCard([
      ...shoppingCard,
      {
        id: "0000",
        size: selectedSize,
        color: selectedColor,
        price: selectedItem.price,
        shipping: "",
      },
    ]);

    localStorage.setItem("shoppingCard", JSON.stringify(shoppingCard));
    setSelectedColor("");
    setSelectedSize("");
  };

  return (
    <Fragment>
      {/* product */}
      {!displayDetails && (
        <div>
          <div className={classes.productContainer}>
            <ArrowBackIosNewIcon
              className={classes.icon}
              sx={{ color: "#000000", fontSize: 30 }}
              onClick={() => {
                props.setDisplayProduct(false);
                setBar(true);
              }}
            />
            <Image
              className={classes.image}
              src={props.selectedProduct.image}
              alt="image"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className={classes.product}>
            <p className={classes.description}>کالای مورد نظر را انتخاب کنید</p>
            {props.selectedProduct.items.map((item, index) => (
              <div
                key={index}
                className={classes.list}
                onClick={() => {
                  selectItem(item);
                }}
              >
                <p>{item.price} T</p>
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
                setDisplayDetails(false);
                setSelectedColor("");
                setSelectedSize("");
                setExtraInfo("");
              }}
            />
            <div className={classes.item}>
              <p>{selectedItem.price} T</p>
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
                  className={classes.color}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setSelectedColor(color);
                  }}
                ></div>
              ))}
            </div>
            <div className={classes.box}>
              {sizes.map((size, index) => (
                <div
                  key={index}
                  className={classes.size}
                  onClick={() => {
                    setSelectedSize(size);
                  }}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          <div className={classes.alert}>{alert}</div>

          <button
            className={`mainButton ${classes.button}`}
            onClick={() => {
              addToCard();
            }}
          >
            Add to card
          </button>

          <div className={classes.information}>
            <div
              onClick={() => {
                setExtraInfo("size");
              }}
            >
              <p>Size guide</p>
            </div>
            <div
              onClick={() => {
                setExtraInfo("shipment");
              }}
            >
              <p>Shipment methods</p>
            </div>
            <div
              onClick={() => {
                setExtraInfo("return");
              }}
            >
              <p>Return policy</p>
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
