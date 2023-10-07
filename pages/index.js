import { useContext, useEffect, useState, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import Router from "next/router";
import Image from "next/legacy/image";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { NextSeo } from "next-seo";
import dbConnect from "../services/dbConnect";
import ProductModel from "../models/Product";
import Highlight from "../components/Highlight";

export default function HomePage({
  newItems,
  newSales,
  mostViews,
  cheapestItems,
}) {
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
  const [displayDesc, setDisplayDesc] = useState(false);
  const sourceLink = `https://delmare.storage.iran.liara.space/landingpage/`;

  useEffect(() => {
    document.body.style.background = "#f9f7f2";
    setBar(false);
    setContainer(true);
    setNavigationBottom(false);
    setDisplayDesc(false);
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
      title: "کالکشن مد",
      type: "gallery",
      link: "/collections/gallery",
      imageSrc: `${sourceLink}eight.jpg`,
    },
    {
      title: "محصولات بهداشتی",
      type: "care",
      link: "/collections/skin",
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
      <NextSeo
        title="Delmareh"
        description="خرید امن و راحت از بهترین برندهای ایران و دنیا"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://delmareh.com/",
          siteName: "Delmareh",
        }}
      />
      {userLogIn ? (
        <div className="referral">
          <div className="row">
            <div
              onClick={() => setDisplayDesc(!displayDesc)}
              className="ctaButton"
            >
              <p>با دوستات خرید کن</p>
            </div>
          </div>
          {displayDesc && (
            <div className="info animate__animated animate__fadeInUp">
              <p className="message">
                دعوت دوستان و دریافت اعتبار ویژه تا پایان آبان ماه
              </p>
              <p className="message">
                <span className="row">
                  <MonetizationOnIcon
                    className="gold-icon"
                    sx={{ fontSize: 20 }}
                  />
                  <span>100,000 T</span>
                </span>
                اعتبار خرید برای هر دعوت موفق
              </p>
              <p className="message">
                <span className="row">
                  <MonetizationOnIcon
                    className="gold-icon"
                    sx={{ fontSize: 20 }}
                  />
                  <span>50,000 T</span>
                </span>
                اعتبار خرید برای دوستان دعوت شده
              </p>
              <p className="message">
                <span className="row">
                  <MonetizationOnIcon
                    className="gold-icon"
                    sx={{ fontSize: 20 }}
                  />
                  <span>200,000 T</span>
                </span>
                سقف استفاده هر خرید برای محصولات بدون تخفیف
              </p>
              <div
                onClick={() => generateReferralCode()}
                className="ctaButton-referral"
              >
                {referralLink ? <p>لینک کپی شد</p> : <p>لینک دعوت دوستان</p>}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div onClick={() => loginAction()} className="ctaButton">
          <p>ورود / ​ثبت نام</p>
        </div>
      )}
      <div className="highlight">
        <h4>جدید</h4>
        <Highlight products={newItems} />
      </div>
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
                  collection.type === "clothing" ? "ctaClothing" : "ctaCare"
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
            {index === 0 && (
              <div className="highlight">
                <h4>تخفیف ویژه</h4>
                <Highlight products={newSales} />
              </div>
            )}{" "}
            {index === 0 && (
              <div className="highlight">
                <h4>بیشترین بازدید</h4>
                <Highlight products={mostViews} />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <div className="highlight">
        <h4>ارزانترین</h4>
        <Highlight products={cheapestItems} />
      </div>
      <div className="message">
        <h4>خرید امن و راحت از بهترین برندهای ایران و دنیا</h4>
        <h2>دِل، مارا خواهد بُرد</h2>
      </div>
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const products = await ProductModel.find();
    const newItems = products
      .filter((product) => {
        return product.activate && product.display && !product.sale;
      })
      .reverse()
      .slice(0, 5);
    const newSales = products
      .filter((product) => {
        return product.activate && product.display && product.sale;
      })
      .reverse()
      .slice(0, 5);
    const mostViews = products
      .filter((product) => {
        return product.activate && product.display;
      })
      .sort((a, b) => {
        return b.views - a.views;
      })
      .slice(0, 5);
    const cheapestItems = products
      .filter((product) => {
        return product.activate && product.display;
      })
      .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      .slice(0, 5);

    return {
      props: {
        newItems: JSON.parse(JSON.stringify(newItems)),
        newSales: JSON.parse(JSON.stringify(newSales)),
        mostViews: JSON.parse(JSON.stringify(mostViews)),
        cheapestItems: JSON.parse(JSON.stringify(cheapestItems)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
