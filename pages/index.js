import { useContext, useEffect, useState, Fragment } from "react";
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
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);
  const { navigationBottom, setNavigationBottom } = useContext(StateContext);
  const { container, setContainer } = useContext(StateContext);
  const { toggleType, setToggleType } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const [referralLink, setReferralLink] = useState(false);
  const sourceLink = `https://delmare.storage.iran.liara.space/landingpage/`;

  useEffect(() => {
    document.body.style.background = "#f9f7f2";
    setBar(false);
    setContainer(true);
    setNavigationBottom(false);
  }, [setBar, setContainer, setNavigationBottom, referralLink]);

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

  const generateReferralCode = () => {
    navigator.clipboard.writeText(
      `https://delmareh.com/referral/${currentUser.phone.slice(-5)}`
    );
    setReferralLink(true);
    setTimeout(() => {
      setReferralLink(false);
    }, 3000);
  };

  const collections = [
    {
      title: "کالکشن لباس",
      type: "clothing",
      link: "/collections/clothing",
      imageSrc: `${sourceLink}eight.jpg`,
    },
    {
      title: "لوازم بهداشتی",
      type: "care",
      link: "/collections/care",
      imageSrc: `${sourceLink}care.jpg`,
    },
  ];

  const activateNav = (type, link, index) => {
    sessionStorage.removeItem("positionY");
    setToggleType(type);
    navigationTopBar.forEach((nav, i) => {
      if (i === index) {
        Router.push(link);
        nav.active = true;
      } else {
        nav.active = false;
      }
    });
    setNavigationTopBar([...navigationTopBar]);
  };

  return (
    <Fragment>
      <Head>
        <title>Delmareh</title>
      </Head>
      {userLogIn ? (
        <div className="referral">
          <div onClick={() => generateReferralCode()} className="ctaButton">
            {referralLink ? <p>لینک ذخیره شد</p> : <p>دعوت دوستان</p>}
          </div>
          <p className="message">
            به دوستان خود لینک ثبت نام ارسال کنید و با ورود هر کدام به دلماره
            500 امتیاز خرید از دلماره دریافت کنید
          </p>
        </div>
      ) : (
        <div onClick={() => loginAction()} className="ctaButton">
          <p>ورود / ​ثبت نام</p>
        </div>
      )}
      <div className="collections-type">
        {collections.map((collection, index) => (
          <Fragment key={index}>
            <div
              className={
                collection.type === "clothing" ? "cardClothing" : "cardCare"
              }
              onClick={() =>
                activateNav(collection.type, collection.link, index)
              }
            >
              <div
                className={
                  collection.type === "care" ? "ctaClothing" : "ctaCare"
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
