import { useEffect, useState, useContext } from "react";
import { StateContext } from "../context/stateContext";
import Router from "next/router";
import classes from "./LandingPage.module.scss";
import Image from "next/image";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";

function LandingPage() {
  const { bar, setBar } = useContext(StateContext);
  const { container, setContainer } = useContext(StateContext);
  const [count, setCount] = useState(0);
  const sourceLink = `https://delmare.storage.iran.liara.space/landingpage/`;

  useEffect(() => {
    setBar(false);
    setContainer(true);
    const timerId = setInterval(() => {
      setCount((count) => count + 1);
    }, 5000);
    return () => clearInterval(timerId);
  });

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
        src={assignImage()}
        alt="image"
        layout="fill"
        objectFit="cover"
        priority={true}
        loading="eager"
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
