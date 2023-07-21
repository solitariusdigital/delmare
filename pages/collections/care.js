import { Fragment, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import Router from "next/router";
import Image from "next/image";
import Head from "next/head";

export default function Care() {
  const { navigation, setNavigation } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const { container, setContainer } = useContext(StateContext);
  const sourceLink = `https://delmare.storage.iran.liara.space/landingpage/`;

  useEffect(() => {
    setBar(false);
    setContainer(true);
  }, [setBar, setContainer]);

  const collections = [
    {
      title: "مراقبت مو",
      link: "/collections/hair",
      imageSrc: `${sourceLink}hair.jpg`,
    },
    {
      title: "مراقبت پوست",
      link: "/collections/skin",
      imageSrc: `${sourceLink}face.jpg`,
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
        <title>Care Products</title>
        <meta name="description" content="Delmareh's care products" />
      </Head>
      <div className="collections-type">
        {collections.map((collection, index) => (
          <Fragment key={index}>
            <div
              className="cardCare"
              onClick={() => activateNav(collection.link, index)}
            >
              <div className="ctaCare">
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
