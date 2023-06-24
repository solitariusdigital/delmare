import { Fragment, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import Router from "next/router";
import Image from "next/image";
import Head from "next/head";
import Highlight from "../../components/Highlight";

export default function CollectionsPage({
  highlightCollection,
  newItems,
  cheapestItems,
}) {
  const { navigation, setNavigation } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const { container, setContainer } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);

  const sourceLink = `https://delmare.storage.iran.liara.space/landingpage/`;

  useEffect(() => {
    document.body.style.background = "#f9f7f2";
    setBar(false);
    setContainer(true);
  }, [setBar, setContainer]);

  useEffect(() => {
    if (!window.matchMedia("(display-mode: standalone)").matches) {
      setToggleContainer("screen");
    }
  }, [setToggleContainer]);

  const collections = [
    {
      title: "گالری",
      link: "/collections/gallery",
      imageSrc: `${sourceLink}one.jpg`,
    },
    {
      title: "تخفیف",
      link: "/collections/sale",
      imageSrc: `${sourceLink}three.jpg`,
    },
    {
      title: "اکسسوری",
      link: "/collections/accessories",
      imageSrc: `${sourceLink}accessories.jpg`,
    },
    {
      title: "کفش",
      link: "/collections/shoes",
      imageSrc: `${sourceLink}shoes.jpg`,
    },
    {
      title: "بلاگرز",
      link: "/collections/bloggers",
      imageSrc: `${sourceLink}four.jpg`,
    },
    {
      title: "برندز",
      link: "/collections/brands",
      imageSrc: `${sourceLink}ten.jpg`,
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

  const loginAction = () => {
    setToggleContainer("");
    setMenu(true);
    setRegister(true);
  };

  return (
    <Fragment>
      <Head>
        <title>Collections</title>
        <meta name="description" content="Select from Delmareh's collections" />
      </Head>
      <div className="highlight">
        <h4>جدید</h4>
        <Highlight products={newItems} />
      </div>
      {!userLogIn && (
        <div onClick={() => loginAction()} className="ctaButton">
          <p>ورود / ​ثبت نام</p>
        </div>
      )}
      <div className="collections-type">
        {collections.map((collection, index) => (
          <Fragment key={index}>
            <div
              className="card"
              onClick={() => activateNav(collection.link, index)}
            >
              <div className="ctaCollection">
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
            {index === 2 && (
              <div className="highlight">
                <h4>بیشترین بازدید</h4>
                <Highlight products={highlightCollection} />
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <div className="highlight">
        <h4>ارزانترین</h4>
        <Highlight products={cheapestItems} />
      </div>
      <div className="message" onClick={() => Router.push("/collections")}>
        <p>خرید امن و راحت از بهترین برندهای ایران و دنیا</p>
        <p>با دلماره متفاوت دیده شوید</p>
      </div>
    </Fragment>
  );
}
