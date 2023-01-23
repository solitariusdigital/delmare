import { useState, useEffect, Fragment, useContext } from "react";
import classes from "./Bloggers.module.scss";
import { getUserApi } from "../services/api";
import Image from "next/image";
import loadingImage from "../assets/loader.png";
import Router from "next/router";
import { StateContext } from "../context/stateContext";
import StarIcon from "@mui/icons-material/Star";
import Person4Icon from "@mui/icons-material/Person4";

export default function Bloggers({ bloggersData }) {
  const [bloggers, setBloggers] = useState([]);
  const { bar, setBar } = useContext(StateContext);
  const { searchControl, setSearchControl } = useContext(StateContext);

  useEffect(() => {
    const fetchData = async () => {
      bloggersData.forEach(async (blogger) => {
        const user = await getUserApi(blogger.userId);
        blogger.favourites = user.favourites;
        setBloggers((oldArray) =>
          [...oldArray, blogger].sort(function (a, b) {
            return b.favourites.length - a.favourites.length;
          })
        );
      });
    };
    setBar(true);
    setSearchControl(false);
    fetchData().catch(console.error);
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
            <div className={classes.info}>
              <div className={classes.row}>
                <div className={classes.social}>
                  <p className={classes.value}>{blogger.followers.length}</p>
                  <Person4Icon sx={{ fontSize: 22 }} />
                </div>
                <div className={classes.social}>
                  <p className={classes.value}>{blogger.favourites.length}</p>
                  <StarIcon
                    className={classes.iconPink}
                    sx={{ fontSize: 22 }}
                  />
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
