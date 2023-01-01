import { useState, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCart from "./ShoppingCart.module.scss";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Image from "next/image";
import classes from "./WishList.module.scss";
import { updateUserApi, getProducstApi } from "../../services/api";
import graphic from "../../assets/wishlist.png";
import Router from "next/router";

export default function WishList() {
  const { menue, setMenu } = useContext(StateContext);
  const { displayProduct, setDisplayProduct } = useContext(StateContext);
  const { selectedProduct, setSelectedProduct } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { currentUser, seCurrentUser } = useContext(StateContext);

  const [wishList, setWishList] = useState([]);
  const [like, setLike] = useState(false);

  useEffect(() => {
    setSelectedProduct({});
    setDisplayProduct(false);
    setBar(true);
  }, [setSelectedProduct, setDisplayProduct, setBar]);

  useEffect(() => {
    Router.push(`/collections/gallery`);
    const fetchData = async () => {
      const data = await getProducstApi();
      setWishList(
        data.filter((product) =>
          currentUser.favourites.includes(product["_id"])
        )
      );
    };
    fetchData().catch(console.error);
  }, [currentUser]);

  const favourProduct = async (product) => {
    if (currentUser) {
      setLike(!like);
      if (currentUser.favourites.includes(product["_id"])) {
        currentUser.favourites.splice(
          currentUser.favourites.indexOf(product["_id"]),
          1
        );
      } else {
        currentUser.favourites.unshift(product["_id"]);
      }
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
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
    setBar(false);
    setTimeout(() => {
      setToggleContainer("");
    }, 200);
  };

  return (
    <div className={ShoppingCart.slider} style={{ height: window.innerHeight }}>
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
          {wishList.map((product, index) => (
            <div key={index} className="product">
              <div className="banner">
                <p className="title">{product.title}</p>
                <div className="social">
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
                  <div className="social">
                    <VisibilityIcon className="icon" />
                    <p>{Math.round(product.views)}</p>
                  </div>
                </div>
              </div>
              <Image
                onClick={() => {
                  selectProduct(product["_id"]);
                }}
                className={classes.image}
                src={product.images.main}
                alt="image"
                layout="fill"
                objectFit="cover"
                priority={true}
                loading="eager"
              />
              {product.sale && (
                <div className="sale">
                  <p>{product.percentage}%</p>
                </div>
              )}
            </div>
          ))}
          {wishList.length === 0 && (
            <div className={classes.graphic}>
              <Image
                src={graphic}
                alt="image"
                objectFit="contain"
                layout="fill"
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
        </div>
      </div>
    </div>
  );
}
