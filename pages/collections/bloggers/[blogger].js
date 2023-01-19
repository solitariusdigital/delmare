import { useEffect, useState, Fragment, useContext } from "react";
import { useRouter } from "next/router";
import {
  getBloggersApi,
  getProductApi,
  updateBloggerApi,
  getUserApi,
} from "../../../services/api";
import Head from "next/head";
import { StateContext } from "../../../context/stateContext";
import Image from "next/image";
import classes from "../../page.module.scss";
import Router from "next/router";

export default function Blogger() {
  const { currentUser, seCurrentUser } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const [blogger, setBlogger] = useState([]);
  const [products, setProducts] = useState([]);

  const router = useRouter();
  let bloggerDelmareId = router.query.blogger;

  useEffect(() => {
    const fetchData = async () => {
      if (bloggerDelmareId) {
        const bloggers = await getBloggersApi();
        bloggers.forEach(async (blogger) => {
          if (blogger.delmareId === bloggerDelmareId.toUpperCase()) {
            const user = await getUserApi(blogger.userId);

            // blogger.favourites = user.favourites;
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

  const removeProduct = async (id) => {
    blogger.products.splice(blogger.products.indexOf(id), 1);
    await updateBloggerApi(blogger);
    Router.reload(window.location.pathname);
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
        <p className={classes.name}> {blogger.name}</p>
        <p>{blogger.bio}</p>
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
      </div>
    </Fragment>
  );
}
