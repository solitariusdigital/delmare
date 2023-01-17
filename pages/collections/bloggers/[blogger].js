import { useEffect, useState, Fragment, useContext } from "react";
import { useRouter } from "next/router";
import {
  getBloggerApi,
  getBloggersApi,
  getProductApi,
  updateBloggerApi,
} from "../../../services/api";
import Head from "next/head";
import { StateContext } from "../../../context/stateContext";
import Image from "next/image";
import classes from "../../page.module.scss";
import Router from "next/router";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import StarRateIcon from "@mui/icons-material/StarRate";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

export default function Blogger() {
  const { currentUser, seCurrentUser } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);

  const [blogger, setBlogger] = useState([]);
  const [products, setProducts] = useState([]);
  const [bloggerAccess, setBloggerAccess] = useState(false);
  const [update, setUpdate] = useState(false);
  const [rate, setRate] = useState(0);

  const router = useRouter();
  let bloggerDelmareId = router.query.blogger;

  useEffect(() => {
    const fetchData = async () => {
      if (bloggerDelmareId) {
        const bloggers = await getBloggersApi();
        bloggers.forEach(async (blogger) => {
          if (blogger.delmareId === bloggerDelmareId.toUpperCase()) {
            const bloggerData = await getBloggerApi(blogger["_id"]);
            setBlogger(bloggerData);

            bloggerData.products.forEach(async (productId) => {
              let getProduct = await getProductApi(productId);
              setProducts((oldArray) => [
                ...oldArray,
                { link: getProduct.images.main, id: productId },
              ]);
            });

            if (
              currentUser &&
              currentUser.bloggerId &&
              blogger["_id"] === currentUser.bloggerId
            ) {
              setBloggerAccess(true);
            }
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
              {bloggerAccess && (
                <div className={classes.control}>
                  <RemoveCircleIcon
                    className="icon"
                    sx={{ color: "#d40d12", fontSize: 20 }}
                    onClick={() => removeProduct(product.id)}
                  />{" "}
                  <p>حذف آیتم</p>
                </div>
              )}
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
              {/* {bloggerAccess && (
                <div className={classes.rating}>
                  <RemoveIcon
                    className="icon"
                    sx={{ fontSize: 16 }}
                    onClick={() => setRate(rate - 1)}
                  />{" "}
                  <div className={classes.rate}>
                    <StarRateIcon className="icon" sx={{ fontSize: 16 }} />{" "}
                    <p>{rate}</p>
                  </div>
                  <AddIcon
                    className="icon"
                    sx={{ fontSize: 16 }}
                    onClick={() => setRate(rate + 1)}
                  />
                </div>
              )} */}
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
}
