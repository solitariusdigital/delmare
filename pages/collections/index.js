/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable @next/next/no-img-element */
import { Fragment, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import Router from "next/router";
import Image from "next/image";
import Head from "next/head";
import sale from "../../assets/sale.png";

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
            {collection.title === "تخفیف" && (
              <div className="sale">
                <Image
                  src={sale}
                  alt="sale"
                  objectFit="contain"
                  width={70}
                  height={70}
                />
              </div>
            )}
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
      <div className={"enamad"}>
        <a
          referrerPolicy="origin"
          rel="noopener"
          target="_blank"
          href="https://trustseal.enamad.ir/?id=311141&amp;Code=GPyVAMJIOJVa0l6MNns2"
        >
          <img
            referrerPolicy="origin"
            src="https://Trustseal.eNamad.ir/logo.aspx?id=311141&amp;Code=GPyVAMJIOJVa0l6MNns2"
            id="GPyVAMJIOJVa0l6MNns2"
            decoding="async"
            alt="enamad logo"
          />
        </a>
      </div>
    </Fragment>
  );
}

export default CollectionsPage;
