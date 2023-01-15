import { useState, useEffect, Fragment, useContext } from "react";
import classes from "./Bloggers.module.scss";
import { getBloggersApi } from "../services/api";
import Image from "next/image";
import loadingImage from "../assets/loader.png";
import Router from "next/router";
import ShareIcon from "@mui/icons-material/Share";
import { StateContext } from "../context/stateContext";

export default function Bloggers() {
  const [bloggers, setBloggers] = useState([]);
  const { bar, setBar } = useContext(StateContext);
  const { searchControl, setSearchControl } = useContext(StateContext);

  useEffect(() => {
    setBar(true);
    setSearchControl(false);

    const fetchData = async () => {
      const data = await getBloggersApi();
      setBloggers(
        data.sort(function (a, b) {
          return b.products.length - a.products.length;
        })
      );
    };
    fetchData().catch(console.error);
  }, [setBloggers, setBar, setSearchControl]);

  return (
    <Fragment>
      <div className={classes.loader}>
        {bloggers.length === 0 && (
          <Image width={50} height={50} src={loadingImage} alt="isLoading" />
        )}
      </div>
      <div className={classes.bloggers}>
        {bloggers.map((blogger, index) => (
          <div key={index} className={classes.blogger}>
            <div className={classes.imageContainer}>
              <Image
                className={classes.image}
                src={blogger.image}
                alt="image"
                layout="fill"
                objectFit="cover"
                priority={true}
                loading="eager"
                onClick={() =>
                  Router.push(`/collections/bloggers/${blogger.delmareId}`)
                }
              />
            </div>
            <div className={classes.share}>
              <ShareIcon
                className="icon"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `delmareh.com/collections/bloggers/${blogger.delmareId}`
                  )
                }
                sx={{ fontSize: 16 }}
              />
            </div>
            <div className={classes.info}>
              <div className={classes.row}>
                <p className={classes.value}>{blogger.products.length}</p>
                <p className={classes.value}>{blogger.followers.length}</p>
                <p className={classes.count}>تعداد آیتم و طرح</p>
              </div>
              <p className={classes.name}>{blogger.name}</p>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
}
