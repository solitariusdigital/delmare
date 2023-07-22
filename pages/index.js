import { useContext, useEffect, Fragment } from "react";
import Head from "next/head";
import { StateContext } from "../context/stateContext";
import Router from "next/router";
import Image from "next/image";

export default function HomePage() {
  const { bar, setBar } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { navigation, setNavigation } = useContext(StateContext);
  const { navigationBottom, setNavigationBottom } = useContext(StateContext);
  const { container, setContainer } = useContext(StateContext);
  const sourceLink = `https://delmare.storage.iran.liara.space/landingpage/`;

  useEffect(() => {
    document.body.style.background = "#f9f7f2";
    setBar(false);
    setContainer(true);
    setNavigationBottom(true);
  }, [setBar, setContainer, setNavigationBottom]);

  useEffect(() => {
    if (!window.matchMedia("(display-mode: standalone)").matches) {
      setToggleContainer("screen");
    }
  }, [setToggleContainer]);

  const loginAction = () => {
    setToggleContainer("");
    setMenu(true);
    setRegister(true);
  };

  const collections = [
    {
      title: "لباس فشن",
      link: "/collections/clothing",
      imageSrc: `${sourceLink}eight.jpg`,
    },
    {
      title: "لوازم بهداشتی",
      link: "/collections/care",
      imageSrc: `${sourceLink}care.jpg`,
    },
  ];

  const activateNav = (link, index) => {
    sessionStorage.removeItem("positionY");
    navigation.forEach((nav, i) => {
      if (i === index) {
        Router.push(link);
        nav.active = true;
      } else {
        nav.active = false;
      }
    });
    setNavigation([...navigation]);
  };

  return (
    <Fragment>
      <Head>
        <title>Delmareh</title>
      </Head>
      {!userLogIn && (
        <div onClick={() => loginAction()} className="ctaButton">
          <p>ورود / ​ثبت نام</p>
        </div>
      )}
      <div className="collections-type">
        {collections.map((collection, index) => (
          <Fragment key={index}>
            <div
              className={
                collection.title === "لباس فشن" ? "cardClothing" : "cardCare"
              }
              onClick={() => activateNav(collection.link, index)}
            >
              <div
                className={
                  collection.title === "لباس فشن" ? "ctaClothing" : "ctaCare"
                }
              >
                <p>{collection.title}</p>
              </div>
              <Image
                className={"image"}
                src={collection.imageSrc}
                blurDataURL={collection.imageSrc}
                placeholder="blur"
                alt="image"
                layout="fill"
                objectFit="cover"
                priority
                loading="eager"
              />
            </div>
          </Fragment>
        ))}
      </div>
      <div className="message">
        <p>خرید امن و راحت از بهترین برندهای ایران و دنیا</p>
        <p>با دلماره متفاوت دیده شوید</p>
      </div>
    </Fragment>
  );
}
