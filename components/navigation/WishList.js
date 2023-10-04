import { useState, useContext, useEffect, Fragment } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCart from "./ShoppingCart.module.scss";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Image from "next/legacy/image";
import classes from "./WishList.module.scss";
import {
  updateUserApi,
  getProducstApi,
  getCarestApi,
} from "../../services/api";
import likeGraphic from "../../assets/wishlist.png";
import starGraphic from "../../assets/star.png";
import Router from "next/router";
import secureLocalStorage from "react-secure-storage";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { convertNumber, abbreviateNumber } from "../../services/utility";

export default function WishList() {
  const { selectedProduct, setSelectedProduct } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);

  const [wishList, setWishList] = useState([]);
  const [like, setLike] = useState(false);

  useEffect(() => {
    setSelectedProduct({});
  }, [setSelectedProduct]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clothing = await getProducstApi();
        const care = await getCarestApi();
        const data = clothing.concat(care);
        setWishList(
          data.filter((product) =>
            currentUser.favourites.includes(product["_id"])
          )
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchData().catch(console.error);
  }, [currentUser]);

  const favourProduct = async (product) => {
    if (currentUser) {
      setLike(!like);
      const { favourites } = currentUser;
      const productIndex = favourites.indexOf(product["_id"]);
      if (productIndex !== -1) {
        favourites.splice(productIndex, 1);
      } else {
        favourites.unshift(product["_id"]);
      }
      secureLocalStorage.setItem("currentUser", JSON.stringify(currentUser));
      await updateUserApi(currentUser);
    }
  };

  const checFavourites = (product) => {
    if (currentUser) {
      return currentUser.favourites.includes(product["_id"]);
    }
  };

  const selectProduct = async (id) => {
    Router.push(`/collections/product/${id}`);
    setTimeout(() => {
      setToggleContainer("");
    }, 500);
  };

  return (
    <div className={ShoppingCart.slider} style={{ height: window.innerHeight }}>
      <div className={ShoppingCart.menu}>
        <div className={ShoppingCart.topBar}>
          <CloseIcon className="icon" onClick={() => setToggleContainer("")} />
          <div className={ShoppingCart.title}>
            {currentUser.permission === "blogger" ? (
              <p>برگزیده</p>
            ) : (
              <p>سبد آرزو</p>
            )}
          </div>
          <div className="shoppingcart-icon">
            <ShoppingCartIcon
              className="icon"
              onClick={() => setToggleContainer("cart")}
            />
            <p>{shoppingCart.length === 0 ? "" : shoppingCart.length}</p>
          </div>
        </div>
        {wishList.length === 0 && (
          <div className={ShoppingCart.graphic} style={{ marginTop: "50px" }}>
            {currentUser && currentUser.permission === "blogger" ? (
              <p>لیست برگزیده شما</p>
            ) : (
              <p>لیست آیتم مورد علاقه شما اینجا نمایش داده میشود</p>
            )}
            <Image
              src={
                currentUser && currentUser.permission === "blogger"
                  ? starGraphic
                  : likeGraphic
              }
              alt="image"
              objectFit="contain"
              layout="fill"
              priority
            />
            <a
              href="https://www.vecteezy.com/free-png/shopping-cart"
              rel="noreferrer"
              target="_blank"
            >
              Graphic by Vecteezy
            </a>
          </div>
        )}
        {wishList.length > 0 && (
          <div className="collection-grid container-list">
            {wishList.map((product, index) => (
              <Fragment key={index}>
                {product.display && (
                  <div className="product">
                    <div className="social">
                      {currentUser && currentUser.permission === "blogger" ? (
                        <div>
                          {checFavourites(product) ? (
                            <StarIcon
                              className="iconPink"
                              onClick={() => favourProduct(product)}
                            />
                          ) : (
                            <StarBorderIcon
                              className="icon"
                              onClick={() => favourProduct(product)}
                            />
                          )}
                        </div>
                      ) : (
                        <div>
                          {checFavourites(product) ? (
                            <FavoriteIcon
                              className="iconRed"
                              onClick={() => favourProduct(product)}
                            />
                          ) : (
                            <FavoriteBorderIcon
                              className="icon"
                              onClick={() => favourProduct(product)}
                            />
                          )}
                        </div>
                      )}
                      <VisibilityIcon className="icon" />
                      <p>{abbreviateNumber(Math.round(product.views))}</p>
                    </div>
                    <div className="banner">
                      <p className="value">
                        {product.sale
                          ? convertNumber(product.discount)
                          : convertNumber(product.price)}{" "}
                        T
                      </p>
                      <p className="title">{product.title}</p>
                    </div>
                    <Image
                      onClick={() => {
                        selectProduct(product["_id"]);
                      }}
                      className={classes.image}
                      src={product.images.main}
                      blurDataURL={product.images.main}
                      placeholder="blur"
                      alt="image"
                      layout="fill"
                      objectFit="cover"
                      loading="eager"
                      priority
                    />
                    {product.sale && (
                      <div className="sale">
                        <p>{product.percentage}%</p>
                      </div>
                    )}
                    {!product.activate && (
                      <div className="activate">
                        <p>تمام</p>
                      </div>
                    )}
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
