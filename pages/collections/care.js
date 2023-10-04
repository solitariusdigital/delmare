import { Fragment, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import Router from "next/router";
import Image from "next/legacy/image";
import { NextSeo } from "next-seo";

export default function Care() {
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const { container, setContainer } = useContext(StateContext);
  const { search, setSearch } = useContext(StateContext);
  const { searchControl, setSearchControl } = useContext(StateContext);
  const { navigationBottom, setNavigationBottom } = useContext(StateContext);
  const { toggleType, setToggleType } = useContext(StateContext);
  const sourceLink = `https://delmare.storage.iran.liara.space/landingpage/`;

  useEffect(() => {
    setBar(false);
    setContainer(true);
    setSearchControl(false);
    setSearch(false);
    setNavigationBottom(true);
    setToggleType("care");
  }, [
    setBar,
    setContainer,
    setNavigationBottom,
    setSearch,
    setSearchControl,
    setToggleType,
  ]);

  const collections = [
    {
      title: "مراقبت صورت",
      collection: "skin",
      link: "/collections/skin",
      imageSrc: `${sourceLink}skin.jpg`,
    },
    {
      title: "مراقبت مو",
      collection: "hair",
      link: "/collections/hair",
      imageSrc: `${sourceLink}hair.jpg`,
    },
  ];

  const activateNav = (link, collection) => {
    sessionStorage.removeItem("positionY");
    navigationTopBar.forEach((nav) => {
      if (nav.collection === collection) {
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
        title="محصولات بهداشتی"
        description="خرید محصولات بهداشتی از دلماره"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://delmareh.com/collections/care",
          siteName: "Delmareh",
        }}
      />
      <div className="collections-type">
        {collections.map((collection, index) => (
          <Fragment key={index}>
            <div
              className="cardCare"
              onClick={() =>
                activateNav(collection.link, collection.collection)
              }
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
    </Fragment>
  );
}
