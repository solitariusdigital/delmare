import { Fragment, useContext } from "react";
import { StateContext } from "../../context/stateContext";
import Router from "next/router";
import Image from "next/image";
import Head from "next/head";
import sale from "../../assets/sale.png";

function CollectionsPage() {
  const { navigation, setNavigation } = useContext(StateContext);
  const { searchControl, setSearchControl } = useContext(StateContext);
  const sourceLink = `https://delmare.storage.iran.liara.space/landingpage/`;

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
      imageSrc: `${sourceLink}eight.jpg`,
    },
    {
      title: "برند",
      link: "/collections/brands",
      imageSrc: `${sourceLink}ten.jpg`,
    },
  ];

  const activateNav = (link, index) => {
    Router.push(`${link}`);
    navigation.map((nav, i) => {
      if (i === index) {
        if (nav.title === "برند") {
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
        <div className="copyright">
          <p>
            استفاده از مطالب وب اپلیکیشن دلماره فقط برای مقاصد غیر تجاری و با
            ذکر منبع بلامانع است
          </p>
          <p>کليه حقوق اين وب اپلیکیشن به دلماره تعلق دارد</p>
          <p>
            <span onClick={() => Router.push("/")}>delmareh.com</span> - 2023
            @Copyright
          </p>
        </div>
      </div>
    </Fragment>
  );
}

export default CollectionsPage;
