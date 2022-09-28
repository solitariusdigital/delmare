import { useContext, useEffect, Fragment } from "react";
import { StateContext } from "../../context/stateContext";
import Router from "next/router";

import Image from "next/image";
import one from "../../assets/one.jpg";
import two from "../../assets/two.jpg";
import three from "../../assets/three.jpg";

import classes from "./collections.module.scss";

function New() {
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

  return (
    <Fragment>
      <div className={classes.new}>
        {newCollection.map((collection, index) => (
          <div key={index} className={classes.item}>
            <div className={classes.banner}>
              {collection.items.map((item, index) => (
                <div key={index} className={classes.list}>
                  <p>{item.price} T</p>
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
            <Image
              src={collection.imageSrc}
              alt="image"
              layout="fill"
              objectFit="cover"
            />
          </div>
        ))}
      </div>
    </Fragment>
  );
}

export default New;
