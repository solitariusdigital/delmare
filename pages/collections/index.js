import { Fragment, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import Router from "next/router";
import Image from "next/image";
import Head from "next/head";

function CollectionsPage() {
  const { bar, setBar } = useContext(StateContext);
  const { navigation, setNavigation } = useContext(StateContext);
  const { searchControl, setSearchControl } = useContext(StateContext);
  const sourceLink = `https://delmare.storage.iran.liara.space/landingpage/`;

  useEffect(() => {
    setBar(true);
  }, [setBar]);

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
      title: "برند",
      link: "/collections/brands",
      imageSrc: `${sourceLink}ten.jpg`,
    },
    {
      title: "اکسسوری",
      link: "/collections/accessories",
      imageSrc: `${sourceLink}eight.jpg`,
    },
  ];

  const activateNav = (link, index) => {
    Router.push(`${link}`);
    navigation.map((nav, i) => {
      if (i === index) {
        if (nav.title === "برند" || nav.title === "اکسسوری") {
          setSearchControl(false);
        } else {
          setSearchControl(true);
        }
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
        <title>Collections</title>
        <meta name="description" content="Select from Delmareh's collections" />
      </Head>
      <div className="collections-type">
        {collections.map((collection, index) => (
          <div
            key={index}
            className="card"
            onClick={() => activateNav(collection.link, index)}
          >
            <div className="banner">
              <p>{collection.title}</p>
            </div>
            <Image
              className={"image"}
              src={collection.imageSrc}
              alt="image"
              layout="fill"
              objectFit="cover"
              priority={true}
              loading="eager"
            />
          </div>
        ))}
      </div>
    </Fragment>
  );
}

export default CollectionsPage;
