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

  const [divHeight, setDivHeight] = useState(null);
  const sourceLink = `https://delmare.storage.iran.liara.space/landingpage/`;

  useEffect(() => {
    document.body.style.background = "#f9f7f2";
    setBar(false);
    setContainer(true);
    setDivHeight(window.innerHeight - 50);
  }, [setBar, setContainer]);

  useEffect(() => {
    if (!window.matchMedia("(display-mode: standalone)").matches) {
      setToggleContainer("screen");
    }
  }, [setToggleContainer]);

  const imagesArray = [
    "one.jpg",
    "two.jpg",
    "three.jpg",
    "five.jpg",
    "six.jpg",
    "seven.jpg",
    "eight.jpg",
    "nine.jpg",
    "ten.jpg",
    "eleven.jpg",
  ];

  const loginAction = () => {
    setToggleContainer("");
    setMenu(true);
    setRegister(true);
  };

  const activateNav = (link, title) => {
    const updatedNavigation = navigation.map((nav) => {
      if (title === nav.title) {
        Router.push(link);
        return { ...nav, active: true };
      }
      return { ...nav, active: false };
    });
    setNavigation(updatedNavigation);
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
      <div
        className={classes.imageContainer}
        style={{ height: divHeight }}
        onClick={() => Router.push("/collections")}
      >
        <Image
          className={classes.image}
          src={`${sourceLink}${
            imagesArray[Math.floor(Math.random() * imagesArray.length)]
          }`}
          blurDataURL={`${sourceLink}${
            imagesArray[Math.floor(Math.random() * imagesArray.length)]
          }`}
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
