import { useState, useEffect, useContext, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import classes from "./product.module.scss";
import Image from "next/image";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import item from "../assets/mainItem.jpg";
import one from "../assets/itemOne.jpg";
import two from "../assets/itemTwo.jpg";
import three from "../assets/itemThree.jpg";

function Product({ props }) {
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

  const [colors, setColors] = useState([
    "red",
    "blue",
    "orange",
    "red",
    "blue",
  ]);
  const [sizes, setSizes] = useState(["S", "M", "L", "XL"]);

  // customer selections
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    setBar(false);
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
        setItemOne(item);
        setMainItem(one);
        setItemTwo(two);
        setItemThree(three);
        console.log(itemOne);
        break;
      case "two":
        setItemTwo(item);
        setMainItem(two);
        setItemOne(one);
        setItemThree(three);
        break;
      case "three":
        setItemThree(item);
        setMainItem(three);
        setItemOne(one);
        setItemTwo(two);
        break;
    }
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
        <div>
          <div className={classes.topBar}>
            <ArrowBackIosNewIcon
              sx={{ color: "#000000", fontSize: 30 }}
              onClick={() => {
                setDisplayDetails(false);
              }}
            />
            <div className={classes.details}>
              <p>{selectedItem.price} T</p>
              <p>{selectedItem.title}</p>
            </div>
          </div>

          <div className={classes.itemContainer}>
            <div className={classes.item}>
              <Image
                className={classes.image}
                src={mainItem}
                alt="image"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className={classes.subItemContainer}>
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
        </div>
      )}
    </Fragment>
  );
}

export default Product;
