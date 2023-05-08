import { useState, useEffect, Fragment, useContext } from "react";
import classes from "./Bloggers.module.scss";
import { getUserApi } from "../services/api";
import Image from "next/image";
import loadingImage from "../assets/loader.png";
import Router from "next/router";
import { StateContext } from "../context/stateContext";
import Person4Icon from "@mui/icons-material/Person4";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { abbreviateNumber } from "../services/utility";

export default function Bloggers({ bloggersData }) {
  const [bloggers, setBloggers] = useState([]);
  const { bar, setBar } = useContext(StateContext);
  const { searchControl, setSearchControl } = useContext(StateContext);

  useEffect(() => {
    const fetchBloggersData = async () => {
      const bloggersWithFavourites = await Promise.all(
        bloggersData.map(async (blogger) => {
          const user = await getUserApi(blogger.userId);
          blogger.favourites = user.favourites;
          return blogger;
        })
      );

      const sortedBloggers = bloggersWithFavourites.sort(
        (a, b) => b.followers.length - a.followers.length
      );

      setBloggers(sortedBloggers);
      setBar(true);
      setSearchControl(false);
    };

    setBloggers([]);
    fetchBloggersData();
  }, [setBloggers, setBar, setSearchControl, bloggersData]);

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
              onClick={() =>
                Router.push(`/collections/bloggers/${blogger.delmareId}`)
              }
            />
            <div className={classes.info}>
              <div className={classes.row}>
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
              </div>
              <p className={classes.name}>{blogger.name}</p>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
}
