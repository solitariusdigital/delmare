import { useState, useEffect, Fragment } from "react";

import Image from "next/image";
import one from "../../assets/one.jpg";
import two from "../../assets/two.jpg";
import three from "../../assets/three.jpg";

import classes from "./collections.module.scss";
import Product from "../product";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";

function New() {
  const [displayProduct, setDisplayProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});

  const [newCollection, setNewCollection] = useState([
    {
      imageSrc: one,
      like: 122,
      views: 578,
      favoured: true,
      items: [
        {
          id: "0000",
          title: "شلوار",
          price: "550.000",
        },
        {
          id: "0000",
          title: "شال",
          price: "350.000",
        },
        {
          id: "0000",
          title: "شومیز",
          price: "1.550.000",
        },
      ],
    },
    {
      imageSrc: three,
      like: 122,
      views: 578,
      favoured: false,
      items: [
        {
          id: "0000",
          title: "شلوار",
          price: "550.000",
        },
        {
          id: "0000",
          title: "شال",
          price: "350.000",
        },
      ],
    },
    {
      imageSrc: two,
      like: 122,
      views: 578,
      favoured: true,
      items: [
        {
          id: "0000",
          title: "شلوار",
          price: "550.000",
        },
        {
          id: "0000",
          title: "شال",
          price: "350.000",
        },
      ],
    },
    {
      imageSrc: three,
      like: 122,
      views: 578,
      favoured: true,
      items: [
        {
          id: "0000",
          title: "شلوار",
          price: "550.000",
        },
        {
          id: "0000",
          title: "شال",
          price: "350.000",
        },
      ],
    },
  ]);

  const favourProduct = (index) => {
    newCollection.map((product, i) => {
      if (i === index) {
        product.favoured = !product.favoured;
      }
    });
    setNewCollection([...newCollection]);
  };

  const selectProduct = (product) => {
    setDisplayProduct(true);
    setSelectedProduct({
      id: product.id || "0000",
      image: product.imageSrc,
      items: product.items,
      like: product.like,
      views: product.views,
      favoured: product.favoured,
    });
  };

  return (
    <Fragment>
      <div className={classes.newCollection}>
        {!displayProduct &&
          newCollection.map((product, index) => (
            <div key={index} className={classes.product}>
              <div className={classes.banner}>
                <div className={classes.social}>
                  <p>{product.views}</p>
                  <VisibilityIcon className={classes.icon} />
                </div>
                <div className={classes.social}>
                  <p>{product.like}</p>
                  <div>
                    {product.favoured ? (
                      <FavoriteIcon
                        className={classes.iconRed}
                        onClick={() => favourProduct(index)}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        className={classes.icon}
                        onClick={() => favourProduct(index)}
                      />
                    )}
                  </div>
                </div>
              </div>
              <Image
                onClick={() => selectProduct(product)}
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
