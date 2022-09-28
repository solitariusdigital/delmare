import { useState, useEffect, useContext, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import classes from "./item.module.scss";
import Image from "next/image";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";

function Item({ props }) {
  const { bar, setBar } = useContext(StateContext);

  useEffect(() => {
    setBar(false);
  }, [setBar]);

  return (
    <div>
      <div className={classes.imageContainer}>
        <ExpandCircleDownIcon
          className={classes.icon}
          fontSize="large"
          sx={{ color: "#b2ffef", fontSize: 50 }}
          onClick={() => {
            props.setDisplayItem(false);
            setBar(true);
          }}
        />
        <Image
          src={props.selectedItem.image}
          alt="image"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className={classes.items}>
        <p className={classes.description}>کالای مورد نظر را انتخاب کنید</p>
        {props.selectedItem.items.map((item, index) => (
          <div key={index} className={classes.list}>
            <p>{item.price} T</p>
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Item;
