import { useState, useContext } from "react";
import { StateContext } from "../../context/stateContext";
import Product from "../Product";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Image from "next/image";
import one from "../../assets/one.jpg";
import two from "../../assets/two.jpg";
import three from "../../assets/three.jpg";

function New() {
  const { displayProduct, setDisplayProduct } = useContext(StateContext);
  const { selectedProduct, setSelectedProduct } = useContext(StateContext);
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
              priority={true}
            />
          </div>
        ))}
      {displayProduct && <Product />}
    </div>
  );
}

export default New;
