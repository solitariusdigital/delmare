import { useState, useEffect, useContext, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import classes from "./product.module.scss";
import Image from "next/image";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import itemDetail from "../assets/mainItem.jpg";
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
  const [mainItem, setMainItem] = useState(itemDetail);
  const [itemOne, setItemOne] = useState(one);
  const [itemTwo, setItemTwo] = useState(two);
  const [itemThree, setItemThree] = useState(three);
  const [toggle, setToggle] = useState(true);

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
        setMainItem(one);
        setItemTwo(two);
        setItemThree(three);
        if (toggle) {
          setItemOne(itemDetail);
          setToggle(false);
        } else {
          setMainItem(itemDetail);
          setItemOne(one);
          setToggle(true);
        }
        break;
      case "two":
        setMainItem(two);
        setItemOne(one);
        setItemThree(three);
        if (toggle) {
          setItemTwo(itemDetail);
          setToggle(false);
        } else {
          setMainItem(itemDetail);
          setItemTwo(two);
          setToggle(true);
        }
        break;
      case "three":
        setMainItem(three);
        setItemOne(one);
        setItemTwo(two);
        if (toggle) {
          setItemThree(itemDetail);
          setToggle(false);
        } else {
          setMainItem(itemDetail);
          setItemThree(three);
          setToggle(true);
        }
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
        </div>
      )}
    </Fragment>
  );
}

export default Product;
