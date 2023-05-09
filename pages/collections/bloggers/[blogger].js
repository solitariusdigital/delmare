import { useEffect, useState, Fragment, useContext } from "react";
import { useRouter } from "next/router";
import {
  getBloggersApi,
  getBloggerApi,
  updateBloggerApi,
  getProductApi,
  getUserApi,
  updateUserApi,
} from "../../../services/api";
import Head from "next/head";
import { StateContext } from "../../../context/stateContext";
import Image from "next/image";
import classes from "../../page.module.scss";
import Router from "next/router";
import StarIcon from "@mui/icons-material/Star";
import Person4Icon from "@mui/icons-material/Person4";
import ShareIcon from "@mui/icons-material/Share";
import secureLocalStorage from "react-secure-storage";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { abbreviateNumber } from "../../../services/utility";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function Blogger() {
  const { register, setRegister } = useContext(StateContext);
  const { menue, setMenu } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { currentUser, seCurrentUser } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);

  const [blogger, setBlogger] = useState([]);
  const [products, setProducts] = useState([]);
  const [followAction, setFollowAction] = useState(true);
  const [divHeight, setDivHeight] = useState(null);

  const router = useRouter();
  let bloggerDelmareId = router.query.blogger;

  useEffect(() => {
    const fetchData = async () => {
      if (bloggerDelmareId) {
        const bloggers = await getBloggersApi();
        const blogger = bloggers.find(
          (blogger) => blogger.delmareId === bloggerDelmareId.toUpperCase()
        );

        if (blogger) {
          const user = await getUserApi(blogger.userId);
          setBlogger({ ...blogger, favourites: user.favourites });

          const productPromises = user.favourites.map(async (productId) => {
            const getProduct = await getProductApi(productId);
            return {
              link: getProduct.images.main,
              id: productId,
              display: getProduct.display,
            };
          });

          const products = await Promise.all(productPromises);
          setProducts(products);
        }
      }
    };

    setProducts([]);
    setBar(true);
    setDivHeight(window.innerHeight);
    fetchData().catch(console.error);
  }, [bloggerDelmareId, setBar, currentUser]);

  // check if user follows blogger
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          const user = await getUserApi(currentUser["_id"]);
          const isFollowing = user.follows.includes(blogger["_id"]);
          setFollowAction(!isFollowing);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [currentUser, blogger]);

  useEffect(() => {
    const fetchData = async () => {
      // Update views count
      if (
        currentUser &&
        JSON.parse(secureLocalStorage.getItem("currentUser"))["permission"] ===
          "admin"
      ) {
        return;
      }

      const updateData = {
        ...blogger,
        views: blogger.views + 1.5,
      };

      try {
        await updateBloggerApi(updateData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [blogger, currentUser]);

  const follow = async (id) => {
    if (!userLogIn) {
      setMenu(true);
      setRegister(true);
      return;
    }
    const user = await getUserApi(currentUser["_id"]);
    const blogger = await getBloggerApi(id);
    // update blogger
    const bloggerFollowersIndex = blogger.followers.indexOf(user["_id"]);
    if (bloggerFollowersIndex !== -1) {
      blogger.followers.splice(bloggerFollowersIndex, 1);
    } else {
      blogger.followers.push(user["_id"]);
    }
    // update user
    const userFollowsIndex = user.follows ? user.follows.indexOf(id) : -1;
    if (userFollowsIndex !== -1) {
      user.follows.splice(userFollowsIndex, 1);
      setFollowAction(true);
    } else {
      user.follows.push(id);
      setFollowAction(false);
    }
    await Promise.all([updateUserApi(user), updateBloggerApi(blogger)]);
    setBlogger(blogger);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `https://delmareh.com/collections/bloggers/${blogger.delmareId}`
    );
    document.querySelector(".shareIcon").classList.add(classes.shareIcon);
    setTimeout(() => {
      document.querySelector(".shareIcon").classList.remove(classes.shareIcon);
    }, 1000);
  };

  const selectProduct = (productId, bloggerDelmareId) => {
    const bloggerIdContainer =
      JSON.parse(secureLocalStorage.getItem("bloggerDelmareId")) || [];
    bloggerIdContainer.push({ [productId]: bloggerDelmareId });
    secureLocalStorage.setItem(
      "bloggerDelmareId",
      JSON.stringify(bloggerIdContainer)
    );
    Router.push(`/collections/product/${productId}`);
  };

  return (
    <div style={{ height: divHeight }}>
      <Head>
        <title>Fashion Bloggers</title>
        <meta name="description" content="Fashion bloggers" />
      </Head>
      <div className={classes.topBar}>
        <ArrowBackIosNewIcon
          className="icon"
          onClick={() => {
            Router.push("/collections/bloggers");
          }}
          sx={{ fontSize: 30 }}
        />
        <p className={classes.name}>{blogger.name}</p>
      </div>
      <div className={classes.blogger}>
        {blogger.image && (
          <div className={classes.imageContainer}>
            <Image
              className={classes.image}
              src={blogger.image}
              blurDataURL={blogger.image}
              placeholder="blur"
              alt="image"
              layout="fill"
              objectFit="cover"
              priority
              loading="eager"
            />
          </div>
        )}
        {blogger.followers && (
          <div className={classes.socialContainer}>
            {followAction ? (
              <button
                className="mainButton"
                onClick={() => follow(blogger["_id"])}
              >
                Follow
              </button>
            ) : (
              <button
                className="subButton"
                onClick={() => follow(blogger["_id"])}
              >
                Unfollow
              </button>
            )}
            <div className={classes.social}>
              <div className={classes.social}>
                <p className={classes.value}>{blogger.followers.length}</p>
                <Person4Icon sx={{ fontSize: 22 }} />
              </div>
              <div className={classes.social}>
                <p className={classes.value}>
                  {abbreviateNumber(Math.round(blogger.views))}
                </p>
                <VisibilityIcon sx={{ fontSize: 22 }} />
              </div>
              <ShareIcon
                className="icon shareIcon"
                onClick={() => copyLink()}
                sx={{ fontSize: 18 }}
              />
            </div>
          </div>
        )}
        <div className={classes.bio}>
          <p>{blogger.bio}</p>
        </div>
        {products.length > 0 && (
          <Fragment>
            <div className={classes.row}>
              <StarIcon className={classes.iconPink} sx={{ fontSize: 22 }} />
              <p className={classes.title}>آیتم های برگزیده</p>
            </div>
            {currentUser && currentUser.permission === "blogger" && (
              <p className={classes.text}>
                تنها 21 آیتم برگزیده توسط بلاگر به مشتری نمایش داده میشود
              </p>
            )}
            <div className={classes.productContainer}>
              {products
                .map((product, index) => (
                  <Fragment key={index}>
                    {product.display && (
                      <div className={classes.product}>
                        <Image
                          className={classes.image}
                          src={product.link}
                          alt="image"
                          layout="fill"
                          objectFit="cover"
                          priority
                          loading="eager"
                          onClick={() =>
                            selectProduct(product.id, blogger.delmareId)
                          }
                        />
                      </div>
                    )}
                  </Fragment>
                ))
                .slice(0, 21)}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
}
