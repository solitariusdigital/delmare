import { useEffect, useState, useContext } from "react";
import { StateContext } from "../context/stateContext";
import Router from "next/router";
import classes from "./LandingPage.module.scss";
import Image from "next/image";

export default function LandingPage() {
  const { bar, setBar } = useContext(StateContext);
  const { container, setContainer } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);
  const { navigation, setNavigation } = useContext(StateContext);

  const [count, setCount] = useState(0);
  const [divHeight, setDivHeight] = useState(null);
  const sourceLink = `https://delmare.storage.iran.liara.space/landingpage/`;

  useEffect(() => {
    document.body.style.background = "#f9f7f2";

    setBar(false);
    setContainer(true);
    setDivHeight(window.innerHeight - 50);
    const timerId = setInterval(() => {
      setCount((count) => count + 1);
    }, 5000);
    return () => clearInterval(timerId);
  }, [setBar, setContainer]);

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

  const loginAction = () => {
    setToggleContainer("");
    setMenu(true);
    setRegister(true);
  };

  const activateNav = (link, title) => {
    navigation.forEach((nav, i) => {
      if (title === nav.title) {
        Router.push(`${link}`);
        nav.active = true;
      } else {
        nav.active = false;
      }
    });
    setNavigation([...navigation]);
  };

  return (
    <div className={classes.container}>
      <div className={classes.actions}>
        <div
          className={classes.call}
          onClick={() => activateNav("/collections/bloggers", "بلاگرز")}
        >
          <p>بلاگرز</p>
        </div>
        <div
          className={classes.call}
          onClick={() => Router.push("/collections")}
        >
          <p>کالکشن</p>
        </div>
        {!userLogIn ? (
          <div className={classes.call} onClick={() => loginAction()}>
            <p>ورود / ​ثبت نام</p>
          </div>
        ) : (
          <div
            className={classes.call}
            onClick={() => activateNav("/collections/gallery", "گالری")}
          >
            <p>گالری</p>
          </div>
        )}
      </div>
      <div className={classes.imageContainer} style={{ height: divHeight }}>
        <Image
          className={classes.image}
          onClick={() => Router.push("/collections")}
          src={assignImage()}
          blurDataURL={assignImage()}
          placeholder="blur"
          alt="image"
          layout="fill"
          objectFit="cover"
          priority
          loading="eager"
        />
      </div>
      <div
        className={classes.message}
        onClick={() => Router.push("/collections")}
      >
        <p>خرید امن و راحت از بهترین برندهای ایران و دنیا</p>
        <p>با دلماره متفاوت دیده شوید</p>
      </div>
    </div>
  );
}
