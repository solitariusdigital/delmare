import { useEffect, useState, Fragment, useContext } from "react";
import { useRouter } from "next/router";
import {
  getBloggerApi,
  getBloggersApi,
  getProductApi,
} from "../../../services/api";
import Head from "next/head";
import { StateContext } from "../../../context/stateContext";
import Image from "next/image";
import classes from "../../page.module.scss";

export default function Blogger() {
  const [blogger, setBlogger] = useState([]);
  const { bar, setBar } = useContext(StateContext);
  const [products, setProducts] = useState([]);

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

            // bloggerData.products.forEach(async (product) => {
            //   let getProduct = await getProductApi(product);
            //   setProducts((oldArray) => [...oldArray, getProduct.images.main]);
            // });
          }
        });
      }
    };
    setBar(true);
    fetchData().catch(console.error);
  }, [bloggerDelmareId, setBar]);

  return (
    <Fragment>
      <Head>
        <title>Fashion Bloggers</title>
        <meta name="description" content="Fashion bloggers" />
      </Head>
      <div className={classes.blogger}>
        <div className={classes.imageContainer}>
          <Image
            className={classes.image}
            src={blogger.image}
            alt="image"
            layout="fill"
            objectFit="cover"
            priority={true}
            loading="eager"
          />
        </div>
        <p className={classes.name}> {blogger.name}</p>
        <p>{blogger.bio}</p>
      </div>
    </Fragment>
  );
}
