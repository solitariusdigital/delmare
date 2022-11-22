import { useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import Router from "next/router";
import Image from "next/image";

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
      title: "Gallery",
      link: "/collections/gallery",
      imageSrc: `${sourceLink}one.jpg`,
    },
    {
      title: "Sale",
      link: "/collections/sale",
      imageSrc: `${sourceLink}three.jpg`,
    },
    {
      title: "Brands",
      link: "/collections/brands",
      imageSrc: `${sourceLink}ten.jpg`,
    },
    // {
    //   title: "Bloggers",
    //   link: "/collections/bloggers",
    //   imageSrc: `${sourceLink}seven.jpg`,
    // },
  ];

  const activateNav = (link, index) => {
    Router.push(`${link}`);
    navigation.map((nav, i) => {
      if (i === index) {
        if (nav.title === "Brands") {
          setSearchControl(false);
        } else {
          setSearchControl(true);
        }
        nav.active = !nav.active;
      } else {
        nav.active = false;
      }
    });
    setNavigation([...navigation]);
  };

  return (
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
  );
}

export default CollectionsPage;
