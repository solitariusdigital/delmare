import { useEffect, useState, useContext } from "react";
import { StateContext } from "../context/stateContext";
import Router from "next/router";
import classes from "./LandingPage.module.scss";
import Image from "next/image";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import imageOne from "../assets/one.jpg";
import imageTwo from "../assets/two.jpg";
import imageThree from "../assets/three.jpg";

function LandingPage() {
  const [count, setCount] = useState(0);
  const imagesArray = [imageOne, imageTwo, imageThree];
  const image = imagesArray[count % imagesArray.length];
  const { bar, setBar } = useContext(StateContext);

  useEffect(() => {
    setBar(false);
    const timerId = setInterval(() => {
      setCount((count) => count + 1);
    }, 5000);
    return () => clearInterval(timerId);
  });

  const handleScroll = () => {
    Router.push("/collections");
  };

  return (
    <div
      className={classes.container}
      onClick={() => Router.push("/collections")}
      onTouchMove={handleScroll}
    >
      <div className={classes.banner}>
        <p>متفاوت بپوشیم</p>
      </div>
      <Image
        className={classes.image}
        src={image}
        alt="image"
        layout="fill"
        objectFit="cover"
        priority
      />
      <div className={classes.message}>
        <p>
          یک خرید اینترنتی مطمئن، نیازمند فروشگاهی است که بتواند کالاهایی متنوع،
          باکیفیت و دارای قیمت مناسب را به دست مشتریان خود برساند
        </p>
      </div>
      <div className={classes.icon}>
        <ExpandCircleDownIcon
          className="icon"
          sx={{ color: "#b2ffef", fontSize: 50 }}
          onClick={() => Router.push("/collections")}
        />
      </div>
    </div>
  );
}

export default LandingPage;
