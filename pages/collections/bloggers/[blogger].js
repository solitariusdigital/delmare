import { useEffect, useState, Fragment, useContext } from "react";
import { useRouter } from "next/router";
import {
  getBloggerApi,
  getProducstApi,
  getBloggersApi,
} from "../../../services/api";
import Head from "next/head";
import { StateContext } from "../../../context/stateContext";
import Image from "next/image";
import classes from "../../page.module.scss";

export default function Blogger() {
  const [blogger, setBlogger] = useState([]);
  const { bar, setBar } = useContext(StateContext);

  const router = useRouter();
  let bloggerDelmareId = router.query.blogger;

  useEffect(() => {
    const fetchData = async () => {
      if (bloggerDelmareId) {
        const products = await getProducstApi();
        const bloggers = await getBloggersApi();
        bloggers.forEach(async (blogger) => {
          if (blogger.delmareId === bloggerDelmareId.toUpperCase()) {
            const bloggerData = await getBloggerApi(blogger["_id"]);
            setBlogger(bloggerData);
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
        <p>{blogger.name}</p>
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
      </div>
    </Fragment>
  );
}
