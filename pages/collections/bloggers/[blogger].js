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
    setProducts([]);
    const fetchData = async () => {
      if (bloggerDelmareId) {
        const bloggers = await getBloggersApi();
        bloggers.forEach(async (blogger) => {
          if (blogger.delmareId === bloggerDelmareId.toUpperCase()) {
            const user = await getUserApi(blogger.userId);
            setBlogger({ ...blogger, favourites: user.favourites });

            user.favourites.forEach(async (productId) => {
              let getProduct = await getProductApi(productId);
              setProducts((oldArray) => [
                ...oldArray,
                { link: getProduct.images.main, id: productId },
              ]);
            });
          }
        });
      }
    };
    setBar(true);
    setDivHeight(window.innerHeight);
    fetchData().catch(console.error);
  }, [bloggerDelmareId, setBar, currentUser]);

  // check if user follows blogger
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        const user = await getUserApi(currentUser["_id"]);
        if (user.follows.includes(blogger["_id"])) {
          setFollowAction(false);
        } else {
          setFollowAction(true);
        }
      }
    };
    fetchData().catch(console.error);
  }, [currentUser, blogger]);

  useEffect(() => {
    const fetchData = async () => {
      // update views count
      let updateData = {
        ...blogger,
        views: blogger.views + 1.5,
      };
      await updateBloggerApi(updateData);
    };
    fetchData().catch(console.error);
  }, [blogger]);

  const follow = async (id) => {
    if (!userLogIn) {
      setMenu(true);
      setRegister(true);
      return;
    }

    const user = await getUserApi(currentUser["_id"]);
    const blogger = await getBloggerApi(id);

    // update blogger
    if (blogger.followers.includes(user["_id"])) {
      blogger.followers.splice(blogger.followers.indexOf(user["_id"]), 1);
    } else {
      blogger.followers.push(user["_id"]);
    }

    // update user
    if (user.follows) {
      if (user.follows.includes(id)) {
        user.follows.splice(user.follows.indexOf(id), 1);
        setFollowAction(true);
      } else {
        user.follows.push(id);
        setFollowAction(false);
      }
    } else {
      user.follows = [id];
    }
    await updateUserApi(user);
    await updateBloggerApi(blogger);
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
    let bloggerIdContainer = [];
    if (JSON.parse(secureLocalStorage.getItem("bloggerDelmareId"))) {
      bloggerIdContainer = JSON.parse(
        secureLocalStorage.getItem("bloggerDelmareId")
      );
    }
    bloggerIdContainer.push({ [productId]: bloggerDelmareId });
    secureLocalStorage.setItem(
      "bloggerDelmareId",
      JSON.stringify(bloggerIdContainer)
    );
    Router.push(`/collections/product/${productId}`);
  };

  return (
    <Fragment>
      <Head>
        <title>Fashion Bloggers</title>
        <meta name="description" content="Fashion bloggers" />
      </Head>
      <div className={classes.blogger} style={{ height: divHeight }}>
        <div className={classes.imageContainer}>
          {blogger.image && (
            <Image
              className={classes.image}
              src={blogger.image}
              blurDataURL={blogger.image}
              placeholder="blur"
              alt="image"
              layout="fill"
              objectFit="cover"
              priority={true}
              loading="eager"
            />
          )}
        </div>
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
            {blogger.followers && (
              <div className={classes.social}>
                <p className={classes.value}>{blogger.followers.length}</p>
                <Person4Icon sx={{ fontSize: 22 }} />
              </div>
            )}
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
        <div>
          <p className={classes.name}> {blogger.name}</p>
          <p>{blogger.bio}</p>
        </div>
        {products.length > 0 && (
          <Fragment>
            <div className={classes.row}>
              <StarIcon className={classes.iconPink} sx={{ fontSize: 22 }} />
              <p className={classes.title}>آیتم های برگزیده</p>
            </div>
            <div className={classes.productContainer}>
              {products
                .map((product, index) => (
                  <div key={index}>
                    <div className={classes.product}>
                      <Image
                        className={classes.image}
                        src={product.link}
                        alt="image"
                        layout="fill"
                        objectFit="cover"
                        priority={true}
                        loading="eager"
                        onClick={() =>
                          selectProduct(product.id, blogger.delmareId)
                        }
                      />
                    </div>
                  </div>
                ))
                .slice(0, 21)}
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}
