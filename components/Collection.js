import { useEffect, useContext, useState, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import Product from "./Product";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import classes from "./Collection.module.scss";
import Image from "next/image";
import {
  getProductApi,
  updateProductApi,
  updateUserApi,
} from "../services/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import loadingImage from "../assets/loader.png";

function Collection({ collectionType, brandGallery, brand }) {
  const { menue, setMenu } = useContext(StateContext);
  const { search, setSearch } = useContext(StateContext);
  const { displayProduct, setDisplayProduct } = useContext(StateContext);
  const { selectedProduct, setSelectedProduct } = useContext(StateContext);
  const { saleCollection, setSaleCollection } = useContext(StateContext);
  const { currentUser, seCurrentUser } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const { generalCategories, setGeneralCategories } = useContext(StateContext);
  const { accessoriesCategories, setAccessoriesCategories } =
    useContext(StateContext);
  const { seasons, setSeasons } = useContext(StateContext);
  const { productsCollection, setProductsCollection } =
    useContext(StateContext);
  const { galleryCollection, setGalleryCollection } = useContext(StateContext);
  const { accessoriesCollection, setAccessoriesCollection } =
    useContext(StateContext);
  const { searchControl, setSearchControl } = useContext(StateContext);

  const [categorySelector, setCategorySelector] = useState(false);
  const [seasonSelector, setSeasonSelector] = useState(false);
  const [like, setLike] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("دسته بندی");
  const [seasonFilter, setSeasonFilter] = useState("فصل");
  const [message, setMessage] = useState(false);
  const [reqNumber, setReqNumber] = useState(10);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    switch (collectionType) {
      case "gallery":
        setGallery(galleryCollection);
        setCategories(generalCategories);
        break;
      case "sale":
        setGallery(saleCollection);
        setCategories(generalCategories);
        break;
      case "brands":
        setGallery(brandGallery);
        break;
      case "accessories":
        setGallery(accessoriesCollection);
        setCategories(accessoriesCategories);
        break;
    }
    setBar(true);
    setDisplayProduct(false);
  }, [
    setDisplayProduct,
    setBar,
    saleCollection,
    galleryCollection,
    productsCollection,
    accessoriesCollection,
    collectionType,
    brandGallery,
    generalCategories,
    accessoriesCategories,
  ]);

  const selectProduct = async (id) => {
    setSearchControl(false);
    const product = await getProductApi(id);
    setSelectedProduct(product);
    setDisplayProduct(true);
    // on each click update views count
    if (currentUser.permission === "customer") {
      let updateData = {
        ...product,
        views: product.views + 1.5,
      };
      await updateProductApi(updateData);
    }
    window.scrollTo(0, 0);
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

  const filterCategoryCollection = (type) => {
    setCategoryFilter(type);
    setCategorySelector(false);
    setMessage(false);
    setReqNumber(10);
    switch (collectionType) {
      case "gallery":
        setGallery(
          productsCollection.filter((product) => {
            return product.category === type && !product.sale;
          })
        );
        break;
      case "sale":
        setGallery(
          productsCollection.filter((product) => {
            return product.category === type && product.sale;
          })
        );
        break;
      case "accessories":
        setGallery(
          accessoriesCollection.filter((product) => {
            return product.category === type;
          })
        );
        break;
    }
    setMessage(true);
  };

  const filterSeasonCollection = (type) => {
    setSeasonFilter(type);
    setSeasonSelector(false);
    setMessage(false);
    setReqNumber(10);
    switch (collectionType) {
      case "gallery":
        setGallery(
          productsCollection.filter((product) => {
            return product.season === type && !product.sale;
          })
        );
        break;
      case "sale":
        setGallery(
          productsCollection.filter((product) => {
            return product.season === type && product.sale;
          })
        );
        break;
      case "accessories":
        setGallery(
          accessoriesCollection.filter((product) => {
            return product.season === type;
          })
        );
        break;
    }
    setMessage(true);
  };

  const abbreviateViews = (num) => {
    return new Intl.NumberFormat("en-GB", {
      notation: "compact",
      compactDisplay: "short",
    }).format(num);
  };

  return (
    <Fragment>
      {!displayProduct && search && collectionType !== "brands" && (
        <div className={classes.category}>
          <div className={classes.selectContainer}>
            <div
              className={classes.select}
              onClick={() => {
                setCategorySelector(false);
                setSeasonSelector(!seasonSelector);
              }}
            >
              <div className={classes.icon}>
                {seasonSelector ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              <p>{seasonFilter}</p>
            </div>
            <div
              className={classes.select}
              onClick={() => {
                setCategorySelector(!categorySelector);
                setSeasonSelector(false);
              }}
            >
              <div className={classes.icon}>
                {categorySelector ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              <p>{categoryFilter}</p>
            </div>
          </div>
          {categorySelector && (
            <div className={classes.listCategory}>
              {categories.map((category, index) => {
                return (
                  <p
                    onClick={() => filterCategoryCollection(category)}
                    key={index}
                  >
                    {category}
                  </p>
                );
              })}
            </div>
          )}
          {seasonSelector && (
            <div className={classes.listSeason}>
              {seasons.map((season, index) => {
                return (
                  <p onClick={() => filterSeasonCollection(season)} key={index}>
                    {season}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      )}
      {collectionType === "brands" && !displayProduct && (
        <div className={classes.brand}>
          <p>برند {brand.title}</p>
        </div>
      )}
      <div className={classes.loader}>
        {gallery.length === 0 && (
          <Image width={50} height={50} src={loadingImage} alt="isLoading" />
        )}
      </div>
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
                      <p className="count">
                        {abbreviateViews(Math.round(product.views))}
                      </p>
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
                {product.sale && (
                  <div className="sale">
                    <p>{product.percentage}% OFF</p>
                  </div>
                )}
              </div>
            ))
            .reverse()
            .slice(0, reqNumber)}
        {gallery.length === 0 && message && (
          <p className={classes.message}>درخواست نا موجود</p>
        )}
        {displayProduct && <Product favourite={like} />}
      </div>
      {gallery.length >= 10 && !displayProduct && (
        <div className={classes.more}>
          <p onClick={() => setReqNumber(reqNumber + 10)}>آیتم بیشتر</p>
        </div>
      )}
    </Fragment>
  );
}

export default Collection;
