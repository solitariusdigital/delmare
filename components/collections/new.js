import { useState, useEffect, Fragment } from "react";

import Image from "next/image";
import one from "../../assets/one.jpg";
import two from "../../assets/two.jpg";
import three from "../../assets/three.jpg";

import classes from "./collections.module.scss";
import Item from "../item";

function New() {
  const [displayItem, setDisplayItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    id: null,
    image: null,
    items: null,
  });

  const newCollection = [
    {
      imageSrc: one,
      items: [
        {
          title: "شلوار",
          price: "550,000",
        },
        {
          title: "شال",
          price: "350,000",
        },
        {
          title: "شومیز",
          price: "1,550,000",
        },
      ],
    },
    {
      imageSrc: three,
      items: [
        {
          title: "شلوار",
          price: "550,000",
        },
        {
          title: "شال",
          price: "350,000",
        },
      ],
    },
    {
      imageSrc: two,
      items: [
        {
          title: "شلوار",
          price: "550,000",
        },
        {
          title: "شال",
          price: "350,000",
        },
      ],
    },
    {
      imageSrc: three,
      items: [
        {
          title: "شلوار",
          price: "550,000",
        },
        {
          title: "شال",
          price: "350,000",
        },
      ],
    },
  ];

  const selectItem = (item) => {
    setDisplayItem(true);
    setSelectedItem({
      id: item.id || "0000",
      image: item.imageSrc,
      items: item.items,
    });
  };

  return (
    <Fragment>
      <div className={classes.new}>
        {!displayItem &&
          newCollection.map((item, index) => (
            <div
              key={index}
              className={classes.item}
              onClick={() => selectItem(item)}
            >
              <div className={classes.banner}>
                {item.items.map((item, index) => (
                  <div key={index} className={classes.list}>
                    <p>{item.price} T</p>
                    <p>{item.title}</p>
                  </div>
                ))}
              </div>
              <Image
                src={item.imageSrc}
                alt="image"
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        {displayItem && <Item props={{ selectedItem, setDisplayItem }} />}
      </div>
    </Fragment>
  );
}

export default New;
