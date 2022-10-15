import { useState, useEffect, Fragment, useContext } from "react";
import { StateContext } from "../../context/stateContext";

import Image from "next/image";
import one from "../../assets/one.jpg";
import two from "../../assets/two.jpg";
import three from "../../assets/three.jpg";

import classes from "./collections.module.scss";
import Product from "../ProductPage";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";

function New() {
  const { displayProduct, setDisplayProduct } = useContext(StateContext);
  const { selectedProduct, setSelectedProduct } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);

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
          price: 550000,
        },
        {
          id: "0000",
          title: "شال",
          price: 350000,
        },
        {
          id: "0000",
          title: "شومیز",
          price: 1550000,
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
          price: 550000,
        },
        {
          id: "0000",
          title: "شال",
          price: 350000,
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
          price: 550000,
        },
        {
          id: "0000",
          title: "شال",
          price: 350000,
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
          price: 550000,
        },
        {
          id: "0000",
          title: "شال",
          price: 350000,
        },
      ],
    },
  ]);

  useEffect(() => {
    setSelectedProduct({});
    setDisplayProduct(false);
    setBar(true);
  }, [setSelectedProduct, setDisplayProduct, setBar]);

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
      <div className="collection-grid">
        {!displayProduct &&
          newCollection.map((product, index) => (
            <div key={index} className="product">
              <div className="banner">
                <div className="social">
                  <p>{product.views}</p>
                  <VisibilityIcon className="icon" />
                </div>
                <div className="social">
                  <p>{product.like}</p>
                  <div>
                    {product.favoured ? (
                      <FavoriteIcon
                        className="iconRed"
                        onClick={() => favourProduct(index)}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        className="icon"
                        onClick={() => favourProduct(index)}
                      />
                    )}
                  </div>
                </div>
              </div>
              <Image
                onClick={() => selectProduct(product)}
                className="image"
                src={product.imageSrc}
                alt="image"
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        {displayProduct && <Product />}
      </div>
    </Fragment>
  );
}

export default New;
