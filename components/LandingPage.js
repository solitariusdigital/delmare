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
  const [categories, setCategories] = useState(false);
  const sourceLink = `https://delmare.storage.iran.liara.space/landingpage/`;

  useEffect(() => {
    document.body.style.background = "#f9f7f2";
    setBar(false);
    setContainer(true);
    setDivHeight(window.innerHeight - 50);
    setTimeout(() => {
      setCategories(true);
    }, 200);
  }, [setBar, setContainer]);

  useEffect(() => {
    // check if user is using pwa
    if (!window.matchMedia("(display-mode: standalone)").matches) {
      setToggleContainer("screen");
    }
  }, [setToggleContainer]);

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
      <div className={classes.imageContainer} style={{ height: divHeight }}>
        {categories && (
          <div className={classes.categories}>
            <div onClick={() => activateNav("/collections/gallery", "گالری")}>
              <p>گالری</p>
            </div>
            <div onClick={() => Router.push("/collections")}>
              <p>کالکشن</p>
            </div>
            <div onClick={() => activateNav("/collections/bloggers", "بلاگرز")}>
              <p>بلاگرز</p>
            </div>
            {!userLogIn ? (
              <div className={classes.beat} onClick={() => loginAction()}>
                <p>ورود / ​ثبت نام</p>
              </div>
            ) : (
              <div onClick={() => activateNav("/collections/sale", "تخفیف")}>
                <p>تخفیف</p>
              </div>
            )}
          </div>
        )}
        <Image
          className={classes.image}
          onClick={() => Router.push("/collections")}
          src={`${sourceLink}graphic.jpg`}
          blurDataURL={`${sourceLink}graphic.jpg`}
          placeholder="blur"
          alt="image"
          layout="fill"
          objectFit="cover"
          priority
          loading="eager"
        />
        <div
          className={classes.message}
          onClick={() => Router.push("/collections")}
        >
          <p>خرید امن و راحت از بهترین برندهای ایران و دنیا</p>
          <p>با دلماره متفاوت دیده شوید</p>
        </div>
        {!userLogIn && (
          <div className={classes.discount}>
            <div onClick={() => loginAction()}>
              <p>هدیه %15 تخفیف خرید اول برای مشتریان جدید</p>
              <p>اعتبار تا پایان خرداد 1402</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
