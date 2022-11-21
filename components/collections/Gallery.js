import { useEffect, useContext, useState, Fragment } from "react";
import { StateContext } from "../../context/stateContext";
import Product from "../Product";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import classes from "./Collections.module.scss";
import Image from "next/image";
import {
  getProductApi,
  updateProductApi,
  updateUserApi,
} from "../../services/api";
import RefreshIcon from "@mui/icons-material/Refresh";

function Gallery() {
  const { menue, setMenu } = useContext(StateContext);
  const { displayProduct, setDisplayProduct } = useContext(StateContext);
  const { selectedProduct, setSelectedProduct } = useContext(StateContext);
  const { galleryCollection, setGalleryCollection } = useContext(StateContext);
  const { currentUser, seCurrentUser } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const { categories, setCategories } = useContext(StateContext);
  const { productsCollection, setProductsCollection } =
    useContext(StateContext);

  const [like, setLike] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [filter, setFilter] = useState("default");

  useEffect(() => {
    setGallery(galleryCollection);
    setBar(true);
    setDisplayProduct(false);
  }, [setDisplayProduct, setBar, galleryCollection]);

  const selectProduct = async (id) => {
    const product = await getProductApi(id);
    setSelectedProduct(product);
    setDisplayProduct(true);
    // on each click update views count
    let updateData = {
      ...product,
      views: product.views + 1.5,
    };
    await updateProductApi(updateData);
  };

  const favourProduct = async (product) => {
    if (!userLogIn) {
      setMenu(true);
      setRegister(true);
      return;
    }

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

  const filterGallery = (type) => {
    setFilter(type);
    setGallery(
      productsCollection.filter((product) => {
        return product.category === type && !product.sale;
      })
    );
  };

  return (
    <Fragment>
      {!displayProduct && (
        <div className={classes.categorySelector}>
          <select
            defaultValue={filter}
            onChange={(e) => filterGallery(e.target.value)}
          >
            <option value="default" disabled>
              دسته بندی
            </option>
            {categories.map((category, index) => {
              return (
                <option key={index} value={category}>
                  {category}
                </option>
              );
            })}
          </select>
          <RefreshIcon
            className="icon"
            onClick={() => {
              setGallery(galleryCollection);
              setFilter(filter);
            }}
            sx={{ fontSize: 24 }}
          />
        </div>
      )}
      <div className="collection-grid">
        {!displayProduct &&
          gallery
            .map((product, index) => (
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
                  onClick={() => selectProduct(product["_id"])}
                  className={classes.image}
                  src={product.images.main}
                  alt="image"
                  layout="fill"
                  objectFit="cover"
                  priority={true}
                />
              </div>
            ))
            .reverse()}
        {gallery.length === 0 && (
          <p className={classes.message}>دسته بندی نا موجود</p>
        )}
        {displayProduct && <Product favourite={like} />}
      </div>
    </Fragment>
  );
}

export default Gallery;
