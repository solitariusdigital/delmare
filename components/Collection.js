import { useEffect, useContext, useState, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import classes from "./Collection.module.scss";
import Image from "next/image";
import { updateUserApi } from "../services/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import loadingImage from "../assets/loader.png";
import Router from "next/router";
import secureLocalStorage from "react-secure-storage";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import ShareIcon from "@mui/icons-material/Share";
import { abbreviateNumber } from "../services/utility";

export default function Collection({
  galleryData,
  collectionType,
  brandGallery,
  brand,
}) {
  const { menue, setMenu } = useContext(StateContext);
  const { search, setSearch } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const { generalCategories, setGeneralCategories } = useContext(StateContext);
  const { accessoriesCategories, setAccessoriesCategories } =
    useContext(StateContext);
  const { seasons, setSeasons } = useContext(StateContext);
  const { searchControl, setSearchControl } = useContext(StateContext);
  const { gallery, setGallery } = useContext(StateContext);
  const { reqNumber, setReqNumber } = useContext(StateContext);

  const [categorySelector, setCategorySelector] = useState(false);
  const [seasonSelector, setSeasonSelector] = useState(false);
  const [like, setLike] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("دسته بندی");
  const [seasonFilter, setSeasonFilter] = useState("فصل");
  const [message, setMessage] = useState(false);
  const [categories, setCategories] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // manage scroll position and number of items on the page
    if (sessionStorage.getItem("positionY")) {
      window.scrollTo(0, sessionStorage.getItem("positionY"));
    }
    window.addEventListener("scroll", loadMore);
  });

  useEffect(() => {
    if (collectionType === "brands") {
      setGallery(brandGallery);
      setSearchControl(false);
    } else {
      setGallery(galleryData);
      setSearchControl(true);
      if (collectionType === "shoes") {
        setSearchControl(false);
        setSearch(false);
      }
    }
    switch (collectionType) {
      case "gallery":
      case "sale":
        setCategories(generalCategories);
        break;
      case "accessories":
        setCategories(accessoriesCategories);
        break;
    }
    setMessage(false);
    setBar(true);
  }, [
    accessoriesCategories,
    brandGallery,
    collectionType,
    galleryData,
    generalCategories,
    setBar,
    setGallery,
    setSearch,
    setSearchControl,
  ]);

  const loadMore = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.scrollingElement.scrollHeight
    ) {
      setReqNumber(reqNumber + 20);
    }
  };

  const selectProduct = async (product) => {
    setMessage(false);
    setSearchControl(false);
    setGallery([]);
    sessionStorage.setItem("positionY", window.scrollY);
    Router.push(`/collections/product/${product["_id"]}`);
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
      secureLocalStorage.setItem("currentUser", JSON.stringify(currentUser));
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
    setReqNumber(20);
    switch (collectionType) {
      case "gallery":
        setGallery(
          galleryData.filter((product) => {
            return product.category === type && !product.sale;
          })
        );
        break;
      case "sale":
        setGallery(
          galleryData.filter((product) => {
            return product.category === type && product.sale;
          })
        );
        break;
      case "accessories":
        setGallery(
          galleryData.filter((product) => {
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
    setReqNumber(20);
    switch (collectionType) {
      case "gallery":
        setGallery(
          galleryData.filter((product) => {
            return product.season === type && !product.sale;
          })
        );
        break;
      case "sale":
        setGallery(
          galleryData.filter((product) => {
            return product.season === type && product.sale;
          })
        );
        break;
      case "accessories":
        setGallery(
          galleryData.filter((product) => {
            return product.season === type;
          })
        );
        break;
    }
    setMessage(true);
  };

  const checkDate = (date) => {
    return Date.parse(date) > Date.now() - 1000 * 60 * 60 * 24 * 7;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `https://delmareh.com/collections/brands/${brand.delmareId}`
    );
    document.querySelector(".shareIcon").classList.add(classes.shareIcon);
    setTimeout(() => {
      document.querySelector(".shareIcon").classList.remove(classes.shareIcon);
    }, 1000);
  };

  return (
    <Fragment>
      {search && collectionType !== "brands" && (
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
      {collectionType === "brands" && (
        <div className={classes.brand}>
          <p>برند {brand.title}</p>
          <ShareIcon
            className="icon shareIcon"
            onClick={() => copyLink()}
            sx={{ fontSize: 18 }}
          />
        </div>
      )}
      {gallery.length === 0 && (
        <div className={classes.loader}>
          <Image width={50} height={50} src={loadingImage} alt="isLoading" />
          {message && <p className={classes.message}>درخواست نا موجود</p>}
        </div>
      )}
      <div className="collection-grid">
        {gallery
          .map((product, index) => (
            <Fragment key={index}>
              {product.display && (
                <div className="product">
                  <div className="banner">
                    <p className="title">{product.title}</p>
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
                      <div className="social">
                        <VisibilityIcon className="icon" />
                        <p className="count">
                          {abbreviateNumber(Math.round(product.views))}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Image
                    onClick={() => selectProduct(product)}
                    className={classes.image}
                    src={product.images.main}
                    blurDataURL={product.images.main}
                    placeholder="blur"
                    alt="image"
                    layout="fill"
                    objectFit="cover"
                    priority
                    loading="eager"
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
                  {checkDate(product.createdAt) && (
                    <div className="new">
                      <p>جدید</p>
                    </div>
                  )}
                </div>
              )}
            </Fragment>
          ))
          .reverse()
          .slice(0, reqNumber)}
      </div>
    </Fragment>
  );
}
