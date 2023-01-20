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

export default function Blogger() {
  const { register, setRegister } = useContext(StateContext);
  const { menue, setMenu } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { currentUser, seCurrentUser } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const [blogger, setBlogger] = useState([]);
  const [products, setProducts] = useState([]);
  const [followAction, setFollowAction] = useState(true);

  const router = useRouter();
  let bloggerDelmareId = router.query.blogger;

  useEffect(() => {
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
    fetchData().catch(console.error);
  }, [bloggerDelmareId, setBar, currentUser]);

  // check if user follows blogger
  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserApi(currentUser["_id"]);
      if (user.follows.includes(blogger["_id"])) {
        setFollowAction(false);
      }
    };
    fetchData().catch(console.error);
  }, [currentUser, blogger]);

  const follow = async (id) => {
    if (!userLogIn) {
      setMenu(true);
      setRegister(true);
      return;
    }

    const user = await getUserApi(currentUser["_id"]);
    const blogger = await getBloggerApi(id);

    // update blogger
    if (blogger.followers.includes(currentUser["_id"])) {
      blogger.followers.splice(
        blogger.followers.indexOf(currentUser["_id"]),
        1
      );
    } else {
      blogger.followers.push(currentUser["_id"]);
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

  return (
    <Fragment>
      <Head>
        <title>Fashion Bloggers</title>
        <meta name="description" content="Fashion bloggers" />
      </Head>
      <div className={classes.blogger}>
        <div className={classes.imageContainer}>
          {blogger.image && (
            <Image
              className={classes.image}
              src={blogger.image}
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
              <p className={classes.value}>{products.length}</p>
              <StarIcon className={classes.iconPink} sx={{ fontSize: 22 }} />
            </div>
            <ShareIcon
              className="icon shareIcon"
              onClick={() => copyLink()}
              sx={{ fontSize: 20 }}
            />
          </div>
        </div>
        <div>
          <p className={classes.title}> {blogger.name}</p>
          <p>{blogger.bio}</p>
        </div>
        {products.length > 0 && (
          <Fragment>
            <p className={classes.title}>آیتم های برگزیده برای شما</p>
            <div className={classes.productContainer}>
              {products.map((product, index) => (
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
                        Router.push(`/collections/product/${product.id}`)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}
