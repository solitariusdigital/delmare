import { useState, useEffect, Fragment } from "react";

import Image from "next/image";
import one from "../../assets/one.jpg";
import two from "../../assets/two.jpg";
import three from "../../assets/three.jpg";

import classes from "./collections.module.scss";
import Product from "../product";

function New() {
  const [displayProduct, setDisplayProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    id: null,
    image: null,
    items: null,
  });

  const newCollection = [
    {
      imageSrc: one,
      items: [
        {
          id: "0000",
          title: "شلوار",
          price: "550,000",
        },
        {
          id: "0000",
          title: "شال",
          price: "350,000",
        },
        {
          id: "0000",
          title: "شومیز",
          price: "1,550,000",
        },
      ],
    },
    {
      imageSrc: three,
      items: [
        {
          id: "0000",
          title: "شلوار",
          price: "550,000",
        },
        {
          id: "0000",
          title: "شال",
          price: "350,000",
        },
      ],
    },
    {
      imageSrc: two,
      items: [
        {
          id: "0000",
          title: "شلوار",
          price: "550,000",
        },
        {
          id: "0000",
          title: "شال",
          price: "350,000",
        },
      ],
    },
    {
      imageSrc: three,
      items: [
        {
          id: "0000",
          title: "شلوار",
          price: "550,000",
        },
        {
          id: "0000",
          title: "شال",
          price: "350,000",
        },
      ],
    },
  ];

  const selectProduct = (product) => {
    setDisplayProduct(true);
    setSelectedProduct({
      id: product.id || "0000",
      image: product.imageSrc,
      items: product.items,
    });
  };

  return (
    <Fragment>
      <div className={classes.newCollection}>
        {!displayProduct &&
          newCollection.map((product, index) => (
            <div
              key={index}
              className={classes.product}
              onClick={() => selectProduct(product)}
            >
              <div className={classes.banner}>
                {product.items.map((product, index) => (
                  <div key={index} className={classes.list}>
                    <p>{product.price} T</p>
                    <p>{product.title}</p>
                  </div>
                ))}
              </div>
              <Image
                className={classes.image}
                src={product.imageSrc}
                alt="image"
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        {displayProduct && (
          <Product props={{ selectedProduct, setDisplayProduct }} />
        )}
      </div>
    </Fragment>
  );
}

export default New;
