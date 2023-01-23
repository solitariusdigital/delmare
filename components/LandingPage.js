import { useEffect, useState, useContext } from "react";
import { StateContext } from "../context/stateContext";
import Router from "next/router";
import classes from "./LandingPage.module.scss";
import Image from "next/image";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";

function LandingPage() {
  const { bar, setBar } = useContext(StateContext);
  const { container, setContainer } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const [count, setCount] = useState(0);
  const sourceLink = `https://delmare.storage.iran.liara.space/landingpage/`;

  useEffect(() => {
    document.body.style.background = "#f9f7f2";

    setBar(false);
    setContainer(true);
    const timerId = setInterval(() => {
      setCount((count) => count + 1);
    }, 5000);
    return () => clearInterval(timerId);
  });

  useEffect(() => {
    // check if user is using pwa
    if (!window.matchMedia("(display-mode: standalone)").matches) {
      setToggleContainer("screen");
    }
  }, [setToggleContainer]);

  const assignImage = () => {
    const imagesArray = [
      `${sourceLink}one.jpg`,
      `${sourceLink}two.jpg`,
      `${sourceLink}three.jpg`,
      `${sourceLink}four.jpg`,
      `${sourceLink}five.jpg`,
      `${sourceLink}six.jpg`,
      `${sourceLink}seven.jpg`,
      `${sourceLink}eight.jpg`,
      `${sourceLink}nine.jpg`,
      `${sourceLink}ten.jpg`,
      `${sourceLink}eleven.jpg`,
    ];
    const image = imagesArray.sort(() => Math.random() - 0.5)[
      count % imagesArray.length
    ];
    return image;
  };

  const collections = () => {
    Router.push("/collections");
  };

  return (
    <div
      className={classes.container}
      onClick={() => collections()}
      onTouchMove={collections}
    >
      <div className={classes.banner}>
        <p>متفاوت بپوشیم</p>
      </div>
      <Image
        className={classes.image}
        src={assignImage()}
        blurDataURL={assignImage()}
        placeholder="blur"
        alt="image"
        layout="fill"
        objectFit="cover"
        priority={true}
        loading="eager"
      />
      <div className={classes.message}>
        <p>خرید امن و راحت از بهترین برندهای ایران و دنیا</p>
        <p>با دلماره متفاوت دیده شوید</p>
      </div>
      <div className={classes.icon}>
        <ExpandCircleDownIcon
          className="icon"
          sx={{ color: "#b2ffef", fontSize: 50 }}
          onClick={() => collections()}
        />
      </div>
    </div>
  );
}

export default LandingPage;
