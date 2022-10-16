import { useState, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCart from "./ShoppingCart.module.scss";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import Image from "next/image";
import one from "../../assets/one.jpg";
import two from "../../assets/two.jpg";
import three from "../../assets/three.jpg";

import Product from "../Product";

export default function WishList() {
  const { displayProduct, setDisplayProduct } = useContext(StateContext);
  const { selectedProduct, setSelectedProduct } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);

  const [wishList, setWishList] = useState([
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
        {
          id: "0000",
          title: "شومیز",
          price: 1550000,
        },
      ],
    },
    {
      imageSrc: one,
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
      ],
    },
  ]);

  useEffect(() => {
    setSelectedProduct({});
    setDisplayProduct(false);
  }, [setSelectedProduct, setDisplayProduct]);

  const favourProduct = (index) => {
    wishList.map((product, i) => {
      if (i === index) {
        product.favoured = !product.favoured;
      }
    });
    setWishList([...wishList]);
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
    <div className={ShoppingCart.background}>
      <div className={ShoppingCart.menu}>
        <div className={ShoppingCart.topBar}>
          <CloseIcon className="icon" onClick={() => setToggleContainer("")} />
          <div className={ShoppingCart.title}>
            <p>سبد آرزو</p>
          </div>
          <div className="shoppingcart-icon">
            <ShoppingCartIcon
              className="icon"
              onClick={() => setToggleContainer("cart")}
            />
            <p>{shoppingCart.length === 0 ? "" : shoppingCart.length}</p>
          </div>
        </div>

        <div className="collection-grid wish-list">
          {!displayProduct &&
            wishList.map((product, index) => (
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
      </div>
    </div>
  );
}
